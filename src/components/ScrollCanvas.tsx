import { useRef, useEffect, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────
 * ScrollCanvas – 300-frame scroll-linked animation component
 *
 * Approach (same as Apple product pages):
 *  1. Preload all JPEG frames into Image objects
 *  2. Render to a <canvas> (GPU-composited, no DOM thrashing)
 *  3. Map scroll position → frame index via requestAnimationFrame
 *  4. Sample dominant colors and push to CSS custom properties
 * ────────────────────────────────────────────────────────── */

const TOTAL_FRAMES = 300;
const FRAME_PATH = '/frames/frame-'; // public/frames/frame-001.jpg

/** Pad number to 3 digits: 1 → "001" */
const pad = (n: number): string => String(n).padStart(3, '0');

/** Build frame URL for a given index (1-based) */
const getFrameUrl = (i: number): string => `${FRAME_PATH}${pad(i)}.jpg`;

/* ── Color theme keyframes ──────────────────────────────── *
 * Pre-defined color stops based on the visual tone of the
 * animation (dark vault → red heist → cinematic reveal).
 * We interpolate between these instead of sampling every
 * frame to avoid jitter and keep it smooth.                */
interface ColorStop {
  frame: number;       // frame index (0-based, 0-299)
  bg: [number, number, number];
  bgSurface: [number, number, number];
  accent: [number, number, number];
  text: [number, number, number];
  glow: [number, number, number, number]; // rgba
}

const COLOR_STOPS: ColorStop[] = [
  {
    frame: 0,
    bg: [10, 10, 10],
    bgSurface: [12, 12, 12],
    accent: [139, 0, 0],
    text: [229, 229, 229],
    glow: [139, 0, 0, 0.5],
  },
  {
    frame: 60,
    bg: [15, 8, 8],
    bgSurface: [18, 10, 10],
    accent: [160, 20, 15],
    text: [235, 225, 220],
    glow: [160, 20, 15, 0.5],
  },
  {
    frame: 120,
    bg: [20, 12, 10],
    bgSurface: [24, 14, 12],
    accent: [180, 30, 20],
    text: [240, 230, 225],
    glow: [180, 30, 20, 0.55],
  },
  {
    frame: 180,
    bg: [18, 10, 10],
    bgSurface: [22, 12, 12],
    accent: [170, 25, 18],
    text: [238, 228, 222],
    glow: [170, 25, 18, 0.5],
  },
  {
    frame: 240,
    bg: [22, 14, 12],
    bgSurface: [26, 16, 14],
    accent: [185, 35, 25],
    text: [242, 232, 228],
    glow: [185, 35, 25, 0.55],
  },
  {
    frame: 299,
    bg: [16, 10, 10],
    bgSurface: [20, 12, 12],
    accent: [155, 15, 10],
    text: [235, 225, 220],
    glow: [155, 15, 10, 0.5],
  },
];

/** Linearly interpolate between two numbers */
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Interpolate an RGB triple */
const lerpRgb = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

/** Interpolate an RGBA quad */
const lerpRgba = (
  a: [number, number, number, number],
  b: [number, number, number, number],
  t: number,
): [number, number, number, number] => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
  parseFloat(lerp(a[3], b[3], t).toFixed(2)),
];

/** Get interpolated colors for a given frame index */
function getColorsAtFrame(frame: number) {
  // Clamp
  const f = Math.max(0, Math.min(299, frame));

  // Find surrounding stops
  let lo = COLOR_STOPS[0];
  let hi = COLOR_STOPS[COLOR_STOPS.length - 1];

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (f >= COLOR_STOPS[i].frame && f <= COLOR_STOPS[i + 1].frame) {
      lo = COLOR_STOPS[i];
      hi = COLOR_STOPS[i + 1];
      break;
    }
  }

  const range = hi.frame - lo.frame || 1;
  const t = (f - lo.frame) / range;

  return {
    bg: lerpRgb(lo.bg, hi.bg, t),
    bgSurface: lerpRgb(lo.bgSurface, hi.bgSurface, t),
    accent: lerpRgb(lo.accent, hi.accent, t),
    text: lerpRgb(lo.text, hi.text, t),
    glow: lerpRgba(lo.glow, hi.glow, t),
  };
}

/** Push colors to CSS custom properties on :root */
function applyThemeColors(frame: number) {
  const c = getColorsAtFrame(frame);
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', `rgb(${c.bg.join(',')})`);
  root.style.setProperty('--theme-bg-surface', `rgb(${c.bgSurface.join(',')})`);
  root.style.setProperty('--theme-accent', `rgb(${c.accent.join(',')})`);
  root.style.setProperty('--theme-text', `rgb(${c.text.join(',')})`);
  root.style.setProperty('--theme-glow', `rgba(${c.glow.join(',')})`);
}

/* ── Component ──────────────────────────────────────────── */

interface ScrollCanvasProps {
  onEnterVault: () => void;
}

export default function ScrollCanvas({ onEnterVault }: ScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── Draw a frame onto the canvas (with fallback search) ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let img = imagesRef.current[index];

    // Fallback: If target frame isn't loaded yet, find the nearest available loaded frame
    if (!img || !img.complete) {
      let found = false;
      // Search backwards first (scrolling down path)
      for (let i = index - 1; i >= 0; i--) {
        const tempImg = imagesRef.current[i];
        if (tempImg && tempImg.complete) {
          img = tempImg;
          found = true;
          break;
        }
      }
      // Search forwards if no older frame is loaded
      if (!found) {
        for (let i = index + 1; i < TOTAL_FRAMES; i++) {
          const tempImg = imagesRef.current[i];
          if (tempImg && tempImg.complete) {
            img = tempImg;
            found = true;
            break;
          }
        }
      }
    }

    if (!img || !img.complete) return;

    // Size canvas to viewport (in device pixels for sharpness)
    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
    }

    // Reset transform and clear the full device-pixel canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale to DPR so we draw in CSS pixels
    ctx.scale(dpr, dpr);

    // Calculate cover-fit dimensions (object-fit: cover)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = vw / vh;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasAspect > imgAspect) {
      // Canvas is wider — fit width, crop height
      drawW = vw;
      drawH = vw / imgAspect;
      drawX = 0;
      drawY = (vh - drawH) / 2;
    } else {
      // Canvas is taller — fit height, crop width
      drawH = vh;
      drawW = vh * imgAspect;
      drawX = (vw - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── Preload all frames progressively ───────────────── */
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    // Load first frame immediately to unblock the landing page rendering
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    images[0] = firstImg;

    const startLoadingRemaining = () => {
      // Load remaining 299 frames in the background
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameUrl(i + 1);

        img.onload = () => {
          loadedCount++;
          const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(progress);
        };

        img.onerror = () => {
          loadedCount++;
          const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(progress);
        };

        images[i] = img;
      }
    };

    firstImg.onload = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      setIsLoaded(true);
      drawFrame(0);
      applyThemeColors(0);
      // Start background load of all remaining frames
      startLoadingRemaining();
    };

    firstImg.onerror = () => {
      // In case first frame fails, unblock and load the rest
      loadedCount++;
      setIsLoaded(true);
      startLoadingRemaining();
    };

    imagesRef.current = images;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  /* ── Scroll handler (RAF-throttled) ─────────────────── */
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.offsetHeight - window.innerHeight;

        // How far through the container we've scrolled (0 → 1)
        const rawProgress = -rect.top / scrollableHeight;
        const progress = Math.max(0, Math.min(1, rawProgress));

        // Map to frame index
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * TOTAL_FRAMES),
        );

        // Only redraw if frame changed
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
          applyThemeColors(frameIndex);
        }

        // Direct DOM manipulation for CTA opacity (eco-friendly, no re-renders)
        const cta = ctaRef.current;
        if (cta) {
          // Fade in the CTA during the last 5% of the scroll
          const ctaOpacity = Math.max(0, Math.min(1, (progress - 0.95) * 20));
          cta.style.opacity = ctaOpacity.toString();
          cta.style.pointerEvents = ctaOpacity > 0.5 ? 'auto' : 'none';
          cta.style.transform = `translateX(-50%) translateY(${(1 - ctaOpacity) * 20}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial draw
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  /* ── Resize handler ─────────────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      // Reset canvas dimensions on resize
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      className="scroll-canvas-container"
      style={{ height: '300vh', position: 'relative' }}
    >
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="scroll-canvas-loader">
          <div className="scroll-canvas-loader__inner">
            <div className="scroll-canvas-loader__icon">
              {/* Vault door SVG icon */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
                <path d="M32 4 L32 12 M32 52 L32 60 M4 32 L12 32 M52 32 L60 32" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="var(--theme-accent, #8b0000)"
                  strokeWidth="2.5"
                  strokeDasharray={`${loadProgress * 1.76} 176`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  style={{ transition: 'stroke-dasharray 0.3s ease' }}
                />
              </svg>
            </div>
            <div className="scroll-canvas-loader__text">
              <span className="scroll-canvas-loader__label">ACCESSING VAULT</span>
              <span className="scroll-canvas-loader__pct">{loadProgress}%</span>
            </div>
            <div className="scroll-canvas-loader__bar">
              <div
                className="scroll-canvas-loader__fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky canvas viewport */}
      <div
        className="scroll-canvas-sticky"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          className="scroll-canvas-el"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Gradient overlay at bottom for smooth transition to content */}
        <div
          className="scroll-canvas-gradient"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, var(--theme-bg, #0a0a0a), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* "Enter the Vault" CTA overlaid at bottom center */}
        <div
          ref={ctaRef}
          className="scroll-canvas-cta transition-all duration-75"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <button
            onClick={onEnterVault}
            className="group relative overflow-hidden bg-brand-red text-white font-display text-2xl px-12 py-5 rounded-sm btn-glow uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl"
          >
            <span className="relative z-10 pointer-events-none">
              Enter the Vault
            </span>
          </button>
        </div>

        {/* Scroll indicator */}
        {isLoaded && (
          <div className="scroll-canvas-scroll-hint">
            <div className="scroll-canvas-scroll-hint__arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
            <span className="scroll-canvas-scroll-hint__text">SCROLL TO EXPLORE</span>
          </div>
        )}
      </div>
    </div>
  );
}
