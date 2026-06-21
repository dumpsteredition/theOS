import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";

import { RecoveryOsExperience } from "@/components/recovery-os/recovery-os-experience";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-recovery-ubuntu",
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-recovery-ubuntu-mono",
});

export const metadata: Metadata = {
  title: "Recovery Environment",
  description: "BrumbleyOS emergency recovery environment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function YouReallyBrokeItPage() {
  return <RecoveryOsExperience className={`${ubuntu.variable} ${ubuntuMono.variable}`} />;
}
