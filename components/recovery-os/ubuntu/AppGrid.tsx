'use client';
import { useState } from 'react';
import { useUbuntuStore, APP_DEFINITIONS } from '@/components/recovery-os/ubuntu-store';

export default function AppGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const openApp = useUbuntuStore(s => s.openApp);
  const setShowAppGrid = useUbuntuStore(s => s.setShowAppGrid);

  const filteredApps = APP_DEFINITIONS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (appId: string) => {
    openApp(appId);
    setShowAppGrid(false);
  };

  return (
    <div
      className="fixed inset-0 z-40 animate-slide-down"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowAppGrid(false);
      }}
    >
      {/* Content */}
      <div className="max-w-4xl mx-auto pt-12 px-6">
        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-80 px-4 py-2 rounded-full text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: "'Ubuntu', sans-serif",
            }}
            autoFocus
          />
        </div>

        {/* App grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {app.icon}
              </div>
              <span className="text-white text-xs text-center truncate w-full">{app.name}</span>
            </button>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center text-white/40 text-sm mt-12">No applications found</div>
        )}
      </div>
    </div>
  );
}
