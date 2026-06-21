'use client';
import { useRef, useCallback, useEffect } from 'react';
import { useUbuntuStore, type WindowState } from '@/components/recovery-os/ubuntu-store';
import { sounds } from '@/lib/sounds';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export default function Window({ window: win, children }: WindowProps) {
  const focusWindow = useUbuntuStore(s => s.focusWindow);
  const minimizeWindow = useUbuntuStore(s => s.minimizeWindow);
  const maximizeWindow = useUbuntuStore(s => s.maximizeWindow);
  const closeWindow = useUbuntuStore(s => s.closeWindow);
  const updateWindowPosition = useUbuntuStore(s => s.updateWindowPosition);
  const updateWindowSize = useUbuntuStore(s => s.updateWindowSize);
  const activeWindowId = useUbuntuStore(s => s.activeWindowId);

  const hasPlayedSound = useRef(false);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirection = useRef<string>('');

  // Detect mobile viewport
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Play sound once on mount
  useEffect(() => {
    if (!hasPlayedSound.current) {
      sounds.windowOpen();
      hasPlayedSound.current = true;
    }
  }, []);

  const handleMouseDownDrag = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    };
    focusWindow(win.id);
  }, [win.id, win.x, win.y, win.isMaximized, focusWindow]);

  const handleMouseDownResize = useCallback((e: React.MouseEvent, direction: string) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeDirection.current = direction;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height,
    };
    focusWindow(win.id);
  }, [win.id, win.width, win.height, win.isMaximized, isMobile, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = Math.max(28, e.clientY - dragOffset.current.y);
        updateWindowPosition(win.id, newX, newY);
      }
      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;

        if (resizeDirection.current.includes('e')) {
          newWidth = resizeStart.current.width + dx;
        }
        if (resizeDirection.current.includes('s')) {
          newHeight = resizeStart.current.height + dy;
        }
        if (resizeDirection.current.includes('w')) {
          const widthDelta = -dx;
          newWidth = resizeStart.current.width + widthDelta;
          if (newWidth >= (win.minSize?.width ?? 200)) {
            updateWindowPosition(win.id, resizeStart.current.x - (newWidth - resizeStart.current.width) + (resizeStart.current.width - newWidth), win.y);
          }
        }
        if (resizeDirection.current.includes('n')) {
          const heightDelta = -dy;
          newHeight = resizeStart.current.height + heightDelta;
          if (newHeight >= (win.minSize?.height ?? 150)) {
            updateWindowPosition(win.id, win.x, resizeStart.current.y - (newHeight - resizeStart.current.height) + (resizeStart.current.height - newHeight));
          }
        }
        updateWindowSize(win.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [win.id, win.x, win.y, win.minSize, updateWindowPosition, updateWindowSize]);

  if (win.isMinimized) return null;

  const isActive = win.id === activeWindowId;

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: isMobile ? 28 : 28,
        left: isMobile ? 0 : 0,
        width: '100vw',
        height: isMobile ? 'calc(100vh - 28px - 56px)' : 'calc(100vh - 28px)',
        borderRadius: 0,
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        borderRadius: isMobile ? 0 : 12,
        zIndex: win.zIndex,
      };

  return (
    <div
      className="animate-window-open"
      style={{
        ...windowStyle,
        background: 'var(--yaru-window-bg)',
        boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: isActive && !isMobile ? '1px solid rgba(255,255,255,0.08)' : isActive ? 'none' : '1px solid rgba(255,255,255,0.04)',
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Header bar */}
      <div
        onMouseDown={handleMouseDownDrag}
        onDoubleClick={() => !isMobile && maximizeWindow(win.id)}
        className="flex items-center justify-between px-3 shrink-0 cursor-default"
        style={{
          height: isMobile ? '36px' : '38px',
          background: isActive ? 'var(--yaru-header-bar-bg)' : 'var(--yaru-header-bar-backdrop)',
          borderBottom: '1px solid var(--yaru-border-color)',
        }}
      >
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-sm shrink-0">{win.icon}</span>
          <span
            className="text-xs truncate"
            style={{ color: isActive ? 'white' : 'var(--yaru-text-secondary)' }}
          >
            {win.title}
          </span>
        </div>

        {/* Right: Window controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="2" y1="5" x2="8" y2="5" stroke="white" strokeWidth="1.2"/>
            </svg>
          </button>

          {/* Maximize - hide on mobile since windows are always maximized */}
          {!isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(win.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="2" y="2" width="6" height="6" stroke="white" strokeWidth="1.2" fill="none"/>
              </svg>
            </button>
          )}

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.windowClose();
              closeWindow(win.id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e01b24] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="2" y1="2" x2="8" y2="8" stroke="white" strokeWidth="1.2"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke="white" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Window body */}
      <div className="flex-1 overflow-hidden" style={{ background: 'var(--yaru-window-bg)' }}>
        {children}
      </div>

      {/* Resize handles (only when not maximized and not mobile) */}
      {!win.isMaximized && !isMobile && (
        <>
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'e')}
            className="absolute top-0 right-0 w-2 cursor-e-resize"
            style={{ height: '100%' }}
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 's')}
            className="absolute bottom-0 left-0 h-2 cursor-s-resize"
            style={{ width: '100%' }}
          />
          {/* Bottom-right corner */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          />
        </>
      )}
    </div>
  );
}
