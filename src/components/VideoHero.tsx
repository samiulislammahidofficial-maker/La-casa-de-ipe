import { useRef, useEffect, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────
 * VideoHero – Click-to-play frame animation (Desktop) / Static (Mobile)
 *
 * Key behavior:
 *  1. Desktop: Page loads instantly with frame-001 as static poster.
 *     - "Enter to Initiate" button overlaid on the poster.
 *     - Clicking play begins loading + playing frames once, freezes on final frame.
 *  2. Mobile: Video player is completely disabled/hidden.
 *     - Displays the static LAST frame as a placeholder.
 *     - "Enter the Vault" button is shown immediately.
 * ────────────────────────────────────────────────────────── */

const TOTAL_FRAMES = 300;
const FRAME_PATH = '/frames/frame-';

const pad = (n: number): string => String(n).padStart(3, '0');
const getFrameUrl = (i: number): string => `${FRAME_PATH}${pad(i)}.jpg`;

const isMobileDevice = (): boolean =>
  typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

/* ── Component ──────────────────────────────────────────── */

interface VideoHeroProps {
  onEnterVault: () => void;
}

export default function VideoHero({ onEnterVault }: VideoHeroProps) {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <MobileHero onEnterVault={onEnterVault} />;
  }

  return <DesktopVideoHero onEnterVault={onEnterVault} />;
}

function MobileHero({ onEnterVault }: VideoHeroProps) {
  return (
    <div
      className="video-hero-container"
      style={{
        position: 'relative',
        width: '100%',
        background: '#030303',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 16px 24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Visual frame container with responsive styling and premium shadow/borders */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          aspectRatio: '16/9',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid rgba(139, 0, 0, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(139, 0, 0, 0.15)',
          background: '#000000',
          position: 'relative',
        }}
      >
        {/* Last frame as static background, slightly zoomed by 3% */}
        <img
          src={getFrameUrl(TOTAL_FRAMES)}
          alt="La Casa De IPE – Heist cinematic"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.03)',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Subtle dark vignette overlay inside the image frame */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Button position: directly below the visual frame with tight margin */}
      <div
        className="video-hero-cta"
        style={{
          marginTop: '20px',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={onEnterVault}
          className="group relative overflow-hidden bg-brand-red text-white font-display text-lg px-8 py-3.5 rounded-sm btn-glow uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl w-full max-w-[280px]"
        >
          <span className="relative z-10 pointer-events-none">
            Enter the Vault
          </span>
        </button>
      </div>
    </div>
  );
}

function DesktopVideoHero({ onEnterVault }: VideoHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animFrameRef = useRef<number>(0);

  // States: idle → loading → playing → done
  const [phase, setPhase] = useState<'idle' | 'loading' | 'playing' | 'done'>('idle');
  const [loadProgress, setLoadProgress] = useState(0);

  const targetFps = 30;

  /* ── Draw a frame onto the canvas ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = vw / vh;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasAspect > imgAspect) {
      drawW = vw;
      drawH = vw / imgAspect;
      drawX = 0;
      drawY = (vh - drawH) / 2;
    } else {
      drawH = vh;
      drawW = vh * imgAspect;
      drawX = (vw - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── Load all frames and start playing ── */
  const startPlayback = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('loading');

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const total = TOTAL_FRAMES;
    const BATCH_SIZE = 30;

    // Load frames in batches
    const loadBatch = (batchStart: number) => {
      const end = Math.min(batchStart + BATCH_SIZE, total);

      for (let idx = batchStart; idx < end; idx++) {
        const frameIndex = idx + 1;
        const img = new Image();
        img.src = getFrameUrl(frameIndex);

        img.onload = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / total) * 100));
          if (loadedCount >= total) {
            beginAnimation(images);
          }
        };

        img.onerror = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / total) * 100));
          if (loadedCount >= total) {
            beginAnimation(images);
          }
        };

        images[idx] = img;
      }

      if (end < total) {
        setTimeout(() => loadBatch(end), 10);
      }
    };

    loadBatch(0);
    imagesRef.current = images;
  }, [phase]);

  /* ── Play the animation loop (runs once) ── */
  const beginAnimation = useCallback((images: HTMLImageElement[]) => {
    imagesRef.current = images;
    setPhase('playing');

    let currentFrame = 0;
    const totalPlayable = images.length;
    const frameDuration = 1000 / targetFps;
    let lastTime = performance.now();

    const playLoop = (now: number) => {
      const delta = now - lastTime;

      if (delta >= frameDuration) {
        lastTime = now - (delta % frameDuration);
        currentFrame++;

        if (currentFrame >= totalPlayable) {
          drawFrame(totalPlayable - 1);
          setPhase('done');
          return;
        }

        drawFrame(currentFrame);
      }

      animFrameRef.current = requestAnimationFrame(playLoop);
    };

    drawFrame(0);
    animFrameRef.current = requestAnimationFrame(playLoop);
  }, [drawFrame, targetFps]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* ── Resize: redraw last frame if animation is done ── */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      if (phase === 'done' && imagesRef.current.length > 0) {
        drawFrame(imagesRef.current.length - 1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, phase]);

  const showPoster = phase === 'idle';
  const showLoader = phase === 'loading';
  const showCanvas = phase === 'playing' || phase === 'done';
  const showCta = phase === 'done';

  return (
    <div
      className="video-hero-container"
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}
    >
      {/* ── POSTER: Static first frame + Play button (idle state) ── */}
      {showPoster && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {/* First frame as static background */}
          <img
            src={getFrameUrl(1)}
            alt="La Casa De IPE – Heist cinematic"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Dark scrim for contrast against the play button */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* "Enter to Initiate" Button */}
          <button
            onClick={startPlayback}
            aria-label="Enter to initiate"
            className="video-hero-play-btn group relative overflow-hidden bg-brand-red text-white font-display text-lg md:text-2xl px-8 md:px-12 py-4 md:py-5 rounded-sm uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl"
          >
            <span className="relative z-10 pointer-events-none">
              Enter to Initiate
            </span>
          </button>
        </div>
      )}

      {/* ── LOADING: Progress overlay while frames download ── */}
      {showLoader && (
        <div className="scroll-canvas-loader" style={{ zIndex: 3 }}>
          <div className="scroll-canvas-loader__inner">
            <div className="scroll-canvas-loader__icon">
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
              <span className="scroll-canvas-loader__label">LOADING HEIST</span>
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

      {/* ── CANVAS: Video playback + frozen final frame ── */}
      <canvas
        ref={canvasRef}
        style={{
          display: showCanvas ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Gradient overlay at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, var(--theme-bg, #0a0a0a), transparent)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── CTA: "Enter the Vault" — fades in after animation ends ── */}
      <div
        className="video-hero-cta"
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: `translateX(-50%) translateY(${showCta ? '0px' : '20px'})`,
          opacity: showCta ? 1 : 0,
          pointerEvents: showCta ? 'auto' : 'none',
          zIndex: 10,
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <button
          onClick={onEnterVault}
          className="group relative overflow-hidden bg-brand-red text-white font-display text-lg md:text-2xl px-8 md:px-12 py-4 md:py-5 rounded-sm btn-glow uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl"
        >
          <span className="relative z-10 pointer-events-none">
            Enter the Vault
          </span>
        </button>
      </div>
    </div>
  );
}
