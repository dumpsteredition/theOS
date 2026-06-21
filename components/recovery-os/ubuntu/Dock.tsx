'use client';
import { useState, useEffect } from 'react';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';

const DOCK_APPS = [
  { id: 'firefox', icon: '🦊', name: 'Firefox' },
  { id: 'files', icon: '📁', name: 'Files' },
  { id: 'software', icon: '🛍️', name: 'App Center' },
  { id: 'text-editor', icon: '📝', name: 'Text Editor' },
  { id: 'terminal', icon: '⬛', name: 'Terminal' },
  { id: 'settings', icon: '⚙️', name: 'Settings' },
  { id: 'calculator', icon: '🧮', name: 'Calculator' },
  { id: 'system-monitor', icon: '📊', name: 'System Monitor' },
];

export default function Dock() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const windows = useUbuntuStore(s => s.windows);
  const activeWindowId = useUbuntuStore(s => s.activeWindowId);
  const openApp = useUbuntuStore(s => s.openApp);
  const toggleAppGrid = useUbuntuStore(s => s.toggleAppGrid);

  const isAppRunning = (appId: string) => windows.some(w => w.appId === appId);
  const isAppActive = (appId: string) => windows.some(w => w.appId === appId && w.id === activeWindowId);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile: Horizontal dock at the bottom
  if (isMobile) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center px-1 gap-0.5"
        style={{
          height: '56px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {DOCK_APPS.map((app) => {
          const running = isAppRunning(app.id);
          const active = isAppActive(app.id);

          return (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="relative flex flex-col items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-150"
              style={{
                width: '40px',
                height: '44px',
                fontSize: '20px',
              }}
            >
              {app.icon}
              {/* Running indicator dot below icon */}
              {running && (
                <div
                  className="absolute bottom-0.5 rounded-full"
                  style={{
                    width: active ? '12px' : '5px',
                    height: '3px',
                    background: active ? 'white' : '#E95420',
                    borderRadius: '2px',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div
          className="mx-0.5"
          style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }}
        />

        {/* Show Applications button */}
        <button
          onClick={toggleAppGrid}
          className="flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-150"
          style={{ width: '40px', height: '44px' }}
        >
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.8)' }}
              />
            ))}
          </div>
        </button>
      </div>
    );
  }

  // Desktop: Vertical dock on the left
  return (
    <div
      className="fixed left-2 z-40 flex flex-col items-center py-2 gap-1"
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
        width: '58px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* App icons */}
      {DOCK_APPS.map((app) => {
        const running = isAppRunning(app.id);
        const active = isAppActive(app.id);

        return (
          <div
            key={app.id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
          >
            {/* Running/Active indicator on the LEFT */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
              {running && (
                <div
                  className="rounded-full"
                  style={{
                    width: active ? '5px' : '4px',
                    height: active ? '5px' : '4px',
                    background: active ? 'white' : '#E95420',
                  }}
                />
              )}
            </div>

            {/* App icon button */}
            <button
              onClick={() => openApp(app.id)}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-150 text-2xl"
              style={{
                transform: hoveredApp === app.id ? 'scale(1.12)' : 'scale(1)',
              }}
              title={app.name}
            >
              {app.icon}
            </button>

            {/* Tooltip */}
            {hoveredApp === app.id && (
              <div className="dock-tooltip">{app.name}</div>
            )}
          </div>
        );
      })}

      {/* Separator */}
      <div
        className="w-8 my-1"
        style={{ height: '1px', background: 'rgba(255,255,255,0.2)' }}
      />

      {/* Show Applications button */}
      <div
        className="relative flex items-center"
        onMouseEnter={() => setHoveredApp('app-grid')}
        onMouseLeave={() => setHoveredApp(null)}
      >
        <button
          onClick={toggleAppGrid}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-150"
          style={{
            transform: hoveredApp === 'app-grid' ? 'scale(1.12)' : 'scale(1)',
          }}
        >
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{ width: '5px', height: '5px', background: 'rgba(255,255,255,0.8)' }}
              />
            ))}
          </div>
        </button>

        {hoveredApp === 'app-grid' && (
          <div className="dock-tooltip">Show Applications</div>
        )}
      </div>
    </div>
  );
}
