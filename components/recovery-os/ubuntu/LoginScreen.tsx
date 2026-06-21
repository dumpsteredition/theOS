'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import { sounds } from '@/lib/sounds';
import { useClock } from '@/hooks/use-clock';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const currentTime = useClock();
  const passwordRef = useRef<HTMLInputElement>(null);
  const isLoggingIn = useUbuntuStore(s => s.isLoggingIn);
  const login = useUbuntuStore(s => s.login);

  useEffect(() => {
    sounds.startup();
  }, []);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      passwordRef.current?.focus();
    }, 500);
    return () => clearTimeout(focusTimer);
  }, []);

  const handleLogin = () => {
    if (password.length > 0) {
      login();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password.length > 0) {
      handleLogin();
    }
  };

  const handleScreenClick = useCallback((e: React.MouseEvent) => {
    // Don't count clicks on the password input or arrow button
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button[data-login-btn]')) return;

    setClickCount(prev => {
      const next = prev + 1;
      // Show hint on click 3, then every 5 clicks after that (8, 13, 18...)
      if (next === 3 || (next > 3 && (next - 3) % 5 === 0)) {
        setShowHint(true);
      }
      return next;
    });
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Once they start typing, dismiss the hint
    if (e.target.value.length > 0) {
      setShowHint(false);
    }
  };

  const handleDismissHint = () => {
    setShowHint(false);
    passwordRef.current?.focus();
  };

  const formatDate = () => {
    if (!currentTime) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[currentTime.getDay()]} ${currentTime.getDate()} ${months[currentTime.getMonth()]}`;
  };

  const formatTime = () => {
    if (!currentTime) return '';
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div
      className={`ubuntu-login-bg w-screen h-screen flex flex-col items-center justify-center transition-opacity duration-1500 ${isLoggingIn ? 'opacity-0' : 'opacity-100'}`}
      style={{ transitionDuration: '1500ms' }}
      onClick={handleScreenClick}
    >
      {/* Date/Time at top center */}
      <div className="absolute top-16 text-center text-white">
        <div className="text-5xl font-light tracking-wide">{formatTime()}</div>
        <div className="text-lg font-light mt-1 opacity-80">{formatDate()}</div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-medium"
          style={{
            background: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)',
          }}
        >
          KB
        </div>

        {/* Name */}
        <div className="text-white text-2xl font-light mt-4">Kyle Brumbley</div>

        {/* Password input */}
        <div className="mt-6 relative flex items-center">
          <input
            ref={passwordRef}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            placeholder="Password"
            className="bg-black/40 text-white placeholder-gray-400 rounded-full px-5 py-2.5 w-64 text-sm outline-none border border-white/10 focus:border-white/30 transition-colors"
            style={{ fontFamily: "'Ubuntu', sans-serif" }}
          />
          <button
            data-login-btn
            onClick={handleLogin}
            className="absolute right-2 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            disabled={password.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Password hint popup */}
      {showHint && (
        <div
          className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative rounded-xl px-5 py-4 max-w-xs text-center"
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(233,84,32,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Orange accent line at top */}
            <div
              className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #E95420, transparent)' }}
            />
            <div style={{ color: '#E95420', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              💡 Password Hint
            </div>
            <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500, lineHeight: 1.4 }}>
              Just literally type anything!!
            </div>
            <button
              onClick={handleDismissHint}
              className="mt-3 text-xs text-white/50 hover:text-white/80 transition-colors"
              style={{ fontFamily: "'Ubuntu', sans-serif" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Bottom icons */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        {/* Accessibility icon */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="4" r="2"/>
            <path d="M4.5 9H19.5M12 9V15M8 22L12 15L16 22"/>
          </svg>
        </button>
        {/* Power icon */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v10M18.36 6.64A9 9 0 1 1 5.64 6.64"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
