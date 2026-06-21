'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { kyleData } from '@/data/kyle-data';
import { sounds } from '@/lib/sounds';

type TabId = 'installed' | 'updates';

interface AppEntry {
  name: string;
  category: string;
  icon: string;
  rating: number;
  installed: boolean;
  description: string;
}

const SKILL_ICONS: Record<string, string> = {
  'Product Strategy': '🎯',
  'UX / Systems Design': '🎨',
  'Healthcare AI': '🏥',
  'Workflow Design': '⚡',
  'Commercial Thinking': '💰',
  'Graphic Design': '🖌️',
  'Creative Direction': '🎬',
  'Web Development': '🌐',
  'Illustration': '✏️',
  'Brand Identity': '🏷️',
  'Client Relations': '🤝',
  'Operations Management': '⚙️',
  'Design Mentorship': '🧑‍🏫',
  'Product Management': '📋',
  'UX Research': '🔍',
  'UI Design': '💎',
  'Prototyping': '🧪',
  'Design Systems': '📦',
  'Figma': '🎨',
  'Adobe Creative Suite': '🎭',
  'HTML/CSS': '🖥️',
  'JavaScript': '⚡',
  'React': '⚛️',
  'Next.js': '▲',
  'Tailwind CSS': '🌊',
  'Wireframing': '📐',
  'User Testing': '🧑‍💻',
  'A/B Testing': '📊',
  'Information Architecture': '🗂️',
  'Visual Design': '👁️',
  'Typography': '🔤',
  'Color Theory': '🌈',
  'Layout Design': '📐',
  'Project Management': '📋',
  'Stakeholder Communication': '🗣️',
  'Agile': '🏃',
  'Design Thinking': '💡',
  'Responsive Design': '📱',
  'Accessibility': '♿',
  'Performance Optimization': '🚀',
  'SEO': '🔎',
  'Content Strategy': '📝',
  'Data Visualization': '📈',
  'DesignOps': '🔧',
  'Team Leadership': '👥',
  'Mentoring': '🎓',
  'Presentation Design': '🎤',
  'Motion Design': '🎬',
  '3D Design': '🧊',
  'Photography': '📷',
  'Video Editing': '🎬',
  'Social Media Design': '📱',
  'Print Design': '🖨️',
  'Packaging Design': '📦',
  'Environmental Design': '🏢',
};

const CATEGORIES = ['All', 'Design', 'Development', 'Strategy', 'Communication'];

function categorizeSkill(name: string): string {
  const designSkills = ['Graphic Design', 'Creative Direction', 'Illustration', 'Brand Identity', 'UI Design', 'Visual Design', 'Typography', 'Color Theory', 'Layout Design', 'Design Systems', 'Motion Design', '3D Design', 'Photography', 'Video Editing', 'Social Media Design', 'Print Design', 'Packaging Design', 'Environmental Design', 'Figma', 'Adobe Creative Suite', 'Presentation Design', 'Prototyping', 'Wireframing'];
  const devSkills = ['Web Development', 'HTML/CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Performance Optimization', 'SEO', 'Accessibility', 'Responsive Design'];
  const strategySkills = ['Product Strategy', 'Product Management', 'Healthcare AI', 'Commercial Thinking', 'Design Thinking', 'Content Strategy', 'Data Visualization', 'Information Architecture'];
  const commSkills = ['Client Relations', 'Design Mentorship', 'UX Research', 'User Testing', 'A/B Testing', 'Stakeholder Communication', 'Team Leadership', 'Mentoring', 'Agile', 'Project Management', 'DesignOps', 'Operations Management', 'Workflow Design'];

  if (designSkills.includes(name)) return 'Design';
  if (devSkills.includes(name)) return 'Development';
  if (strategySkills.includes(name)) return 'Strategy';
  if (commSkills.includes(name)) return 'Communication';
  return 'Design';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{ fontSize: '10px', color: star <= rating ? '#FFC107' : 'rgba(255,255,255,0.15)' }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Software() {
  const [activeTab, setActiveTab] = useState<TabId>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allApps = useMemo<AppEntry[]>(() => {
    const coreApps: AppEntry[] = kyleData.skills.core.map(skill => ({
      name: skill.name,
      category: categorizeSkill(skill.name),
      icon: SKILL_ICONS[skill.name] || '📦',
      rating: 5,
      installed: true,
      description: `Core skill at ${skill.usage}% utilization since ${skill.since}`,
    }));

    const secondaryApps: AppEntry[] = kyleData.skills.secondary.map(skill => ({
      name: skill,
      category: categorizeSkill(skill),
      icon: SKILL_ICONS[skill] || '📦',
      rating: 4,
      installed: true,
      description: `Secondary skill in ${categorizeSkill(skill).toLowerCase()}`,
    }));

    return [...coreApps, ...secondaryApps];
  }, []);

  const filteredApps = useMemo(() => {
    let apps = allApps;
    if (selectedCategory !== 'All') {
      apps = apps.filter(a => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      apps = apps.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
    }
    return apps;
  }, [allApps, selectedCategory, searchQuery]);

  const updatesData = useMemo(() => kyleData.career.slice().reverse(), []);

  const handleTabClick = useCallback((tab: TabId) => {
    sounds.click();
    setActiveTab(tab);
  }, []);

  const handleCategoryClick = useCallback((cat: string) => {
    sounds.click();
    setSelectedCategory(cat);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1d1d20', color: '#ffffff' }}>
      {/* Header */}
      <div
        className="flex-shrink-0"
        style={{ padding: isMobile ? '8px 10px' : '12px 16px', background: '#2e2e32', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 600 }}>App Center</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTabClick('installed')}
              style={{
                padding: '3px 10px',
                fontSize: '12px',
                background: activeTab === 'installed' ? 'rgba(233,84,32,0.15)' : 'transparent',
                color: activeTab === 'installed' ? '#E95420' : '#929299',
                border: '1px solid ' + (activeTab === 'installed' ? 'rgba(233,84,32,0.3)' : 'rgba(255,255,255,0.1)'),
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Installed
            </button>
            <button
              onClick={() => handleTabClick('updates')}
              style={{
                padding: '3px 10px',
                fontSize: '12px',
                background: activeTab === 'updates' ? 'rgba(233,84,32,0.15)' : 'transparent',
                color: activeTab === 'updates' ? '#E95420' : '#929299',
                border: '1px solid ' + (activeTab === 'updates' ? 'rgba(233,84,32,0.3)' : 'rgba(255,255,255,0.1)'),
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Updates
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '5px 10px',
          }}
        >
          <span style={{ fontSize: '12px', color: '#929299', marginRight: '6px' }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              width: '100%',
              outline: 'none',
              fontFamily: "'Ubuntu', sans-serif",
            }}
          />
        </div>

        {/* Category pills */}
        {activeTab === 'installed' && (
          <div className="flex items-center gap-1" style={{ marginTop: '6px', overflowX: 'auto' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  background: selectedCategory === cat ? '#E95420' : 'rgba(255,255,255,0.06)',
                  color: selectedCategory === cat ? '#ffffff' : '#929299',
                  border: '1px solid ' + (selectedCategory === cat ? '#E95420' : 'rgba(255,255,255,0.1)'),
                  borderRadius: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ padding: isMobile ? '8px 10px' : '12px 16px' }}>
        {activeTab === 'installed' ? (
          <>
            <div style={{ fontSize: '11px', color: '#929299', marginBottom: '8px' }}>
              {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} installed
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px' }}>
              {filteredApps.map(app => (
                <div
                  key={app.name}
                  className="flex items-start gap-2 ubuntu-text-select"
                  style={{
                    padding: isMobile ? '8px 10px' : '10px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0, marginTop: '2px' }}>{app.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#929299', marginBottom: '3px' }}>{app.category}</div>
                    <StarRating rating={app.rating} />
                    <div className="flex items-center gap-1" style={{ marginTop: '3px' }}>
                      <span style={{
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        background: 'rgba(76,175,80,0.15)',
                        color: '#4CAF50',
                        border: '1px solid rgba(76,175,80,0.3)',
                      }}>
                        Installed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: '#929299', marginBottom: '8px' }}>
              Career progression updates
            </div>
            {updatesData.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-2 ubuntu-text-select"
                style={{
                  padding: isMobile ? '10px' : '12px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '6px',
                }}
              >
                <span style={{ fontSize: isMobile ? '18px' : '24px', flexShrink: 0 }}>{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{entry.role}</span>
                    <span style={{
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(233,84,32,0.15)',
                      color: '#E95420',
                      border: '1px solid rgba(233,84,32,0.3)',
                      whiteSpace: 'nowrap',
                    }}>
                      Update
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#E95420', marginBottom: '1px' }}>{entry.company}</div>
                  <div style={{ fontSize: '10px', color: '#929299', marginBottom: '3px' }}>Version: {entry.period}</div>
                  <div style={{ fontSize: '11px', color: '#cccccc', lineHeight: 1.4 }}>{entry.description}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
