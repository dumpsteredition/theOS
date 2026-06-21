'use client';

import { useState, useCallback, useEffect } from 'react';
import { kyleData } from '@/data/kyle-data';
import { sounds } from '@/lib/sounds';

type Section = 'home' | 'about' | 'work' | 'contact';

const NAV_ITEMS: { id: Section; label: string; shortLabel: string }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home' },
  { id: 'about', label: 'About', shortLabel: 'About' },
  { id: 'work', label: 'Work', shortLabel: 'Work' },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
];

function HomeSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 32px' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: isMobile ? '11px' : '14px', color: '#E95420', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Product Strategy • UX Systems • Healthcare AI
        </div>
        <h1 className="ubuntu-text-select" style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: 700, lineHeight: 1.2, marginBottom: isMobile ? '12px' : '16px' }}>
          Kyle Brumbley
        </h1>
        <p className="ubuntu-text-select" style={{ fontSize: isMobile ? '15px' : '18px', color: '#929299', lineHeight: 1.5, marginBottom: isMobile ? '16px' : '24px' }}>
          {kyleData.philosophy.tagline}
        </p>
        <p className="ubuntu-text-select" style={{ fontSize: '13px', color: '#cccccc', lineHeight: 1.6, marginBottom: '16px' }}>
          {kyleData.philosophy.beliefs[0]}
        </p>
        <p className="ubuntu-text-select" style={{ fontSize: '13px', color: '#cccccc', lineHeight: 1.6 }}>
          {kyleData.philosophy.beliefs[1]}
        </p>
        <div style={{ marginTop: isMobile ? '20px' : '32px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {kyleData.personal.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '4px 10px',
                background: 'rgba(233,84,32,0.15)',
                color: '#E95420',
                borderRadius: '16px',
                fontSize: '12px',
                border: '1px solid rgba(233,84,32,0.3)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 32px' }}>
      <div style={{ maxWidth: '600px' }}>
        <h2 className="ubuntu-text-select" style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, marginBottom: '6px' }}>About</h2>
        <div style={{ width: '40px', height: '3px', background: '#E95420', marginBottom: isMobile ? '16px' : '24px', borderRadius: '2px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: isMobile ? '16px' : '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px' }}>
            <div className="ubuntu-text-select" style={{ fontSize: '11px', color: '#929299', marginBottom: '2px' }}>Location</div>
            <div className="ubuntu-text-select" style={{ fontSize: '13px' }}>{kyleData.personal.location}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px' }}>
            <div className="ubuntu-text-select" style={{ fontSize: '11px', color: '#929299', marginBottom: '2px' }}>Current Role</div>
            <div className="ubuntu-text-select" style={{ fontSize: '13px' }}>{kyleData.personal.title}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px' }}>
            <div className="ubuntu-text-select" style={{ fontSize: '11px', color: '#929299', marginBottom: '2px' }}>Experience</div>
            <div className="ubuntu-text-select" style={{ fontSize: '13px' }}>{kyleData.system.uptime}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#E95420' }}>Core Skills</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {kyleData.skills.core.map(skill => (
            <div key={skill.name}>
              <div className="flex items-center justify-between ubuntu-text-select" style={{ marginBottom: '3px' }}>
                <span style={{ fontSize: '12px' }}>{skill.name}</span>
                <span style={{ fontSize: '11px', color: '#929299' }}>{skill.usage}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: `${skill.usage}%`, height: '100%', background: '#E95420', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 32px' }}>
      <div style={{ maxWidth: '600px' }}>
        <h2 className="ubuntu-text-select" style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, marginBottom: '6px' }}>Work</h2>
        <div style={{ width: '40px', height: '3px', background: '#E95420', marginBottom: isMobile ? '16px' : '24px', borderRadius: '2px' }} />

        {kyleData.career.map((entry, i) => (
          <div
            key={i}
            className="flex items-start gap-3"
            style={{
              padding: isMobile ? '10px 0' : '16px',
              background: i % 2 === 0 && !isMobile ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderRadius: '8px',
              marginBottom: '2px',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0 }}>{entry.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="ubuntu-text-select" style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: 600 }}>{entry.role}</div>
              <div className="ubuntu-text-select" style={{ fontSize: '12px', color: '#E95420' }}>{entry.company}</div>
              <div className="ubuntu-text-select" style={{ fontSize: '11px', color: '#929299', marginBottom: '2px' }}>{entry.period}</div>
              <div className="ubuntu-text-select" style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.5 }}>{entry.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px 32px' }}>
      <div style={{ maxWidth: '600px' }}>
        <h2 className="ubuntu-text-select" style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, marginBottom: '6px' }}>Contact</h2>
        <div style={{ width: '40px', height: '3px', background: '#E95420', marginBottom: isMobile ? '16px' : '24px', borderRadius: '2px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {kyleData.network.map(net => (
            <a
              key={net.name}
              href={net.address}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between"
              style={{
                padding: isMobile ? '10px 12px' : '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(233,84,32,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ fontSize: '16px' }} className="shrink-0">
                  {net.icon === 'linkedin' ? '💼' : net.icon === 'instagram' ? '📸' : net.icon === 'facebook' ? '👥' : net.icon === 'globe' ? '🌐' : '🎨'}
                </span>
                <div className="min-w-0">
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{net.name}</div>
                  <div className="ubuntu-text-select truncate" style={{ fontSize: '11px', color: '#929299' }}>{net.protocol}</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#929299' }} className="shrink-0">→</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '16px', padding: isMobile ? '14px' : '20px', background: 'rgba(233,84,32,0.08)', borderRadius: '10px', border: '1px solid rgba(233,84,32,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#E95420' }}>Get in Touch</div>
          <div className="ubuntu-text-select" style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.5 }}>
            {kyleData.personal.email}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Firefox() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [url, setUrl] = useState('https://www.kylebrumbley.com');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNav = useCallback((section: Section) => {
    sounds.click();
    setActiveSection(section);
    setUrl(section === 'home' ? 'https://www.kylebrumbley.com' : `https://www.kylebrumbley.com/${section}`);
  }, []);

  const handleRefresh = useCallback(() => {
    sounds.click();
  }, []);

  const sectionProps = { isMobile };

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <HomeSection {...sectionProps} />;
      case 'about': return <AboutSection {...sectionProps} />;
      case 'work': return <WorkSection {...sectionProps} />;
      case 'contact': return <ContactSection {...sectionProps} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1d1d20', color: '#ffffff' }}>
      {/* Browser toolbar */}
      <div
        className="flex items-center gap-1.5 flex-shrink-0"
        style={{ padding: isMobile ? '4px 6px' : '6px 8px', background: '#2e2e32', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Navigation buttons */}
        <button
          onClick={() => handleNav('home')}
          style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', border: 'none', color: '#929299', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}
        >
          ←
        </button>
        {!isMobile && (
          <>
            <button
              onClick={() => {}}
              style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', border: 'none', color: '#555555', cursor: 'default', fontSize: '13px', flexShrink: 0 }}
            >
              →
            </button>
            <button
              onClick={handleRefresh}
              style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', border: 'none', color: '#929299', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}
            >
              ↻
            </button>
          </>
        )}

        {/* URL bar */}
        <div
          className="flex-1 flex items-center min-w-0"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '5px',
            padding: '3px 8px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: '#4CAF50', fontSize: '10px', marginRight: '4px' }}>🔒</span>
          <span className="ubuntu-text-select truncate" style={{ color: '#929299' }}>{isMobile ? 'kylebrumbley.com' : url}</span>
        </div>
      </div>

      {/* Site navigation */}
      <div
        className="flex items-center gap-0 flex-shrink-0 overflow-x-auto"
        style={{ padding: isMobile ? '0 8px' : '0 16px', background: '#2e2e32', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span style={{ fontSize: '13px', marginRight: isMobile ? '8px' : '16px', fontWeight: 700, color: '#E95420', padding: '6px 0', flexShrink: 0 }}>KB</span>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            style={{
              padding: isMobile ? '6px 8px' : '8px 12px',
              fontSize: isMobile ? '12px' : '13px',
              background: 'transparent',
              color: activeSection === item.id ? '#E95420' : '#929299',
              border: 'none',
              borderBottom: activeSection === item.id ? '2px solid #E95420' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.color = '#929299'; }}
          >
            {isMobile ? item.shortLabel : item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {renderSection()}
      </div>

      {/* Status bar - hide on mobile */}
      {!isMobile && (
        <div
          className="flex-shrink-0 flex items-center"
          style={{
            padding: '4px 12px',
            background: '#2e2e32',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '11px',
            color: '#929299',
          }}
        >
          <span>🦊 Firefox • kylebrumbley.com</span>
        </div>
      )}
    </div>
  );
}
