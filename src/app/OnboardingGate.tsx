import { PasscodePage } from "../pages/PasscodePage";
import { ProfileSetupPage } from "../pages/ProfileSetupPage";
import { useAppStore } from "../store/appStore";
import { AppShell } from "./AppShell";

export function OnboardingGate() {
  const hasUnlocked = useAppStore((state) => state.appStatus.hasUnlocked);
  const hasCompletedProfileSetup = useAppStore(
    (state) => state.appStatus.hasCompletedProfileSetup,
  );
  const selectedPersonId = useAppStore((state) => state.appStatus.selectedPersonId);

  if (!hasUnlocked) {
    return <PasscodePage />;
  }

  if (!hasCompletedProfileSetup || !selectedPersonId) {
    return <ProfileSetupPage />;
  }

  return <AppShell />;
}
