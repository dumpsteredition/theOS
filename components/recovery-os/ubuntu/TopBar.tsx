'use client';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import { useClock } from '@/hooks/use-clock';

export default function TopBar() {
  const currentTime = useClock();
  const toggleAppGrid = useUbuntuStore(s => s.toggleAppGrid);
  const toggleCalendar = useUbuntuStore(s => s.toggleCalendar);
  const toggleQuickSettings = useUbuntuStore(s => s.toggleQuickSettings);
  const showQuickSettings = useUbuntuStore(s => s.showQuickSettings);

  const formatDateTime = () => {
    if (!currentTime) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[currentTime.getDay()];
    const date = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');
    return `${day} ${date} ${month}, ${h}:${m} ${ampm}`;
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-50"
      style={{
        height: '28px',
        background: 'var(--yaru-top-bar-bg)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        color: 'white',
        fontSize: '13px',
        fontFamily: "'Ubuntu', sans-serif",
      }}
    >
      {/* Left section - Activities */}
      <button
        onClick={toggleAppGrid}
        className="hover:bg-white/10 px-3 py-0.5 rounded transition-colors cursor-pointer"
        style={{ fontSize: '13px', color: 'white', background: 'none', border: 'none' }}
      >
        Activities
      </button>

      {/* Center section - Date/Time */}
      <button
        onClick={toggleCalendar}
        className="hover:bg-white/10 px-3 py-0.5 rounded transition-colors cursor-pointer"
        style={{
          fontSize: '13px',
          color: 'white',
          background: 'none',
          border: 'none',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {formatDateTime()}
      </button>

      {/* Right section - System tray */}
      <div className="flex items-center gap-1">
        {/* Network icon */}
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        </button>

        {/* Volume icon */}
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>

        {/* Battery icon */}
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
            <line x1="23" y1="13" x2="23" y2="11"/>
            <rect x="3" y="8" width="12" height="8" fill="white" fillOpacity="0.3" stroke="none"/>
          </svg>
        </button>

        {/* Power/Settings button */}
        <button
          onClick={toggleQuickSettings}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          style={{
            background: showQuickSettings ? 'rgba(255,255,255,0.15)' : undefined,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2v10M18.36 6.64A9 9 0 1 1 5.64 6.64"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
