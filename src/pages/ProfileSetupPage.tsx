import { useState, type FormEvent } from "react";
import { useAppStore } from "../store/appStore";
import type { PersonId } from "../store/types";

type ProfileFieldProps = {
  id: PersonId;
  label: string;
  avatarLabel: string;
  avatarTone: "pear" | "cream";
  value: string;
  onChange: (value: string) => void;
};

function ProfileField({
  id,
  label,
  avatarLabel,
  avatarTone,
  value,
  onChange,
}: ProfileFieldProps) {
  return (
    <div className="profile-setup-card">
      <div className="profile-avatar" data-tone={avatarTone} aria-hidden="true">
        <span className="profile-avatar-leaf" />
        {avatarLabel}
      </div>
      <div className="profile-field">
        <label className="field-label" htmlFor={`${id}-name`}>
          {label}
        </label>
        <input
          id={`${id}-name`}
          className="text-input"
          type="text"
          maxLength={20}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span>默认像素 IP · 后续可以重新设置</span>
      </div>
    </div>
  );
}

export function ProfileSetupPage() {
  const profiles = useAppStore((state) => state.profiles);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const completeProfileSetup = useAppStore((state) => state.completeProfileSetup);
  const [dongdongName, setDongdongName] = useState(profiles.dongdong.displayName);
  const [liliName, setLiliName] = useState(profiles.lili.displayName);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateProfile("dongdong", {
      displayName: dongdongName.trim() || profiles.dongdong.displayName,
    });
    updateProfile("lili", {
      displayName: liliName.trim() || profiles.lili.displayName,
    });
    completeProfileSetup();
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-content">
        <header className="onboarding-heading onboarding-heading--left">
          <p className="eyebrow">Welcome home</p>
          <h1>设置我们的形象</h1>
          <p>先让冻梨 OS 认识你们</p>
        </header>

        <form className="profile-setup-form" onSubmit={handleSubmit}>
          <ProfileField
            id="dongdong"
            label="冻冻昵称"
            avatarLabel="冻"
            avatarTone="pear"
            value={dongdongName}
            onChange={setDongdongName}
          />
          <ProfileField
            id="lili"
            label="梨梨昵称"
            avatarLabel="梨"
            avatarTone="cream"
            value={liliName}
            onChange={setLiliName}
          />

          <div className="setup-note">
            <span aria-hidden="true">✦</span>
            <p>先使用默认像素形象，头像上传会在后续加入。</p>
          </div>

          <button className="primary-button" type="submit">
            完成，进入首页
          </button>
        </form>
      </section>
    </main>
  );
}
