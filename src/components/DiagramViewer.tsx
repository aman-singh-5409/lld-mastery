'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

interface DiagramViewerProps {
  src: string;
  alt: string;
  caption: string;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 8;
const BTN_FACTOR = 1.35;

export default function DiagramViewer({ src, alt, caption }: DiagramViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Two-layer drag tracking:
  //   ref  → synchronous reads inside event handlers (no stale-closure issues)
  //   state → triggers re-render so cursor + transition classes update
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Transform lives in refs (synchronous) and is mirrored to state for rendering
  const scaleRef = useRef(1);
  const posRef = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  /** Write transform to refs + state atomically */
  const commit = useCallback((scale: number, x: number, y: number) => {
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
    scaleRef.current = s;
    posRef.current = { x, y };
    setTransform({ scale: s, x, y });
  }, []);

  const reset = useCallback(() => commit(1, 0, 0), [commit]);

  /**
   * Zoom by a factor, keeping the viewport point (cx, cy) fixed.
   * When cx/cy are omitted it zooms from the canvas centre.
   */
  const zoomToward = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const oldScale = scaleRef.current;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale * factor));
      if (Math.abs(newScale - oldScale) < 0.0001) return;

      const { x: px, y: py } = posRef.current;
      let nx = px;
      let ny = py;

      if (cx !== undefined && cy !== undefined && canvasRef.current) {
        const r = canvasRef.current.getBoundingClientRect();
        const pivotX = cx - (r.left + r.width / 2);
        const pivotY = cy - (r.top + r.height / 2);
        const ratio = newScale / oldScale;
        nx = pivotX - (pivotX - px) * ratio;
        ny = pivotY - (pivotY - py) * ratio;
      }

      commit(newScale, nx, ny);
    },
    [commit],
  );

  /* ── Open / close ─────────────────────────────────────────────── */
  const open = () => {
    commit(1, 0, 0);
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsOpen(true);
  };
  const close = useCallback(() => setIsOpen(false), []);

  /* ── Wheel — Figma-style ──────────────────────────────────────── *
   *  Ctrl / Meta + scroll  →  zoom toward cursor                    *
   *  Shift + scroll        →  horizontal pan                        *
   *  plain scroll          →  pan (uses both deltaX + deltaY so     *
   *                            two-finger trackpad pan works)       *
   * ───────────────────────────────────────────────────────────────*/
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom (trackpad) or Ctrl+wheel (mouse)
        // deltaY is in pixels for trackpad, ~100 per notch for mouse
        const factor = Math.pow(0.997, e.deltaY);
        zoomToward(factor, e.clientX, e.clientY);
      } else {
        // Pan: respect trackpad two-finger direction
        // When Shift is held, browsers may swap deltaX / deltaY — handle both
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        const dy = e.shiftKey ? 0 : e.deltaY;
        const { x, y } = posRef.current;
        commit(scaleRef.current, x - dx, y - dy);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen, zoomToward, commit]);

  /* ── Keyboard shortcuts ───────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') zoomToward(BTN_FACTOR);
      if (e.key === '-') zoomToward(1 / BTN_FACTOR);
      if (e.key === '0') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, zoomToward, reset]);

  /* ── Body-scroll lock ─────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Mouse drag ───────────────────────────────────────────────── */
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    };
  };

  // Uses REF (not state) so it is always synchronous — no missed frames
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    commit(
      scaleRef.current,
      dragRef.current.originX + (e.clientX - dragRef.current.startX),
      dragRef.current.originY + (e.clientY - dragRef.current.startY),
    );
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  /* ── Double-click ─────────────────────────────────────────────── */
  const onDoubleClick = (e: React.MouseEvent) => {
    if (scaleRef.current > 1.5) reset();
    else zoomToward(3, e.clientX, e.clientY);
  };

  /* ── Touch single-finger pan ──────────────────────────────────── */
  const touchRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !isDraggingRef.current) return;
    commit(
      scaleRef.current,
      touchRef.current.originX + (e.touches[0].clientX - touchRef.current.startX),
      touchRef.current.originY + (e.touches[0].clientY - touchRef.current.startY),
    );
  };

  const onTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  /* ── Derived UI ───────────────────────────────────────────────── */
  const pct = Math.round(transform.scale * 100);
  const atMin = transform.scale <= MIN_SCALE * 1.02;
  const atMax = transform.scale >= MAX_SCALE * 0.98;

  const toolBtn = (extra = '') =>
    `flex h-8 w-8 items-center justify-center rounded-md transition-colors ${extra}`;

  return (
    <>
      {/* ── Thumbnail ─────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Open diagram fullscreen"
        className="group relative cursor-zoom-in overflow-hidden rounded-lg"
        onClick={open}
        onKeyDown={(e) => e.key === 'Enter' && open()}
      >
        <Image
          src={src}
          alt={alt}
          width={900}
          height={600}
          className="w-full rounded-lg object-contain"
          style={{ maxHeight: '500px', objectFit: 'contain' }}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/55">
          <span className="flex items-center gap-2 rounded-full bg-zinc-900/90 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
            Click to expand
          </span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-zinc-500">{caption}</p>

      {/* ── Fullscreen modal ───────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">

          {/* Toolbar */}
          <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800/70 bg-zinc-900/95 px-4 py-2 backdrop-blur-md">
            <span className="flex-1 truncate text-sm font-medium text-zinc-200">{caption}</span>

            {/* Zoom control group */}
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 p-0.5">
              <button
                onClick={() => zoomToward(1 / BTN_FACTOR)}
                disabled={atMin}
                className={toolBtn(
                  atMin
                    ? 'cursor-not-allowed text-zinc-600'
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white active:bg-zinc-600',
                )}
                title="Zoom out (−)"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={reset}
                className="h-8 min-w-13 rounded-md px-1.5 text-center text-xs tabular-nums text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                title="Reset zoom (0)"
              >
                {pct}%
              </button>

              <button
                onClick={() => zoomToward(BTN_FACTOR)}
                disabled={atMax}
                className={toolBtn(
                  atMax
                    ? 'cursor-not-allowed text-zinc-600'
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white active:bg-zinc-600',
                )}
                title="Zoom in (+)"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={reset}
              className={toolBtn('text-zinc-400 hover:bg-zinc-700/60 hover:text-white')}
              title="Fit to screen (0)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={close}
              className={toolBtn(
                'text-zinc-400 hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/25',
              )}
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative flex flex-1 select-none items-center justify-center overflow-hidden"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: '#0e0e11',
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onDoubleClick={onDoubleClick}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                draggable={false}
                style={{
                  display: 'block',
                  maxWidth: '90vw',
                  maxHeight: 'calc(100dvh - 84px)',
                  objectFit: 'contain',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 12px 60px rgba(0,0,0,0.8)',
                }}
              />
            </div>
          </div>

          {/* Hint bar */}
          <footer className="flex shrink-0 items-center justify-center gap-2.5 border-t border-zinc-800/70 bg-zinc-900/95 py-1.5 text-xs text-zinc-500 backdrop-blur-md">
            <span>Scroll to pan</span>
            <span aria-hidden>·</span>
            <span>Ctrl + scroll to zoom</span>
            <span aria-hidden>·</span>
            <span>Drag to pan</span>
            <span aria-hidden>·</span>
            <span>Double-click to zoom in</span>
            <span aria-hidden>·</span>
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">Esc</kbd>
          </footer>
        </div>
      )}
    </>
  );
}
