'use client';
import { useState, useEffect } from 'react';
import { kyleData } from '@/data/kyle-data';

interface FileEntry {
  type: 'directory' | 'file';
  content?: string;
  children?: Record<string, FileEntry>;
}

export default function Files() {
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'kyle']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getCurrentDirectory = (): Record<string, FileEntry> => {
    let current: FileEntry = kyleData.fileSystem as unknown as FileEntry;
    for (const segment of currentPath) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return {};
      }
    }
    return current.children || {};
  };

  const currentDir = getCurrentDirectory();

  const handleItemDoubleClick = (name: string, entry: FileEntry) => {
    if (entry.type === 'directory') {
      setCurrentPath([...currentPath, name]);
      setSelectedItem(null);
      setPreviewContent(null);
      if (isMobile) setShowSidebar(false);
    } else if (entry.content) {
      setPreviewContent(entry.content);
      if (isMobile) setShowSidebar(false);
    }
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItem(null);
      setPreviewContent(null);
    }
  };

  const getSidebarItems = () => [
    { name: 'Home', path: ['home', 'kyle'], icon: '🏠' },
    { name: 'Documents', path: ['home', 'kyle', 'Documents'], icon: '📄' },
    { name: 'Projects', path: ['home', 'kyle', 'Projects'], icon: '📁' },
    { name: 'Downloads', path: ['home', 'kyle', 'Downloads'], icon: '📥' },
    { name: 'Music', path: ['home', 'kyle', 'Music'], icon: '🎵' },
    { name: 'Pictures', path: ['home', 'kyle', 'Pictures'], icon: '🖼️' },
  ];

  const sidebarContent = (
    <div
      className="flex flex-col py-2 border-r h-full"
      style={{ background: 'var(--yaru-sidebar-bg)', borderColor: 'var(--yaru-border-color)' }}
    >
      <div className="px-3 py-1 text-xs text-white/40 uppercase tracking-wider mb-1">Places</div>
      {getSidebarItems().map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setCurrentPath(item.path);
            setSelectedItem(null);
            setPreviewContent(null);
            if (isMobile) setShowSidebar(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 text-left transition-colors"
          style={{
            background: JSON.stringify(currentPath) === JSON.stringify(item.path) ? 'rgba(255,255,255,0.1)' : undefined,
          }}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex" style={{ background: 'var(--yaru-view-bg)' }}>
      {/* Desktop: Persistent sidebar */}
      {!isMobile && (
        <div
          className="w-44 shrink-0 flex flex-col py-2 border-r"
          style={{ background: 'var(--yaru-sidebar-bg)', borderColor: 'var(--yaru-border-color)' }}
        >
          <div className="px-3 py-1 text-xs text-white/40 uppercase tracking-wider mb-1">Places</div>
          {getSidebarItems().map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setCurrentPath(item.path);
                setSelectedItem(null);
                setPreviewContent(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 text-left transition-colors"
              style={{
                background: JSON.stringify(currentPath) === JSON.stringify(item.path) ? 'rgba(255,255,255,0.1)' : undefined,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile: Slide-out sidebar overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="w-56 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/40" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Path bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
          style={{ borderColor: 'var(--yaru-border-color)' }}
        >
          {/* Mobile hamburger menu */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(true)}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}

          <button
            onClick={handleBack}
            className="text-white/60 hover:text-white transition-colors px-1"
            disabled={currentPath.length <= 1}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="text-sm text-white/70 flex items-center gap-1 truncate">
            <span className="text-white/40">/</span>
            {currentPath.map((segment, i) => (
              <span key={i} className="flex items-center gap-1 shrink-0">
                <span className="text-white/90">{segment}</span>
                {i < currentPath.length - 1 && <span className="text-white/40">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* File grid or preview */}
        {previewContent ? (
          <div className="flex-1 p-4 overflow-auto">
            <button
              onClick={() => setPreviewContent(null)}
              className="text-xs text-white/50 hover:text-white mb-3 flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to files
            </button>
            <pre className="text-sm text-white/80 whitespace-pre-wrap ubuntu-text-select" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
              {previewContent}
            </pre>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-auto">
            <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'} gap-2`}>
              {Object.entries(currentDir).map(([name, entry]) => (
                <button
                  key={name}
                  onClick={() => setSelectedItem(name)}
                  onDoubleClick={() => handleItemDoubleClick(name, entry as FileEntry)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                  style={{
                    background: selectedItem === name ? 'rgba(233,84,32,0.2)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem !== name) (e.currentTarget.style.background = 'rgba(255,255,255,0.05)');
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem !== name) (e.currentTarget.style.background = 'transparent');
                  }}
                >
                  <span className={isMobile ? 'text-2xl' : 'text-3xl'}>
                    {(entry as FileEntry).type === 'directory' ? '📁' : '📄'}
                  </span>
                  <span className={`text-xs text-white/80 text-center truncate w-full ${isMobile ? 'text-[10px]' : ''}`}>{name}</span>
                </button>
              ))}
            </div>
            {Object.keys(currentDir).length === 0 && (
              <div className="text-white/30 text-sm text-center mt-8">Empty folder</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
