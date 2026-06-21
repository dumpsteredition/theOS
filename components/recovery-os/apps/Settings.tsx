'use client';
import { useState, useEffect } from 'react';
import { kyleData } from '@/data/kyle-data';

type SettingsSection = 'wifi' | 'bluetooth' | 'display' | 'sound' | 'power' | 'about' | 'apps' | 'users' | 'privacy' | 'keyboard';

const BORDER_COLOR = 'rgba(255,255,255,0.1)';
const CARD_BG = 'rgba(255,255,255,0.06)';

function SettingRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 sm:px-4 gap-2" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {icon && <span style={{ fontSize: '14px' }} className="shrink-0">{icon}</span>}
        <span style={{ color: '#929299', fontSize: '13px' }} className="shrink-0">{label}</span>
      </div>
      <span className="ubuntu-text-select text-right truncate" style={{ color: '#ffffff', fontSize: '13px', maxWidth: '55%' }}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, active, icon }: { label: string; active: boolean; icon?: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 sm:px-4" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <div className="flex items-center gap-2 sm:gap-3">
        {icon && <span style={{ fontSize: '14px' }} className="shrink-0">{icon}</span>}
        <span style={{ color: '#ffffff', fontSize: '13px' }}>{label}</span>
      </div>
      <div className={`ubuntu-toggle ${active ? 'active' : ''}`} style={{ flexShrink: 0 }} />
    </div>
  );
}

function SliderRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="py-3 px-3 sm:px-4" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: '#ffffff', fontSize: '13px' }}>{label}</span>
        <span className="ubuntu-text-select" style={{ color: color || '#E95420', fontSize: '12px', fontWeight: 500 }}>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color || '#E95420', borderRadius: '2px' }} />
      </div>
    </div>
  );
}

const SECTIONS: { id: SettingsSection; icon: string; label: string }[] = [
  { id: 'wifi', icon: '📶', label: 'Wi-Fi' },
  { id: 'bluetooth', icon: '🔵', label: 'Bluetooth' },
  { id: 'display', icon: '🖥️', label: 'Display' },
  { id: 'sound', icon: '🔊', label: 'Sound' },
  { id: 'power', icon: '🔋', label: 'Power' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
  { id: 'apps', icon: '📦', label: 'Applications' },
  { id: 'users', icon: '👤', label: 'Users' },
  { id: 'privacy', icon: '🔒', label: 'Privacy' },
  { id: 'keyboard', icon: '⌨️', label: 'Keyboard' },
];

function SettingsContent({ activeSection }: { activeSection: SettingsSection }) {
  return (
    <>
      {/* Wi-Fi - Social Media as Networks */}
      {activeSection === 'wifi' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Wi-Fi</h3>
          <ToggleRow label="Wi-Fi" active={true} icon="📶" />
          <div style={{ marginTop: '12px' }}>
            <div style={{ color: '#929299', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', padding: '0 12px' }}>Connected Networks</div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
              {kyleData.network.map((conn, i) => (
                <div key={conn.name} className="flex items-center justify-between py-3 px-3 sm:px-4 gap-2" style={{ borderBottom: i < kyleData.network.length - 1 ? `1px solid ${BORDER_COLOR}` : 'none', background: CARD_BG }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ fontSize: '16px' }} className="shrink-0">
                      {conn.icon === 'linkedin' ? '💼' : conn.icon === 'instagram' ? '📸' : conn.icon === 'facebook' ? '👥' : conn.icon === 'globe' ? '🌐' : '🎨'}
                    </span>
                    <div className="min-w-0">
                      <div className="ubuntu-text-select truncate" style={{ color: '#ffffff', fontSize: '13px' }}>{conn.name}</div>
                      <div className="ubuntu-text-select truncate" style={{ color: '#929299', fontSize: '11px' }}>{conn.protocol} • {conn.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div style={{ display: 'flex', gap: '1px', alignItems: 'flex-end' }}>
                      {[4, 6, 8, 10].map((h, j) => (
                        <div key={j} style={{ width: '3px', height: `${h}px`, background: j < 3 ? '#4CAF50' : 'rgba(255,255,255,0.15)', borderRadius: '1px' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '10px', color: '#4CAF50', marginLeft: '2px' }}>Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bluetooth - Affiliations */}
      {activeSection === 'bluetooth' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Bluetooth</h3>
          <ToggleRow label="Bluetooth" active={true} icon="🔵" />
          <div style={{ marginTop: '12px' }}>
            <div style={{ color: '#929299', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', padding: '0 12px' }}>Connected Devices</div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
              <div className="flex items-center justify-between py-3 px-3 sm:px-4 gap-2" style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER_COLOR}` }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ fontSize: '16px' }} className="shrink-0">🏥</span>
                  <div className="min-w-0">
                    <div className="ubuntu-text-select" style={{ color: '#ffffff', fontSize: '13px' }}>Lucem Health</div>
                    <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '11px' }}>Healthcare AI Platform</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: '#4CAF50' }} className="shrink-0">Connected</span>
              </div>
              <div className="flex items-center justify-between py-3 px-3 sm:px-4 gap-2" style={{ background: CARD_BG }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ fontSize: '16px' }} className="shrink-0">🧑‍🏫</span>
                  <div className="min-w-0">
                    <div className="ubuntu-text-select" style={{ color: '#ffffff', fontSize: '13px' }}>Designed.org</div>
                    <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '11px' }}>Design Mentorship Community</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: '#4CAF50' }} className="shrink-0">Connected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display - Design Philosophy */}
      {activeSection === 'display' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Display</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <SettingRow label="Resolution" value="Maximum Clarity" icon="📐" />
            <SettingRow label="Refresh Rate" value="Always Iterating" icon="🔄" />
            <SettingRow label="Night Light" value="Structure Over Ornament" icon="🌙" />
            <SettingRow label="Scale" value="Trust-Sensitive Judgment" icon="⚖️" />
            <SettingRow label="Orientation" value="Human-Centered" icon="🧭" />
            <SettingRow label="Fractional Scaling" value="Progressive Disclosure" icon="🔍" />
          </div>
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(233,84,32,0.08)', border: '1px solid rgba(233,84,32,0.2)' }}>
            <div style={{ color: '#E95420', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Design Philosophy</div>
            <div className="ubuntu-text-select" style={{ color: '#cccccc', fontSize: '12px', lineHeight: 1.5 }}>
              {kyleData.philosophy.tagline}
            </div>
          </div>
        </div>
      )}

      {/* Sound - Skill levels */}
      {activeSection === 'sound' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Sound</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <SliderRow label="Product Strategy" value={92} color="#E95420" />
            <SliderRow label="UX / Systems Design" value={88} color="#77216F" />
            <SliderRow label="Healthcare AI" value={85} color="#4CAF50" />
            <SliderRow label="Workflow Design" value={90} color="#2196F3" />
            <SliderRow label="Commercial Thinking" value={82} color="#FFC107" />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ color: '#929299', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', padding: '0 12px' }}>Output Devices</div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
              <SettingRow label="Creative Direction" value="95% — Primary" icon="🎨" />
              <SettingRow label="Design Mentorship" value="70% — Secondary" icon="🎓" />
            </div>
          </div>
        </div>
      )}

      {/* Power - Energy & Motivation */}
      {activeSection === 'power' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Power</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}`, marginBottom: '12px' }}>
            <div className="py-3 px-3 sm:px-4" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#ffffff', fontSize: '13px' }}>Battery Level</span>
                <span style={{ color: '#4CAF50', fontSize: '13px', fontWeight: 600 }}>100%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #4CAF50, #8BC34A)', borderRadius: '4px' }} />
              </div>
              <div style={{ color: '#929299', fontSize: '11px', marginTop: '4px' }}>Restless Creative — Always Charged</div>
            </div>
          </div>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <SettingRow label="Power Mode" value="End-to-End" icon="⚡" />
            <SettingRow label="Automatic Suspend" value="Never (Always Creating)" icon="💤" />
            <SettingRow label="Show Battery" value="Always" icon="🔋" />
            <ToggleRow label="Power Saver" active={false} icon="🍃" />
          </div>
        </div>
      )}

      {/* About - System Info */}
      {activeSection === 'about' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #E95420, #77216F)' }}
            >
              KB
            </div>
            <div className="min-w-0">
              <div className="ubuntu-text-select" style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600 }}>{kyleData.about.deviceName}</div>
              <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '13px' }}>{kyleData.about.hardwareModel}</div>
              <div className="ubuntu-text-select" style={{ color: '#666', fontSize: '11px' }}>{kyleData.about.firmwareVersion}</div>
            </div>
          </div>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <SettingRow label="OS Name" value={kyleData.system.osName} />
            <SettingRow label="OS Type" value={kyleData.about.osType} />
            <SettingRow label="Kernel" value={kyleData.system.kernel} />
            <SettingRow label="Memory" value={kyleData.about.memory} />
            <SettingRow label="Processor" value={kyleData.about.processor} />
            <SettingRow label="Graphics" value={kyleData.about.graphics} />
            <SettingRow label="Disk" value={kyleData.about.disk} />
            <SettingRow label="GNOME Version" value={kyleData.about.gnomeVersion} />
            <SettingRow label="Windowing System" value={kyleData.about.windowingSystem} />
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '11px' }}>
              {kyleData.personal.location} • {kyleData.personal.title}
            </div>
          </div>
        </div>
      )}

      {/* Applications - Work Experience */}
      {activeSection === 'apps' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Applications</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            {kyleData.career.map((entry, i) => (
              <div key={i} className="py-3 px-3 sm:px-4" style={{ borderBottom: i < kyleData.career.length - 1 ? `1px solid ${BORDER_COLOR}` : 'none', background: i % 2 === 0 ? 'transparent' : CARD_BG }}>
                <div className="flex items-start gap-2">
                  <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{entry.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="ubuntu-text-select" style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>{entry.role}</div>
                    <div className="ubuntu-text-select" style={{ color: '#E95420', fontSize: '11px' }}>{entry.company}</div>
                    <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '11px', lineHeight: 1.4, marginTop: '2px' }}>{entry.description}</div>
                  </div>
                  <span className="ubuntu-text-select shrink-0" style={{ color: '#929299', fontSize: '10px', marginTop: '2px' }}>{entry.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users - Kyle's Profile */}
      {activeSection === 'users' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Users</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <div className="flex items-center gap-3 py-3 px-3 sm:px-4" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #E95420, #77216F)' }}
              >
                KB
              </div>
              <div className="min-w-0">
                <div className="ubuntu-text-select" style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600 }}>{kyleData.system.fullName}</div>
                <div className="ubuntu-text-select" style={{ color: '#E95420', fontSize: '12px' }}>{kyleData.personal.title}</div>
                <div className="ubuntu-text-select" style={{ color: '#929299', fontSize: '11px' }}>{kyleData.personal.company}</div>
              </div>
            </div>
            <SettingRow label="Account Type" value="Administrator" icon="🛡️" />
            <SettingRow label="Language" value="English" icon="🌐" />
            <SettingRow label="Location" value={kyleData.personal.location} icon="📍" />
            <SettingRow label="Experience" value={kyleData.system.uptime} icon="⏱️" />
            <SettingRow label="Tags" value={kyleData.personal.tags.join(' • ')} icon="🏷️" />
          </div>
        </div>
      )}

      {/* Privacy - Core Values */}
      {activeSection === 'privacy' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Privacy</h3>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            <SettingRow label="Location Services" value="Jacksonville, FL" icon="📍" />
            <SettingRow label="Usage & History" value="23+ years" icon="📊" />
            <SettingRow label="Purge Data" value="Never" icon="🗑️" />
            <ToggleRow label="Trust-Sensitive Design" active={true} icon="🔐" />
            <ToggleRow label="Explainability" active={true} icon="💡" />
            <ToggleRow label="Workflow Confidence" active={true} icon="✅" />
            <ToggleRow label="Progressive Disclosure" active={true} icon="🔓" />
          </div>
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(233,84,32,0.08)', border: '1px solid rgba(233,84,32,0.2)' }}>
            <div style={{ color: '#E95420', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Core Values</div>
            {kyleData.philosophy.principles.map((p, i) => (
              <div key={i} className="ubuntu-text-select" style={{ color: '#cccccc', fontSize: '12px', lineHeight: 1.5, marginBottom: '4px' }}>
                <span style={{ color: '#E95420' }}>{p.title}:</span> {p.desc}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard - Skills as shortcuts */}
      {activeSection === 'keyboard' && (
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Keyboard</h3>
          <div style={{ color: '#929299', fontSize: '12px', marginBottom: '10px' }}>Skill Shortcuts</div>
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER_COLOR}` }}>
            {[
              { keys: 'Ctrl+Strategy', action: 'Product Scope & Problem Framing' },
              { keys: 'Ctrl+Design', action: 'UX Systems & Hierarchy' },
              { keys: 'Ctrl+AI', action: 'Healthcare Trust & Explainability' },
              { keys: 'Ctrl+Workflow', action: 'Operational Friction Removal' },
              { keys: 'Ctrl+Commercial', action: 'Useful Tradeoffs & Value' },
              { keys: 'Alt+Creative', action: 'Direction & Brand Identity' },
              { keys: 'Alt+Mentor', action: 'Design Mentorship & Growth' },
              { keys: 'Shift+Iterate', action: 'Rapid Prototyping & Testing' },
              { keys: 'Shift+Ship', action: 'End-to-End Delivery' },
              { keys: 'Super+Think', action: 'Design Thinking & Research' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3 sm:px-4 gap-2" style={{ borderBottom: i < 9 ? `1px solid ${BORDER_COLOR}` : 'none' }}>
                <span className="ubuntu-text-select truncate" style={{ color: '#ffffff', fontSize: '12px' }}>{shortcut.action}</span>
                <kbd className="shrink-0" style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', color: '#E95420', fontFamily: "'Ubuntu Mono', monospace", border: '1px solid rgba(255,255,255,0.15)' }}>
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('about');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDetailView, setMobileDetailView] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSelectSection = (section: SettingsSection) => {
    setActiveSection(section);
    if (isMobile) setMobileDetailView(true);
  };

  const handleBack = () => {
    setMobileDetailView(false);
  };

  // Mobile: Stacked navigation - category list OR detail view
  if (isMobile) {
    // Detail view with back button
    if (mobileDetailView) {
      return (
        <div className="w-full h-full flex flex-col" style={{ background: 'var(--yaru-view-bg)' }}>
          {/* Header with back button */}
          <div
            className="flex items-center gap-2 shrink-0 px-3 py-2"
            style={{ borderBottom: `1px solid ${BORDER_COLOR}`, background: 'var(--yaru-sidebar-bg)' }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
              style={{ fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <span style={{ color: '#929299', fontSize: '12px' }}>•</span>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>
              {SECTIONS.find(s => s.id === activeSection)?.icon} {SECTIONS.find(s => s.id === activeSection)?.label}
            </span>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <SettingsContent activeSection={activeSection} />
          </div>
        </div>
      );
    }

    // Category list view
    return (
      <div className="w-full h-full flex flex-col" style={{ background: 'var(--yaru-view-bg)' }}>
        <div className="shrink-0 px-3 py-3" style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
          <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600 }}>Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSelectSection(section.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '18px' }}>{section.icon}</span>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>{section.label}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#929299' }}>
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Sidebar + content layout
  return (
    <div className="w-full h-full flex" style={{ background: 'var(--yaru-view-bg)' }}>
      {/* Sidebar */}
      <div
        className="w-52 shrink-0 flex flex-col py-2 border-r overflow-y-auto"
        style={{ background: 'var(--yaru-sidebar-bg)', borderColor: 'var(--yaru-border-color)' }}
      >
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 text-left transition-colors"
            style={{
              background: activeSection === section.id ? 'rgba(255,255,255,0.1)' : undefined,
              borderLeft: activeSection === section.id ? '3px solid #E95420' : '3px solid transparent',
            }}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <SettingsContent activeSection={activeSection} />
      </div>
    </div>
  );
}
