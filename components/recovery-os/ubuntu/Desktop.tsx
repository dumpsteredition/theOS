'use client';
import { useCallback } from 'react';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import TopBar from './TopBar';
import Dock from './Dock';
import WindowManager from './WindowManager';
import AppGrid from './AppGrid';
import CalendarWidget from './CalendarWidget';
import QuickSettings from './QuickSettings';
import ContextMenu from './ContextMenu';
import DesktopIcon from './DesktopIcon';

export default function Desktop() {
  const showAppGrid = useUbuntuStore(s => s.showAppGrid);
  const showCalendar = useUbuntuStore(s => s.showCalendar);
  const showQuickSettings = useUbuntuStore(s => s.showQuickSettings);
  const showContextMenu = useUbuntuStore(s => s.showContextMenu);
  const isLoggingOut = useUbuntuStore(s => s.isLoggingOut);
  const toggleContextMenu = useUbuntuStore(s => s.toggleContextMenu);
  const closeAllPopups = useUbuntuStore(s => s.closeAllPopups);
  const toggleAppGrid = useUbuntuStore(s => s.toggleAppGrid);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    toggleContextMenu(e.clientX, e.clientY);
  }, [toggleContextMenu]);

  const handleDesktopClick = useCallback(() => {
    if (showAppGrid || showCalendar || showQuickSettings || showContextMenu) {
      closeAllPopups();
    }
  }, [showAppGrid, showCalendar, showQuickSettings, showContextMenu, closeAllPopups]);

  const handleHotCorner = useCallback(() => {
    toggleAppGrid();
  }, [toggleAppGrid]);

  return (
    <div
      className="ubuntu-wallpaper w-screen h-screen fixed inset-0"
      style={{
        opacity: isLoggingOut ? 0 : 1,
        transition: 'opacity 1000ms ease',
      }}
    >
      {/* Hot corner - top left */}
      <div
        className="fixed top-0 left-0 w-2 h-2 z-50"
        onMouseEnter={handleHotCorner}
      />

      {/* Desktop background click area */}
      <div
        className="absolute inset-0"
        onContextMenu={handleContextMenu}
        onClick={handleDesktopClick}
      />

      {/* Desktop icon */}
      <DesktopIcon />

      {/* Top bar */}
      <TopBar />

      {/* Dock */}
      <Dock />

      {/* Windows */}
      <WindowManager />

      {/* App Grid overlay */}
      {showAppGrid && <AppGrid />}

      {/* Calendar widget */}
      {showCalendar && <CalendarWidget />}

      {/* Quick settings */}
      {showQuickSettings && <QuickSettings />}

      {/* Context menu */}
      {showContextMenu && <ContextMenu />}
    </div>
  );
}
