'use client';

import { useState, useCallback, useEffect } from 'react';
import { kyleData } from '@/data/kyle-data';
import { sounds } from '@/lib/sounds';

interface TabInfo {
  name: string;
  content: string;
  language: string;
}

const AVAILABLE_FILES: TabInfo[] = [
  {
    name: 'README.md',
    content: kyleData.fileSystem.home.children['README.md']?.content ?? '',
    language: 'Markdown',
  },
  {
    name: 'Philosophy.md',
    content: kyleData.fileSystem.home.children.Documents?.children?.['Philosophy.md']?.content ?? '',
    language: 'Markdown',
  },
  {
    name: 'Cover_Letter.txt',
    content: kyleData.fileSystem.home.children.Documents?.children?.['Cover_Letter.txt']?.content ?? '',
    language: 'Plain Text',
  },
  {
    name: '.bashrc',
    content: kyleData.fileSystem.home.children['.bashrc']?.content ?? '',
    language: 'Shell',
  },
];

export default function TextEditor() {
  const [openTabs, setOpenTabs] = useState<TabInfo[]>([AVAILABLE_FILES[0]]);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const currentFile = openTabs[activeTab];

  const openFile = useCallback((file: TabInfo) => {
    sounds.click();
    const existingIndex = openTabs.findIndex(t => t.name === file.name);
    if (existingIndex >= 0) {
      setActiveTab(existingIndex);
      return;
    }
    const newTabs = [...openTabs, file];
    setOpenTabs(newTabs);
    setActiveTab(newTabs.length - 1);
  }, [openTabs]);

  const closeTab = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.click();
    if (openTabs.length <= 1) return;
    const newTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(newTabs);
    if (activeTab >= newTabs.length) {
      setActiveTab(newTabs.length - 1);
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    } else if (activeTab === index) {
      setActiveTab(Math.min(index, newTabs.length - 1));
    }
  }, [openTabs, activeTab]);

  const lines = currentFile?.content.split('\n') ?? [];
  const charCount = currentFile?.content.length ?? 0;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1d1d20', color: '#ffffff' }}>
      {/* Tab bar */}
      <div
        className="flex items-center flex-shrink-0"
        style={{ background: '#2e2e32', borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}
      >
        {openTabs.map((tab, i) => (
          <button
            key={tab.name}
            onClick={() => { sounds.click(); setActiveTab(i); }}
            className="flex items-center gap-1.5"
            style={{
              padding: isMobile ? '6px 8px' : '8px 12px',
              fontSize: isMobile ? '11px' : '13px',
              background: activeTab === i ? '#1d1d20' : 'transparent',
              color: activeTab === i ? '#ffffff' : '#929299',
              border: 'none',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              borderBottom: activeTab === i ? '2px solid #E95420' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
              minWidth: '0',
            }}
            onMouseEnter={e => {
              if (activeTab !== i) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              if (activeTab !== i) (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: isMobile ? '10px' : '12px' }}>
              {tab.language === 'Markdown' ? '📝' : tab.language === 'Shell' ? '⚙️' : '📄'}
            </span>
            <span>{tab.name}</span>
            {openTabs.length > 1 && (
              <span
                onClick={(e) => closeTab(i, e)}
                style={{
                  fontSize: isMobile ? '11px' : '14px',
                  color: '#929299',
                  padding: '0 1px',
                  borderRadius: '3px',
                  lineHeight: 1,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                ✕
              </span>
            )}
          </button>
        ))}

        {/* Open file button */}
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <select
            onChange={(e) => {
              const file = AVAILABLE_FILES.find(f => f.name === e.target.value);
              if (file) openFile(file);
              e.target.value = '';
            }}
            style={{
              background: 'transparent',
              color: '#929299',
              border: 'none',
              fontSize: isMobile ? '11px' : '13px',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px' : '8px 12px',
            }}
            defaultValue=""
          >
            <option value="" disabled style={{ background: '#2e2e32' }}>Open...</option>
            {AVAILABLE_FILES.filter(f => !openTabs.some(t => t.name === f.name)).map(f => (
              <option key={f.name} value={f.name} style={{ background: '#2e2e32' }}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers - hidden on mobile */}
        {!isMobile && (
          <div
            className="flex-shrink-0 ubuntu-text-select"
            style={{
              padding: '8px 8px 8px 12px',
              background: '#1a1a1d',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              fontFamily: "'Ubuntu Mono', monospace",
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#555555',
              textAlign: 'right',
              userSelect: 'none',
              overflow: 'hidden',
            }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code content */}
        <div
          className="flex-1 overflow-auto ubuntu-text-select"
          style={{
            padding: isMobile ? '6px 8px' : '8px 12px',
            fontFamily: "'Ubuntu Mono', monospace",
            fontSize: isMobile ? '11px' : '13px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            color: '#cccccc',
          }}
        >
          {lines.map((line, i) => (
            <div key={i}>
              {isMobile && <span style={{ color: '#444', fontSize: '10px', marginRight: '8px', userSelect: 'none' }}>{i + 1}</span>}
              {highlightLine(line, currentFile?.language ?? 'Plain Text')}
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: isMobile ? '3px 8px' : '4px 12px',
          background: '#2e2e32',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: isMobile ? '10px' : '11px',
          color: '#929299',
        }}
      >
        <span>Ln {activeTab + 1}</span>
        {!isMobile && <span>{charCount} chars</span>}
        <span>{currentFile?.language ?? 'Plain Text'}</span>
      </div>
    </div>
  );
}

function highlightLine(line: string, language: string): React.ReactNode {
  if (language === 'Markdown') {
    if (line.startsWith('# ')) {
      return <span style={{ color: '#E95420', fontWeight: 600 }}>{line}</span>;
    }
    if (line.startsWith('## ')) {
      return <span style={{ color: '#E95420', fontWeight: 500 }}>{line}</span>;
    }
    if (line.startsWith('### ')) {
      return <span style={{ color: '#E9A420', fontWeight: 500 }}>{line}</span>;
    }
    if (line.startsWith('- ')) {
      return (
        <span>
          <span style={{ color: '#E95420' }}>- </span>
          {highlightInline(line.slice(2))}
        </span>
      );
    }
    return highlightInline(line);
  }

  if (language === 'Shell') {
    if (line.startsWith('#')) {
      return <span style={{ color: '#6a9955' }}>{line}</span>;
    }
    if (line.startsWith('export ')) {
      return (
        <span>
          <span style={{ color: '#569cd6' }}>export </span>
          {line.slice(7)}
        </span>
      );
    }
    if (line.startsWith('alias ')) {
      return (
        <span>
          <span style={{ color: '#c586c0' }}>alias </span>
          {line.slice(6)}
        </span>
      );
    }
    return <span>{line}</span>;
  }

  return <span>{line}</span>;
}

function highlightInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <span key={i} style={{ color: '#ce9178', background: 'rgba(255,255,255,0.06)', padding: '1px 3px', borderRadius: '3px' }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
