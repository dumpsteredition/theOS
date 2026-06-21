'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { kyleData } from '@/data/kyle-data';
import { sounds } from '@/lib/sounds';

type TabId = 'processes' | 'resources' | 'filesystem';

const TABS: { id: TabId; label: string }[] = [
  { id: 'processes', label: 'Processes' },
  { id: 'resources', label: 'Resources' },
  { id: 'filesystem', label: 'File Systems' },
];

const CORE_COLORS = ['#E95420', '#77216F', '#4CAF50', '#2196F3', '#FFC107'];

const EXTRA_PROCESSES = [
  { name: 'Creative Direction', usage: 95, pid: 1006, status: 'active' as const, since: 2014 },
  { name: 'Design Mentorship', usage: 70, pid: 1007, status: 'active' as const, since: 2020 },
  { name: 'Brand Identity', usage: 75, pid: 1008, status: 'active' as const, since: 2004 },
];

function ProcessesTab({ isMobile }: { isMobile: boolean }) {
  const allProcesses = [...kyleData.skills.core, ...EXTRA_PROCESSES];
  
  // Mobile: card layout instead of table
  if (isMobile) {
    return (
      <div className="w-full h-full overflow-auto" style={{ padding: '8px' }}>
        <div className="flex flex-col gap-2">
          {allProcesses.map((proc) => (
            <div
              key={proc.pid}
              className="ubuntu-text-select rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: proc.usage > 85 ? '#E95420' : proc.usage > 70 ? '#FFC107' : '#4CAF50', flexShrink: 0 }} />
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>{proc.name}</span>
                </div>
                <span style={{ color: proc.usage > 85 ? '#E95420' : '#ffffff', fontSize: '13px', fontWeight: 600 }}>{proc.usage}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: `${proc.usage}%`, height: '100%', background: proc.usage > 85 ? '#E95420' : '#4CAF50', borderRadius: '2px' }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ color: '#929299', fontSize: '10px' }}>PID: {proc.pid}</span>
                <span style={{ color: '#929299', fontSize: '10px' }}>Mem: {(proc.usage * 0.028).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: table layout
  return (
    <div className="w-full h-full overflow-auto" style={{ padding: '0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#2e2e32', position: 'sticky', top: 0 }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Process Name</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>User</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>%CPU</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Memory</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>PID</th>
          </tr>
        </thead>
        <tbody>
          {allProcesses.map((proc, i) => (
            <tr
              key={proc.pid}
              className="ubuntu-text-select"
              style={{
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <td style={{ padding: '6px 12px', color: '#ffffff' }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: proc.usage > 85 ? '#E95420' : proc.usage > 70 ? '#FFC107' : '#4CAF50', flexShrink: 0 }} />
                  {proc.name}
                </div>
              </td>
              <td style={{ padding: '6px 12px', color: '#929299' }}>kyle</td>
              <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                <div className="flex items-center gap-2 justify-end">
                  <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${proc.usage}%`, height: '100%', background: proc.usage > 85 ? '#E95420' : '#4CAF50', borderRadius: '2px' }} />
                  </div>
                  <span style={{ minWidth: '32px', textAlign: 'right', color: proc.usage > 85 ? '#E95420' : '#ffffff' }}>{proc.usage}%</span>
                </div>
              </td>
              <td style={{ padding: '6px 12px', textAlign: 'right', color: '#929299' }}>
                {(proc.usage * 0.028).toFixed(1)}%
              </td>
              <td style={{ padding: '6px 12px', textAlign: 'right', color: '#929299' }}>{proc.pid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourcesTab({ isMobile }: { isMobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef<number[][]>(
    kyleData.skills.core.map(s => Array(60).fill(s.usage))
  );
  const drawRef = useRef<() => void>(() => {});

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.fillStyle = '#1d1d20';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!isMobile) {
      ctx.fillStyle = '#555555';
      ctx.font = '10px Ubuntu Mono';
      ctx.textAlign = 'left';
      for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        ctx.fillText(`${100 - i * 25}%`, 4, y + 12);
      }
    }

    const data = dataRef.current;
    data.forEach((values, skillIdx) => {
      ctx.strokeStyle = CORE_COLORS[skillIdx % CORE_COLORS.length];
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      const stepX = w / (values.length - 1);
      values.forEach((val, i) => {
        const x = i * stepX;
        const y = h - (val / 100) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.globalAlpha = 0.08;
      ctx.fillStyle = CORE_COLORS[skillIdx % CORE_COLORS.length];
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    data.forEach((values, skillIdx) => {
      const baseUsage = kyleData.skills.core[skillIdx].usage;
      const newValues = values.slice(1);
      const lastVal = newValues[newValues.length - 1];
      const variation = (Math.random() - 0.5) * 8;
      const newVal = Math.max(baseUsage - 15, Math.min(baseUsage + 5, lastVal + variation));
      newValues.push(newVal);
      data[skillIdx] = newValues;
    });

    animRef.current = requestAnimationFrame(drawRef.current);
  }, [isMobile]);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(() => drawRef.current());
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: isMobile ? '8px' : '12px' }}>
      <div className={`flex items-center gap-2 ${isMobile ? '' : 'gap-4 flex-wrap'}`} style={{ marginBottom: isMobile ? '8px' : '12px' }}>
        {kyleData.skills.core.map((skill, i) => (
          <div key={skill.name} className="flex items-center gap-1.5 ubuntu-text-select" style={{ fontSize: isMobile ? '10px' : '11px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: CORE_COLORS[i] }} />
            <span style={{ color: '#929299' }}>{isMobile ? skill.name.split('/')[0].trim() : skill.name}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 min-h-0" style={{ background: '#1d1d20', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-6'}`} style={{ marginTop: isMobile ? '6px' : '10px', fontSize: isMobile ? '11px' : '12px' }}>
        <div className="flex items-center gap-1 ubuntu-text-select">
          <span style={{ color: '#929299' }}>CPU:</span>
          <span style={{ color: '#E95420' }}>86.4%</span>
        </div>
        <div className="flex items-center gap-1 ubuntu-text-select">
          <span style={{ color: '#929299' }}>Mem:</span>
          <span style={{ color: '#4CAF50' }}>63.2%</span>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2 ubuntu-text-select">
            <span style={{ color: '#929299' }}>Swap:</span>
            <span style={{ color: '#929299' }}>0.0%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FileSystemsTab({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="w-full h-full overflow-auto" style={{ padding: '8px' }}>
        <div className="flex flex-col gap-2">
          {kyleData.diskUsage.map((disk) => {
            const usedNum = parseInt(disk.used);
            const barColor = usedNum > 90 ? '#E95420' : usedNum > 80 ? '#FFC107' : '#4CAF50';
            return (
              <div
                key={disk.filesystem}
                className="ubuntu-text-select rounded-lg p-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: '#ffffff', fontSize: '12px', fontFamily: "'Ubuntu Mono', monospace" }}>{disk.filesystem}</span>
                  <span style={{ color: barColor, fontSize: '12px', fontWeight: 600 }}>{disk.used}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: disk.used, height: '100%', background: barColor, borderRadius: '3px' }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span style={{ color: '#929299', fontSize: '10px' }}>Size: {disk.size}</span>
                  <span style={{ color: '#929299', fontSize: '10px' }}>Avail: {disk.avail}</span>
                </div>
                <div style={{ color: '#929299', fontSize: '10px', marginTop: '2px' }}>Mount: {disk.mount}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#2e2e32', position: 'sticky', top: 0 }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Filesystem</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Size (Skill Area)</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Used</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Available</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#929299', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Mount</th>
          </tr>
        </thead>
        <tbody>
          {kyleData.diskUsage.map((disk, i) => {
            const usedNum = parseInt(disk.used);
            const barColor = usedNum > 90 ? '#E95420' : usedNum > 80 ? '#FFC107' : '#4CAF50';
            return (
              <tr
                key={disk.filesystem}
                className="ubuntu-text-select"
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <td style={{ padding: '6px 12px', color: '#ffffff', fontFamily: "'Ubuntu Mono', monospace" }}>{disk.filesystem}</td>
                <td style={{ padding: '6px 12px', color: '#929299' }}>{disk.size}</td>
                <td style={{ padding: '6px 12px' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: disk.used, height: '100%', background: barColor, borderRadius: '3px' }} />
                    </div>
                    <span style={{ color: barColor, fontSize: '12px' }}>{disk.used}</span>
                  </div>
                </td>
                <td style={{ padding: '6px 12px', color: '#929299' }}>{disk.avail}</td>
                <td style={{ padding: '6px 12px', color: '#929299', fontFamily: "'Ubuntu Mono', monospace" }}>{disk.mount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SystemMonitor() {
  const [activeTab, setActiveTab] = useState<TabId>('processes');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleTabClick = useCallback((tabId: TabId) => {
    sounds.click();
    setActiveTab(tabId);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1d1d20', color: '#ffffff' }}>
      {/* Tab bar */}
      <div
        className="flex items-center flex-shrink-0"
        style={{ background: '#2e2e32', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              padding: isMobile ? '8px 12px' : '10px 20px',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: 500,
              background: 'transparent',
              color: activeTab === tab.id ? '#E95420' : '#929299',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #E95420' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#929299';
            }}
          >
            {isMobile ? (tab.id === 'processes' ? 'Proc' : tab.id === 'resources' ? 'Res' : 'FS') : tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'processes' && <ProcessesTab isMobile={isMobile} />}
        {activeTab === 'resources' && <ResourcesTab isMobile={isMobile} />}
        {activeTab === 'filesystem' && <FileSystemsTab isMobile={isMobile} />}
      </div>
    </div>
  );
}
