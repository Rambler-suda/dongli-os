import qiqiRolePortrait from "../assets/illustrations/role-qiqi.png";
import tingtingRolePortrait from "../assets/illustrations/role-tingting.png";
import { useAppStore } from "../store/appStore";
import type { PersonId } from "../store/types";

type RoleOption = {
  id: PersonId;
  name: string;
  accountLabel: string;
  description: string;
  avatarSrc: string;
  avatarTone: "pear" | "cream";
};

const roleOptions: RoleOption[] = [
  {
    id: "dongdong",
    name: "琦琦",
    accountLabel: "琦琦账户",
    description: "选择后，这台设备会记住你是琦琦。",
    avatarSrc: qiqiRolePortrait,
    avatarTone: "pear",
  },
  {
    id: "lili",
    name: "婷婷",
    accountLabel: "婷婷账户",
    description: "选择后，这台设备会记住你是婷婷。",
    avatarSrc: tingtingRolePortrait,
    avatarTone: "cream",
  },
];

type RoleCardProps = {
  option: RoleOption;
  onSelect: (id: PersonId) => void;
};

function RoleCard({
  option: { id, name, accountLabel, description, avatarSrc, avatarTone },
  onSelect,
}: RoleCardProps) {
  return (
    <button
      className="profile-setup-card role-select-card"
      type="button"
      onClick={() => onSelect(id)}
    >
      <div
        className="profile-avatar role-select-card__avatar"
        data-tone={avatarTone}
        aria-hidden="true"
      >
        <img className="role-select-card__image" src={avatarSrc} alt="" draggable="false" />
      </div>
      <div className="profile-field role-select-card__body">
        <span className="role-select-card__eyebrow">{accountLabel}</span>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </button>
  );
}

export function ProfileSetupPage() {
  const completeRoleSelection = useAppStore((state) => state.completeRoleSelection);

  return (
    <main className="onboarding-shell">
      <section className="onboarding-content">
        <header className="onboarding-heading onboarding-heading--left">
          <p className="eyebrow">Welcome home</p>
          <h1>选择你的角色</h1>
          <p>先告诉冻梨 OS 这台设备属于谁</p>
        </header>

        <div className="profile-setup-form">
          {roleOptions.map((option) => (
            <RoleCard key={option.id} option={option} onSelect={completeRoleSelection} />
          ))}

          <div className="setup-note">
            <span aria-hidden="true">✦</span>
            <p>琦琦和婷婷看到的是同一份冻梨 OS 数据，一方修改后另一方也能看到。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
