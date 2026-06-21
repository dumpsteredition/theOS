'use client';
import { useUbuntuStore } from '@/components/recovery-os/ubuntu-store';
import Window from './Window';
import Terminal from '@/components/recovery-os/apps/Terminal';
import Files from '@/components/recovery-os/apps/Files';
import Settings from '@/components/recovery-os/apps/Settings';
import TextEditor from '@/components/recovery-os/apps/TextEditor';
import SystemMonitor from '@/components/recovery-os/apps/SystemMonitor';
import Calculator from '@/components/recovery-os/apps/Calculator';
import Firefox from '@/components/recovery-os/apps/Firefox';
import Software from '@/components/recovery-os/apps/Software';

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  'terminal': Terminal,
  'files': Files,
  'settings': Settings,
  'text-editor': TextEditor,
  'system-monitor': SystemMonitor,
  'calculator': Calculator,
  'firefox': Firefox,
  'software': Software,
};

export default function WindowManager() {
  const windows = useUbuntuStore(s => s.windows);

  return (
    <>
      {windows.map((win) => {
        const AppComponent = APP_COMPONENTS[win.appId];
        return (
          <Window key={win.id} window={win}>
            {AppComponent ? <AppComponent /> : (
              <div className="flex items-center justify-center h-full text-white/50">
                App not found: {win.appId}
              </div>
            )}
          </Window>
        );
      })}
    </>
  );
}
