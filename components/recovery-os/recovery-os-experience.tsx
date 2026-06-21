"use client";

import { useUbuntuStore } from "@/components/recovery-os/ubuntu-store";
import Desktop from "@/components/recovery-os/ubuntu/Desktop";
import LoginScreen from "@/components/recovery-os/ubuntu/LoginScreen";
import { cn } from "@/lib/utils";

type RecoveryOsExperienceProps = {
  className?: string;
};

export function RecoveryOsExperience({ className }: RecoveryOsExperienceProps) {
  const isLoggedIn = useUbuntuStore((state) => state.isLoggedIn);

  return (
    <main
      className={cn(
        "recovery-os fixed inset-0 z-[300] h-[100dvh] w-screen overflow-hidden bg-black text-white",
        className,
      )}
    >
      {isLoggedIn ? <Desktop /> : <LoginScreen />}
    </main>
  );
}
