import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function LovePage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="Love list"
        title="想一起完成的小事"
        description="不是任务清单，是值得慢慢点亮的共同期待。"
      />

      <Card className="progress-card progress-card--love">
        <div>
          <p className="card-label">共同期待</p>
          <strong>从一件小事开始</strong>
        </div>
        <span className="large-symbol" aria-hidden="true">♡</span>
      </Card>

      <div className="section-heading">
        <h2>Love 清单</h2>
        <span>基础结构预览</span>
      </div>

      <Card className="list-placeholder">
        <span className="list-marker list-marker--love">01</span>
        <div>
          <h3>一起完成一件期待很久的小事</h3>
          <p>完成状态与编辑功能将在后续阶段接入。</p>
        </div>
        <span className="soft-tag soft-tag--love">期待</span>
      </Card>
      <Card className="empty-card" tone="soft">
        <div className="empty-illustration empty-illustration--love" aria-hidden="true">✦</div>
        <h3>以后会慢慢装满</h3>
        <p>每一项都应该有属于你们的意义。</p>
      </Card>
    </section>
  );
}
