import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function ChipsPage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="Little bets"
        title="愿赌服输，轻轻来"
        description="记录只属于两个人的小赌局与小愿望。"
      />

      <Card className="chips-summary" tone="pear">
        <div>
          <p className="card-label">当前小愿望</p>
          <strong>筹码规则准备中</strong>
        </div>
        <span className="large-symbol large-symbol--star" aria-hidden="true">✦</span>
      </Card>

      <div className="person-grid">
        <Card className="person-card">
          <div className="avatar-placeholder">冻</div>
          <p className="card-label">冻冻的小手</p>
          <strong>0</strong>
          <span className="soft-tag">等待开局</span>
        </Card>
        <Card className="person-card">
          <div className="avatar-placeholder avatar-placeholder--light">梨</div>
          <p className="card-label">梨梨的小手</p>
          <strong>0</strong>
          <span className="soft-tag">等待开局</span>
        </Card>
      </div>

      <Card className="placeholder-card">
        <div className="placeholder-icon" aria-hidden="true">✋</div>
        <div>
          <p className="card-label">筹码规则</p>
          <h3>小手会兑换成小愿望</h3>
          <p>余额操作与换算逻辑将在后续阶段接入。</p>
        </div>
      </Card>
    </section>
  );
}
