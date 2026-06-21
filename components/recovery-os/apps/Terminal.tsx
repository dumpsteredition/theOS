'use client';
import { useState, useRef, useEffect } from 'react';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import { kyleData } from '@/data/kyle-data';

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([
    'BrumbleyOS 24.04 LTS (GNU/Linux 6.8.0-creative x86_64)',
    '',
    '  BBBBB   RRRRR   U   U  M   M  BBBBB   L       EEEEE   Y   Y  ',
    '  B    B  R    R  U   U  MM MM  B    B  L       E        Y Y   ',
    '  BBBBB   RRRRR   U   U  M M M  BBBBB   L       EEEE      Y    ',
    '  B    B  R   R   U   U  M   M  B    B  L       E         Y    ',
    '  BBBBB   R    R   UUU   M   M  BBBBB   LLLLL   EEEEE     Y    ',
    '',
    'Last login: ' + (typeof window !== 'undefined' ? new Date().toLocaleString() : 'now'),
    'Type "help" for available commands.',
    '',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(' ');
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1);
    let output: string[] = [];

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '  help            - Show this help message',
          '  neofetch        - System information',
          '  whoami          - Display current user',
          '  uname -a        - Print system information',
          '  cat <file>      - Display file contents',
          '  cat /etc/os-release - OS release info',
          '  date            - Display current date/time',
          '  ls              - List directory contents',
          '  pwd             - Print working directory',
          '  uptime          - System uptime',
          '  df -h           - Disk usage',
          '  ifconfig        - Network interfaces',
          '  ps aux          - Running processes',
          '  htop            - Interactive process viewer',
          '  history         - Command history',
          '  career          - Career timeline',
          '  skills          - List skills',
          '  awards          - Show awards',
          '  philosophy      - Design philosophy',
          '  contact         - Contact information',
          '  clear           - Clear terminal',
          '  exit            - Close terminal',
        ];
        break;
      case 'neofetch':
        output = kyleData.neofetch.ascii.split('\n');
        break;
      case 'whoami':
        output = [`${kyleData.system.username} — ${kyleData.personal.title}`];
        break;
      case 'date':
        output = [new Date().toString()];
        break;
      case 'ls':
        const target = args[0] || '~';
        if (target === '~' || target === '/home/kyle' || target === '.') {
          output = ['Documents  Downloads  Music  Pictures  Projects  Desktop  README.md  .bashrc'];
        } else if (target === 'Documents') {
          output = ['Resume.pdf  Cover_Letter.txt  Philosophy.md'];
        } else if (target === 'Projects') {
          output = ['Reveal_Platform  IIDA_Website  BrumbleyOS'];
        } else {
          output = [`ls: cannot access '${target}': No such file or directory`];
        }
        break;
      case 'cat':
        if (!args[0]) {
          output = ['Usage: cat <filename>'];
        } else if (args[0] === '/etc/os-release') {
          output = [
            'NAME="BrumbleyOS"',
            'VERSION="24.04 LTS (Noble Numbat)"',
            'ID=brumbleyos',
            'ID_LIKE=ubuntu',
            'PRETTY_NAME="BrumbleyOS 24.04 LTS"',
            'VERSION_CODENAME=noble',
            'HOME_URL="https://www.kylebrumbley.com"',
            'SUPPORT_URL="https://www.linkedin.com/in/kylebrumbley"',
            'BUG_REPORT_URL="https://www.instagram.com/kbrumbley"',
            'PRIVACY_POLICY_URL="https://www.kylebrumbley.com"',
          ];
        } else if (args[0] === '/proc/cpuinfo') {
          output = [
            'processor       : 0-4',
            'model name      : End-to-End Creative CPU @ 5 Cores',
            'flags           : product_strategy ux_design healthcare_ai workflow_design commercial_thinking',
            'cache size      : 23+ years experience',
            'bogomips        : 9200.00 (92% Product Strategy)',
            '',
            'processor       : 0',
            'model name      : Product Strategy Core',
            'cpu MHz         : 920.000',
            '',
            'processor       : 1',
            'model name      : UX/Systems Design Core',
            'cpu MHz         : 880.000',
            '',
            'processor       : 2',
            'model name      : Healthcare AI Core',
            'cpu MHz         : 850.000',
            '',
            'processor       : 3',
            'model name      : Workflow Design Core',
            'cpu MHz         : 900.000',
            '',
            'processor       : 4',
            'model name      : Commercial Thinking Core',
            'cpu MHz         : 820.000',
          ];
        } else if (args[0] === 'README.md') {
          output = kyleData.fileSystem.home.children['README.md'].content.split('\n');
        } else if (args[0] === '.bashrc') {
          output = kyleData.fileSystem.home.children['.bashrc'].content.split('\n');
        } else if (args[0] === 'Philosophy.md' || args[0] === 'Documents/Philosophy.md') {
          output = kyleData.fileSystem.home.children.Documents.children['Philosophy.md'].content.split('\n');
        } else if (args[0] === 'Resume.pdf' || args[0] === 'Documents/Resume.pdf') {
          output = kyleData.fileSystem.home.children.Documents.children['Resume.pdf'].content.split('\n');
        } else if (args[0] === 'Cover_Letter.txt' || args[0] === 'Documents/Cover_Letter.txt') {
          output = kyleData.fileSystem.home.children.Documents.children['Cover_Letter.txt'].content.split('\n');
        } else {
          output = [`cat: ${args[0]}: No such file or directory`];
        }
        break;
      case 'pwd':
        output = ['/home/kyle'];
        break;
      case 'uname':
        output = [`BrumbleyOS ${kyleData.system.version} ${kyleData.system.codename} ${kyleData.system.kernel} ${kyleData.system.architecture}`];
        break;
      case 'uptime':
        output = [` ${kyleData.system.uptime} of professional experience`];
        break;
      case 'df':
        output = ['Filesystem      Size  Used  Avail  Use%  Mounted on'];
        kyleData.diskUsage.forEach(d => {
          output.push(`${d.filesystem.padEnd(14)} ${d.size.padEnd(6)} ${d.used.padEnd(6)} ${d.avail.padEnd(6)} ${d.mount}`);
        });
        break;
      case 'history':
        output = commandHistory.map((c, i) => `  ${i + 1}  ${c}`);
        break;
      case 'career':
        kyleData.career.forEach(c => {
          output.push(`${c.period}  ${c.icon} ${c.role} @ ${c.company}`);
          output.push(`           ${c.description}`);
        });
        break;
      case 'skills':
        output = ['Core Skills:'];
        kyleData.skills.core.forEach(s => {
          output.push(`  [${'█'.repeat(Math.floor(s.usage / 5))}${' '.repeat(20 - Math.floor(s.usage / 5))}] ${s.usage}% ${s.name}`);
        });
        output.push('', 'Secondary Skills:', `  ${kyleData.skills.secondary.join(', ')}`);
        break;
      case 'awards':
        kyleData.awards.forEach(a => {
          output.push(`🏆 ${a.year} — ${a.title}`, `   ${a.description}`);
        });
        break;
      case 'philosophy':
        output = [kyleData.philosophy.tagline, ''];
        kyleData.philosophy.beliefs.forEach(b => output.push(b));
        break;
      case 'contact':
        output = [
          `Email: ${kyleData.personal.email}`,
          `Website: ${kyleData.personal.website}`,
          `Location: ${kyleData.personal.location}`,
        ];
        kyleData.network.forEach(n => output.push(`${n.name}: ${n.address}`));
        break;
      case 'ifconfig':
      case 'ip':
        output = [
          'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
          '        inet 10.0.0.1  netmask 255.255.255.0  broadcast 10.0.0.255',
          '        ether aa:bb:cc:dd:ee:ff  txqueuelen 1000',
          '        device: LinkedIn (Professional)',
          '        status: CONNECTED',
          '        link: https://www.linkedin.com/in/kylebrumbley',
          '',
          'wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
          '        inet 10.0.1.1  netmask 255.255.255.0  broadcast 10.0.1.255',
          '        ether 11:22:33:44:55:66  txqueuelen 1000',
          '        device: kylebrumbley.com (Portfolio)',
          '        status: CONNECTED',
          '        link: https://www.kylebrumbley.com',
          '',
          'wlan1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
          '        inet 10.0.2.1  netmask 255.255.255.0  broadcast 10.0.2.255',
          '        ether 22:33:44:55:66:77  txqueuelen 1000',
          '        device: Designed.org (Mentorship)',
          '        status: CONNECTED',
          '        link: https://designed.org/mentors/kylebrumbley',
        ];
        break;
      case 'ps':
        output = [
          'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
          'kyle      1001 92.0 18.4 823456 234567 ?       Sl   2004  2345: product-strategy',
          'kyle      1002 88.0 17.6 756432 198765 ?       Sl   2014  2109: ux-systems-design',
          'kyle      1003 85.0 17.0 712345 187654 ?       Sl   2022  1876: healthcare-ai',
          'kyle      1004 90.0 18.0 789012 210987 ?       Sl   2020  1987: workflow-design',
          'kyle      1005 82.0 16.4 698765 176543 ?       Sl   2014  1654: commercial-thinking',
          'kyle      1006 95.0 19.0 856789 245678 ?       Sl   2014  2567: creative-direction',
          'kyle      1007 70.0 14.0 543210 123456 ?       Sl   2020   987: design-mentorship',
          'kyle      1008 75.0 15.0 612345 145678 ?       Sl   2004  1345: brand-identity',
        ];
        break;
      case 'htop':
        output = [
          '  ┌─────────────────────────────────────────────────────────────────┐',
          '  │  BrumbleyOS System Monitor - kyle@brumbleyos                   │',
          '  │                                                                 │',
          '  │  CPU[||||||||||||||||||||||||||86.4%]  Mem[|||||||||||||||63.2%]  │',
          '  │  Swp[                            0.0%]                          │',
          '  │                                                                 │',
          '  │  PID   USER  CPU%  MEM%  COMMAND                               │',
          '  │  1001  kyle  92.0  18.4  product-strategy                      │',
          '  │  1006  kyle  95.0  19.0  creative-direction                    │',
          '  │  1004  kyle  90.0  18.0  workflow-design                       │',
          '  │  1002  kyle  88.0  17.6  ux-systems-design                     │',
          '  │  1003  kyle  85.0  17.0  healthcare-ai                         │',
          '  │  1005  kyle  82.0  16.4  commercial-thinking                   │',
          '  │  1008  kyle  75.0  15.0  brand-identity                        │',
          '  │  1007  kyle  70.0  14.0  design-mentorship                     │',
          '  │                                                                 │',
          '  │  Uptime: 23+ years | Tasks: 8 | Load: 86.4%                    │',
          '  └─────────────────────────────────────────────────────────────────┘',
        ];
        break;
      case 'clear':
        setLines([]);
        return;
      case 'exit':
        const wins = useUbuntuStore.getState().windows;
        const termWin = wins.find(w => w.appId === 'terminal');
        if (termWin) useUbuntuStore.getState().closeWindow(termWin.id);
        return;
      case '':
        break;
      default:
        output = [`${command}: command not found. Type "help" for available commands.`];
    }

    setLines(prev => [
      ...prev,
      `kyle@brumbleyos:~$ ${trimmed}`,
      ...output,
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
    }
    processCommand(currentInput);
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col font-mono text-sm"
      style={{ background: '#300A24', color: '#ffffff', fontFamily: "'Ubuntu Mono', monospace" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 ubuntu-text-select"
        style={{ lineHeight: '1.4' }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line}
          </div>
        ))}

        {/* Current input line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-[#E95420]">kyle@brumbleyos</span>
          <span className="text-white">:</span>
          <span className="text-[#5577ff]">~</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-white"
            style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: '14px', caretColor: '#E95420' }}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
