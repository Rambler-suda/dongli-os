import { PasscodePage } from "../pages/PasscodePage";
import { ProfileSetupPage } from "../pages/ProfileSetupPage";
import { useAppStore } from "../store/appStore";
import { AppShell } from "./AppShell";

export function OnboardingGate() {
  const hasUnlocked = useAppStore((state) => state.appStatus.hasUnlocked);
  const hasCompletedProfileSetup = useAppStore(
    (state) => state.appStatus.hasCompletedProfileSetup,
  );

  if (!hasUnlocked) {
    return <PasscodePage />;
  }

  if (!hasCompletedProfileSetup) {
    return <ProfileSetupPage />;
  }

  return <AppShell />;
}
