import { BucketListPage } from "../components/list/BucketListPage";
import { useAppStore } from "../store/appStore";

export function LovePage() {
  const loveItems = useAppStore((state) => state.loveItems);
  const addLoveItem = useAppStore((state) => state.addLoveItem);
  const updateLoveItem = useAppStore((state) => state.updateLoveItem);
  const deleteLoveItem = useAppStore((state) => state.deleteLoveItem);
  const markLoveDone = useAppStore((state) => state.markLoveDone);
  const undoLoveDone = useAppStore((state) => state.undoLoveDone);

  return (
    <BucketListPage
      tone="love"
      eyebrow="Love list"
      title="Love List"
      description="想一起完成的事，一件一件慢慢来。"
      progressLabel="共同期待"
      completedCountLabel="已完成"
      itemLabel="事项"
      defaultEmoji="✨"
      items={loveItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        emoji: item.emoji,
        isCompleted: item.status === "done",
      }))}
      pendingLabel="想做"
      completedLabel="已完成"
      completeActionLabel="完成"
      undoActionLabel="取消完成"
      addButtonLabel="添加事项"
      emptyTitle="还没有想一起做的小事"
      emptyDescription="要不要先加一个？"
      deleteMessage="确定要删除这件想一起完成的小事吗？"
      feedback={{
        added: "已加入 Love List",
        updated: "已更新",
        deleted: "已删除",
        completed: "这件事，已经变成我们的回忆啦。",
        undone: "已恢复为想做。",
      }}
      onAdd={addLoveItem}
      onUpdate={updateLoveItem}
      onDelete={deleteLoveItem}
      onComplete={markLoveDone}
      onUndo={undoLoveDone}
    />
  );
}
