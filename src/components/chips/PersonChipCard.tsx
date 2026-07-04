import type { CoupleProfile, PersonId } from "../../store/types";
import { CharacterPortrait } from "../illustrations/CharacterPortrait";
import { PixelBadge } from "../pixel/PixelBadge";
import { Card } from "../ui/Card";
import { ChipAssetDisplay } from "./ChipAssetDisplay";

type PersonChipCardProps = {
  personId: PersonId;
  profile: CoupleProfile;
  hands: number;
  onAdd: (amount: number) => void;
  onRemove: () => void;
  onReset: () => void;
};

export function PersonChipCard({
  personId,
  profile,
  hands,
  onAdd,
  onRemove,
  onReset,
}: PersonChipCardProps) {
  return (
    <Card className="person-chip-card" data-person={personId}>
      <header className="person-chip-card__header">
        <CharacterPortrait
          character={personId}
          assetSrc={profile.realAvatarUrl}
          displayName={profile.displayName}
        />
        <div>
          <p className="card-label">{personId === "dongdong" ? "琦琦的筹码" : "婷婷的筹码"}</p>
          <h2>{profile.displayName}</h2>
          <PixelBadge
            tone={personId === "dongdong" ? "pear" : "love"}
            icon={personId === "dongdong" ? "leaf" : "star"}
            label={personId === "dongdong" ? "冷静记账员" : "灵动小赢家"}
          />
        </div>
        <span className="chip-balance">
          <strong>{hands}</strong>
          <small>小手</small>
        </span>
      </header>

      <div className="person-chip-card__assets">
        <div className="person-chip-card__assets-heading">
          <p>当前资产</p>
          <span>10 小手 = 1 小愿望</span>
        </div>
        <ChipAssetDisplay totalHands={hands} />
      </div>

      <div className="chip-actions" aria-label={`${profile.displayName}的小手操作`}>
        <div className="chip-actions__main">
          <button type="button" onClick={() => onAdd(1)}>
            <strong>+1</strong>
            <span>记一手</span>
          </button>
          <button type="button" onClick={() => onAdd(5)}>
            <strong>+5</strong>
            <span>赢五手</span>
          </button>
          <button type="button" onClick={onRemove} disabled={hands <= 0}>
            <strong>-1</strong>
            <span>兑现</span>
          </button>
        </div>
        <button className="chip-reset-button" type="button" onClick={onReset} disabled={hands <= 0}>
          <strong>清零余额</strong>
          <span>需要再次确认</span>
        </button>
      </div>
    </Card>
  );
}
