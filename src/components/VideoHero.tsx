import React, { useRef, useEffect, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────
 * VideoHero – YouTube cinematic player (Desktop) / Static (Mobile)
 *
 * Key behavior:
 *  1. Desktop: Page loads instantly with first-frame.jpg as static poster.
 *     - "Enter to Initiate" button overlaid on the poster.
 *     - Clicking play begins playing the YouTube video once, freezes on final frame.
 *  2. Mobile: Video player is completely disabled/hidden.
 *     - Displays the static LAST frame as a placeholder.
 *     - "Enter the Vault" button is shown immediately.
 * ────────────────────────────────────────────────────────── */

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
          src="/last-frame.jpg"
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
  // Check if they already initiated / watched the cinematic to support one-time loading
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>(() => {
    return localStorage.getItem("cinematicPlayed") === "true" ? 'done' : 'idle';
  });
  const playerRef = useRef<any>(null);

  // Trigger video playback
  const startPlayback = () => {
    setPhase('playing');
    if (playerRef.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.playVideo();
      } catch (e) {
        console.error("Failed to play/unmute YouTube video: ", e);
      }
    }
  };

  // Skip video cinematic
  const handleSkip = () => {
    localStorage.setItem("cinematicPlayed", "true");
    setPhase('done');
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        console.error("Failed to pause YouTube video: ", e);
      }
    }
  };

  // Monitor video playback time to transition slightly early and avoid the YouTube ending glitch
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0 && duration - currentTime < 0.8) {
            // Smoothly snap to done phase just before the video technically ends to hide YT controls/black screen/related videos
            localStorage.setItem("cinematicPlayed", "true");
            setPhase('done');
            try {
              playerRef.current.pauseVideo();
            } catch (err) {}
            clearInterval(interval);
          }
        } catch (e) {
          // ignore if methods are not loaded yet
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  // Initialize YouTube API player on mount to start loading/buffering early
  useEffect(() => {
    let player: any;

    const onPlayerReady = (event: any) => {
      playerRef.current = event.target;
    };

    const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.ENDED is 0
      if (event.data === 0) {
        localStorage.setItem("cinematicPlayed", "true");
        setPhase('done');
        try {
          event.target?.pauseVideo();
        } catch (err) {}
      }
    };

    const initPlayer = () => {
      player = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'EFabN2fRtyo',
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, []);

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vw',
    height: '56.25vw', // 16:9 aspect ratio cover
    minHeight: '100vh',
    minWidth: '177.78vh',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    pointerEvents: 'none',
  };

  return (
    <div
      className="video-hero-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* Preload last frame to prevent flash when video finishes */}
      <img src="/last-frame.jpg" alt="" style={{ display: 'none' }} />

      {/* ── IDLE STATE: First Frame Poster + Initiate Button at Bottom ── */}
      {phase === 'idle' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end', // Position button at the bottom side
            paddingBottom: '8%',        // Distance from bottom of hero section
            background: '#0a0a0a',
          }}
        >
          <img
            src="/first-frame.jpg"
            alt="La Casa De IPE – Heist cinematic"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Play Button */}
          <button
            onClick={startPlayback}
            aria-label="Start to initiate"
            className="video-hero-play-btn group relative overflow-hidden bg-brand-red text-white font-display text-lg md:text-2xl px-8 md:px-12 py-4 md:py-5 rounded-sm uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl z-20 cursor-pointer"
          >
            <span className="relative z-10 pointer-events-none">
              Start to Initiate
            </span>
          </button>
        </div>
      )}

      {/* ── PLAYING STATE: YouTube Iframe (Preloaded, hidden when idle/done) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: phase === 'playing' ? 5 : -10,
          opacity: phase === 'playing' ? 1 : 0,
          pointerEvents: phase === 'playing' ? 'auto' : 'none',
          background: '#000',
          transition: 'none',
        }}
      >
        <div style={iframeStyle}>
          <div id="youtube-player" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Skip Button */}
        {phase === 'playing' && (
          <button
            onClick={handleSkip}
            className="absolute bottom-10 right-10 z-20 bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/40 text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 rounded transition-all active:scale-95 cursor-pointer"
          >
            Skip Cinematic →
          </button>
        )}
      </div>

      {/* ── DONE STATE: Last Frame Poster + Enter Vault Button at Bottom ── */}
      {phase === 'done' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end', // Position button at the bottom side
            paddingBottom: '8%',        // Distance from bottom of hero section
            background: '#0a0a0a',
          }}
        >
          <img
            src="/last-frame.jpg"
            alt="La Casa De IPE – Cinematic complete"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Enter Vault Button */}
          <button
            onClick={onEnterVault}
            className="group relative overflow-hidden bg-brand-red text-white font-display text-lg md:text-2xl px-8 md:px-12 py-4 md:py-5 rounded-sm btn-glow uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl z-20 cursor-pointer"
          >
            <span className="relative z-10 pointer-events-none">
              Enter the Vault
            </span>
          </button>
        </div>
      )}

      {/* Bottom fade shadow for smooth page transitions */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to top, var(--theme-bg, #0a0a0a), transparent)',
          pointerEvents: 'none',
          zIndex: 12,
        }}
      />
    </div>
  );
}
