import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function TravelPage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="Travel list"
        title="想一起去的地方"
        description="先把目的地放在这里，以后一个个点亮。"
      />

      <Card className="progress-card" tone="pear">
        <div>
          <p className="card-label">旅行进度</p>
          <strong>等待第一次出发</strong>
        </div>
        <div className="progress-ring" aria-label="当前为占位进度">
          <span>0</span>
        </div>
      </Card>

      <div className="section-heading">
        <h2>旅行清单</h2>
        <span>基础结构预览</span>
      </div>

      <Card className="list-placeholder">
        <span className="list-marker">01</span>
        <div>
          <h3>下一站，留给你们决定</h3>
          <p>新增、编辑与点亮功能将在后续阶段接入。</p>
        </div>
        <span className="soft-tag">想去</span>
      </Card>
      <Card className="empty-card" tone="soft">
        <div className="empty-illustration" aria-hidden="true">＋</div>
        <h3>这里会装下更多目的地</h3>
        <p>现在先保留一片舒服的空白。</p>
      </Card>
    </section>
  );
}
