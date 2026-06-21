'use client';
import { useClock } from '@/hooks/use-clock';

export default function CalendarWidget() {
  const currentDate = useClock();

  if (!currentDate) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start (0=Mon, 6=Sun)
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div
      className="fixed z-50 animate-slide-down"
      style={{
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '360px',
        background: 'var(--yaru-popover-bg)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}
    >
      {/* Calendar section */}
      <div className="p-4">
        {/* Month/Year header */}
        <div className="text-white text-sm font-medium mb-3">
          {monthNames[month]} {year}
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-white/40 text-xs py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className="text-center py-1"
            >
              {day !== null ? (
                <span
                  className="inline-flex items-center justify-center w-7 h-7 text-xs rounded-full"
                  style={{
                    color: day === today ? 'white' : 'rgba(255,255,255,0.8)',
                    background: day === today ? '#E95420' : 'transparent',
                    fontWeight: day === today ? '600' : '400',
                  }}
                >
                  {day}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: 'var(--yaru-border-color)' }} />

      {/* Notifications section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-medium">Notifications</span>
          <div className="flex items-center gap-2">
            <button className="text-white/40 text-xs hover:text-white/60 transition-colors">
              Clear All
            </button>
          </div>
        </div>
        <div className="text-center py-4">
          <div className="text-white/20 text-2xl mb-1">🔔</div>
          <div className="text-white/30 text-xs">No notifications</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-white/50 text-xs">Do Not Disturb</span>
          <div className="ubuntu-toggle" />
        </div>
      </div>
    </div>
  );
}
