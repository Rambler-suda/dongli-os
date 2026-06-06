import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function HomePage() {
  return (
    <section className="page page--home">
      <PageHeader
        eyebrow="DL universe"
        title="今天也一起，好好生活"
        description="一个安静的小面板，放下属于你们的日常。"
      />

      <Card className="hero-card" tone="pear">
        <div>
          <span className="status-pill">我们的时间</span>
          <p className="hero-kicker">在一起的每一天</p>
          <strong>正在认真累积中</strong>
        </div>
        <div className="pear-orbit" aria-hidden="true">
          <span />
          <span />
        </div>
      </Card>

      <div className="section-heading">
        <h2>今日面板</h2>
        <span>轻轻看一眼</span>
      </div>

      <div className="card-grid">
        <Card className="compact-card">
          <span className="card-symbol card-symbol--blue" aria-hidden="true">☀</span>
          <div>
            <p className="card-label">今日提醒</p>
            <h3>照顾好今天</h3>
          </div>
        </Card>
        <Card className="compact-card">
          <span className="card-symbol card-symbol--pink" aria-hidden="true">✦</span>
          <div>
            <p className="card-label">今日一句</p>
            <h3>慢慢积攒小幸福</h3>
          </div>
        </Card>
      </div>

      <Card className="placeholder-card">
        <div className="placeholder-icon" aria-hidden="true">⌂</div>
        <div>
          <p className="card-label">接下来</p>
          <h3>生日与纪念日提醒</h3>
          <p>日期逻辑将在后续阶段接入。</p>
        </div>
      </Card>
    </section>
  );
}
