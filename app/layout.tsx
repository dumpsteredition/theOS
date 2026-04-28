import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Manrope, Shadows_Into_Light } from "next/font/google";

import { FeedbackIntegrityProvider } from "@/components/feedback/feedback-integrity";
import { AmbientOrbs } from "@/components/interactions/ambient-orbs";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { CommandPaletteProvider } from "@/components/ui/command-palette";
import { ToastProvider } from "@/components/ui/toast";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  metadataBase: new URL("https://brumbleyos.local"),
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${dmSans.variable} ${jetBrainsMono.variable} ${shadowsIntoLight.variable} min-h-screen bg-[color:var(--background)] font-sans text-[color:var(--text-primary)] antialiased`}
      >
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
      </body>
    </html>
  );
}
