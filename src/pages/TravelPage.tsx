import { BucketListPage } from "../components/list/BucketListPage";
import { useAppStore } from "../store/appStore";

export function TravelPage() {
  const travelItems = useAppStore((state) => state.travelItems);
  const addTravelItem = useAppStore((state) => state.addTravelItem);
  const updateTravelItem = useAppStore((state) => state.updateTravelItem);
  const deleteTravelItem = useAppStore((state) => state.deleteTravelItem);
  const markTravelVisited = useAppStore((state) => state.markTravelVisited);
  const undoTravelVisited = useAppStore((state) => state.undoTravelVisited);

  return (
    <BucketListPage
      tone="travel"
      eyebrow="Travel list"
      title="旅游 LIST"
      description="想去的地方，慢慢变成去过的地方。"
      progressLabel="旅行进度"
      completedCountLabel="已点亮"
      itemLabel="地点"
      defaultEmoji="📍"
      items={travelItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        emoji: item.emoji,
        isCompleted: item.status === "visited",
      }))}
      pendingLabel="想去"
      completedLabel="已点亮"
      completeActionLabel="点亮"
      undoActionLabel="取消点亮"
      addButtonLabel="添加地点"
      emptyTitle="这里还空着"
      emptyDescription="等你们一起去填满。"
      deleteMessage="确定要删除这个想去的地方吗？"
      feedback={{
        added: "已加入旅游 LIST",
        updated: "已更新",
        deleted: "已删除",
        completed: "这个地方已经被点亮啦。",
        undone: "已恢复为想去。",
      }}
      onAdd={addTravelItem}
      onUpdate={updateTravelItem}
      onDelete={deleteTravelItem}
      onComplete={markTravelVisited}
      onUndo={undoTravelVisited}
    />
  );
}
