import { useEffect, useState } from "react";
import { PersonChipCard } from "../components/chips/PersonChipCard";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { PageHeader } from "../components/ui/PageHeader";
import { Toast } from "../components/ui/Toast";
import { useAppStore } from "../store/appStore";
import type { PersonId } from "../store/types";

export function ChipsPage() {
  const profiles = useAppStore((state) => state.profiles);
  const chips = useAppStore((state) => state.chips);
  const addHands = useAppStore((state) => state.addHands);
  const removeOneHand = useAppStore((state) => state.removeOneHand);
  const resetHands = useAppStore((state) => state.resetHands);
  const [resettingPerson, setResettingPerson] = useState<PersonId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleAdd(personId: PersonId, amount: number) {
    addHands(personId, amount);
    setToast(amount === 5 ? "这次赢了 5 个小手，不许赖账。" : "已记上 1 个小手。");
  }

  function handleRemove(personId: PersonId) {
    const key = personId === "dongdong" ? "dongdongHands" : "liliHands";
    if (chips[key] <= 0) return;
    removeOneHand(personId);
    setToast("已兑现 1 个小手。");
  }

  function handleReset() {
    if (!resettingPerson) return;
    resetHands(resettingPerson);
    setResettingPerson(null);
    setToast("这次先放过你。");
  }

  return (
    <section className="page chips-page">
      <PageHeader
        eyebrow="Little bets"
        title="筹码"
        description="愿赌服输，但只能轻轻来。"
      />

      <div className="chips-card-list">
        <PersonChipCard
          personId="dongdong"
          profile={profiles.dongdong}
          hands={chips.dongdongHands}
          onAdd={(amount) => handleAdd("dongdong", amount)}
          onRemove={() => handleRemove("dongdong")}
          onReset={() => setResettingPerson("dongdong")}
        />
        <PersonChipCard
          personId="lili"
          profile={profiles.lili}
          hands={chips.liliHands}
          onAdd={(amount) => handleAdd("lili", amount)}
          onRemove={() => handleRemove("lili")}
          onReset={() => setResettingPerson("lili")}
        />
      </div>

      <Card className="chip-note-card" tone="soft">
        <div className="chip-note-card__icon" aria-hidden="true">✦</div>
        <div>
          <p className="card-label">小愿望规则</p>
          <h3>每 10 个小手，自动换算成 1 个小愿望</h3>
          <p>小愿望只是温柔的约定，怎么兑现由你们慢慢决定。</p>
        </div>
      </Card>

      <ConfirmDialog
        open={resettingPerson !== null}
        title="清零小手余额"
        message="确定要把小手余额清零吗？"
        confirmLabel="确认清零"
        onCancel={() => setResettingPerson(null)}
        onConfirm={handleReset}
      />
      <Toast message={toast} />
    </section>
  );
}
