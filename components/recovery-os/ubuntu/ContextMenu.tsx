'use client';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';

export default function ContextMenu() {
  const contextMenuPosition = useUbuntuStore(s => s.contextMenuPosition);
  const closeAllPopups = useUbuntuStore(s => s.closeAllPopups);
  const openApp = useUbuntuStore(s => s.openApp);

  const menuItems = [
    {
      label: 'Change Background...',
      action: () => {
        closeAllPopups();
      },
    },
    {
      label: 'Display Settings',
      action: () => {
        closeAllPopups();
        openApp('settings');
      },
    },
    {
      label: 'Settings',
      action: () => {
        closeAllPopups();
        openApp('settings');
      },
    },
  ];

  return (
    <div
      className="fixed z-50 animate-fade-in"
      style={{
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        background: 'var(--yaru-popover-bg)',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        minWidth: '180px',
        padding: '4px 0',
      }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className="w-full text-left px-4 py-2 text-white text-[13px] hover:bg-white/10 transition-colors"
          style={{ fontFamily: "'Ubuntu', sans-serif" }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
