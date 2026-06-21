'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DesktopIcon() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Set initial position - top right area of desktop, below top bar
      setPosition({
        x: mobile ? window.innerWidth - 90 : window.innerWidth - 120,
        y: mobile ? 48 : 50,
      });
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasDragged.current = false;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    hasDragged.current = false;
    dragOffset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      hasDragged.current = true;
      const newX = e.clientX - dragOffset.current.x;
      const newY = Math.max(28, e.clientY - dragOffset.current.y);
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      hasDragged.current = true;
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.current.x;
      const newY = Math.max(28, touch.clientY - dragOffset.current.y);
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Only navigate if we didn't drag
    if (hasDragged.current) {
      e.preventDefault();
      return;
    }
  }, []);

  const iconSize = isMobile ? 56 : 72;
  const fontSize = isMobile ? '9px' : '11px';

  return (
    <Link
      href="/"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="flex flex-col items-center justify-center gap-1 no-underline select-none"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: iconSize + 16,
        padding: '6px 4px',
        borderRadius: '8px',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 5,
        background: isDragging ? 'rgba(255,255,255,0.1)' : 'transparent',
        transition: isDragging ? 'none' : 'background 0.15s',
        touchAction: 'none',
        textDecoration: 'none',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Icon container with Ubuntu-style selection highlight */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <Image
          src="/favicon.png"
          alt="kylebrumbley.com"
          width={isMobile ? 40 : 52}
          height={isMobile ? 40 : 52}
          style={{ imageRendering: 'auto' }}
          draggable={false}
        />
      </div>
      {/* Label */}
      <span
        style={{
          color: '#ffffff',
          fontSize,
          fontWeight: 500,
          textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: iconSize + 20,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
        }}
      >
        kylebrumbley.com
      </span>
    </Link>
  );
}
