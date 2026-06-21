import { FeedbackIntegrityProvider } from "@/components/feedback/feedback-integrity";
import { AmbientOrbs } from "@/components/interactions/ambient-orbs";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { CommandPaletteProvider } from "@/components/ui/command-palette";
import { ToastProvider } from "@/components/ui/toast";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <FeedbackIntegrityProvider>
        <CommandPaletteProvider>
          <div className="relative isolate min-h-screen overflow-hidden lg:overflow-visible">
            <AmbientOrbs />
            <WorkspaceShell>{children}</WorkspaceShell>
          </div>
        </CommandPaletteProvider>
      </FeedbackIntegrityProvider>
    </ToastProvider>
  );
}
