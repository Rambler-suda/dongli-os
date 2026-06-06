import { useEffect, useState } from "react";
import { PageHeader } from "../ui/PageHeader";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Toast } from "../ui/Toast";
import {
  BucketItemEditor,
  type BucketEditorValue,
} from "./BucketItemEditor";
import { BucketItemCard } from "./BucketItemCard";
import { EmptyState } from "./EmptyState";
import { ProgressCard } from "./ProgressCard";

export type BucketListItem = BucketEditorValue & {
  id: string;
  isCompleted: boolean;
};

type BucketListPageProps = {
  tone: "travel" | "love";
  eyebrow: string;
  title: string;
  description: string;
  progressLabel: string;
  completedCountLabel: string;
  itemLabel: string;
  defaultEmoji: string;
  items: BucketListItem[];
  pendingLabel: string;
  completedLabel: string;
  completeActionLabel: string;
  undoActionLabel: string;
  addButtonLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  deleteMessage: string;
  feedback: {
    added: string;
    updated: string;
    deleted: string;
    completed: string;
    undone: string;
  };
  onAdd: (value: BucketEditorValue) => void;
  onUpdate: (id: string, value: BucketEditorValue) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
};

export function BucketListPage({
  tone,
  eyebrow,
  title,
  description,
  progressLabel,
  completedCountLabel,
  itemLabel,
  defaultEmoji,
  items,
  pendingLabel,
  completedLabel,
  completeActionLabel,
  undoActionLabel,
  addButtonLabel,
  emptyTitle,
  emptyDescription,
  deleteMessage,
  feedback,
  onAdd,
  onUpdate,
  onDelete,
  onComplete,
  onUndo,
}: BucketListPageProps) {
  const [editorMode, setEditorMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<BucketListItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const completedCount = items.filter((item) => item.isCompleted).length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openAddEditor() {
    setEditingItem(null);
    setEditorMode("add");
  }

  function openEditEditor(item: BucketListItem) {
    setEditingItem(item);
    setEditorMode("edit");
  }

  function closeEditor() {
    setEditorMode(null);
    setEditingItem(null);
  }

  function handleSave(value: BucketEditorValue) {
    if (editorMode === "edit" && editingItem) {
      onUpdate(editingItem.id, value);
      setToast(feedback.updated);
    } else {
      onAdd(value);
      setToast(feedback.added);
    }
    closeEditor();
  }

  function handleToggle(item: BucketListItem) {
    if (item.isCompleted) {
      onUndo(item.id);
      setToast(feedback.undone);
    } else {
      onComplete(item.id);
      setToast(feedback.completed);
    }
  }

  function handleDelete() {
    if (!deletingItem) return;
    onDelete(deletingItem.id);
    setDeletingItem(null);
    setToast(feedback.deleted);
  }

  return (
    <section className="page bucket-page" data-tone={tone}>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <ProgressCard
        label={progressLabel}
        completedLabel={completedCountLabel}
        completed={completedCount}
        total={items.length}
        tone={tone}
      />

      <div className="bucket-list-heading">
        <div>
          <h2>{title}</h2>
          <span>{items.length} 个小期待</span>
        </div>
        <button className="add-item-button" type="button" onClick={openAddEditor}>
          <span aria-hidden="true">＋</span>
          {addButtonLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          tone={tone}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={addButtonLabel}
          onAction={openAddEditor}
        />
      ) : (
        <div className="bucket-list">
          {items.map((item) => (
            <BucketItemCard
              key={item.id}
              {...item}
              tone={tone}
              pendingLabel={pendingLabel}
              completedLabel={completedLabel}
              completeActionLabel={completeActionLabel}
              undoActionLabel={undoActionLabel}
              onToggle={() => handleToggle(item)}
              onEdit={() => openEditEditor(item)}
              onDelete={() => setDeletingItem(item)}
            />
          ))}
        </div>
      )}

      <BucketItemEditor
        open={editorMode !== null}
        mode={editorMode ?? "add"}
        itemLabel={itemLabel}
        defaultEmoji={defaultEmoji}
        initialValue={editingItem ?? undefined}
        onCancel={closeEditor}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deletingItem !== null}
        title={`删除${itemLabel}`}
        message={deleteMessage}
        onCancel={() => setDeletingItem(null)}
        onConfirm={handleDelete}
      />
      <Toast message={toast} />
    </section>
  );
}
