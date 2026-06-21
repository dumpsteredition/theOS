'use client';
import { useState } from 'react';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import { sounds } from '@/lib/sounds';

export default function QuickSettings() {
  const openApp = useUbuntuStore(s => s.openApp);
  const logout = useUbuntuStore(s => s.logout);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(true);
  const [powerSaverOn, setPowerSaverOn] = useState(false);
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(80);

  return (
    <div
      className="fixed z-50 animate-slide-down"
      style={{
        top: '32px',
        right: '8px',
        width: '320px',
        background: 'var(--yaru-popover-bg)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}
    >
      <div className="p-4 space-y-4">
        {/* Toggle buttons row 1 */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setWifiOn(!wifiOn)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
            style={{
              background: wifiOn ? '#E95420' : 'rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
            </svg>
            <span>Wi-Fi</span>
          </button>

          <button
            onClick={() => setBluetoothOn(!bluetoothOn)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
            style={{
              background: bluetoothOn ? '#E95420' : 'rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
            </svg>
            <span>Bluetooth</span>
          </button>
        </div>

        {/* Toggle buttons row 2 */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDarkModeOn(!darkModeOn)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
            style={{
              background: darkModeOn ? '#E95420' : 'rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>Dark Mode</span>
          </button>

          <button
            onClick={() => setPowerSaverOn(!powerSaverOn)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
            style={{
              background: powerSaverOn ? '#E95420' : 'rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Power Saver</span>
          </button>
        </div>

        {/* Volume slider */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E95420 ${volume}%, rgba(255,255,255,0.15) ${volume}%)`,
              }}
            />
          </div>
        </div>

        {/* Brightness slider */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E95420 ${brightness}%, rgba(255,255,255,0.15) ${brightness}%)`,
              }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--yaru-border-color)' }}>
          <button
            onClick={() => openApp('settings')}
            className="flex items-center gap-1 text-white/60 hover:text-white text-xs transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </button>

          <button
            onClick={() => {
              sounds.logout();
              logout();
            }}
            className="flex items-center gap-1 text-white/60 hover:text-white text-xs transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Lock
          </button>

          <button
            onClick={() => {
              sounds.logout();
              logout();
            }}
            className="flex items-center gap-1 text-white/60 hover:text-white text-xs transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v10M18.36 6.64A9 9 0 1 1 5.64 6.64"/>
            </svg>
            Power Off
          </button>
        </div>
      </div>
    </div>
  );
}
