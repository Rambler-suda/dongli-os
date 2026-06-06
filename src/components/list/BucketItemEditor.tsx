import { useEffect, useState, type FormEvent } from "react";

export type BucketEditorValue = {
  title: string;
  description: string;
  emoji: string;
};

type BucketItemEditorProps = {
  open: boolean;
  mode: "add" | "edit";
  itemLabel: string;
  defaultEmoji: string;
  initialValue?: BucketEditorValue;
  onCancel: () => void;
  onSave: (value: BucketEditorValue) => void;
};

export function BucketItemEditor({
  open,
  mode,
  itemLabel,
  defaultEmoji,
  initialValue,
  onCancel,
  onSave,
}: BucketItemEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(defaultEmoji);
  const [showTitleError, setShowTitleError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(initialValue?.title ?? "");
    setDescription(initialValue?.description ?? "");
    setEmoji(initialValue?.emoji || defaultEmoji);
    setShowTitleError(false);
  }, [defaultEmoji, initialValue, open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setShowTitleError(true);
      return;
    }

    onSave({
      title: normalizedTitle,
      description: description.trim(),
      emoji: emoji.trim() || defaultEmoji,
    });
  }

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bucket-editor-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="bottom-sheet__handle" aria-hidden="true" />
        <header className="bottom-sheet__header">
          <div>
            <p className="eyebrow">{mode === "add" ? "Add new" : "Edit item"}</p>
            <h2 id="bucket-editor-title">
              {mode === "add" ? `添加${itemLabel}` : `编辑${itemLabel}`}
            </h2>
          </div>
          <button className="sheet-close-button" type="button" aria-label="关闭编辑弹窗" onClick={onCancel}>
            ×
          </button>
        </header>
        <form className="bucket-editor-form" onSubmit={handleSubmit}>
          <label className="editor-field editor-field--emoji">
            <span>Emoji</span>
            <input
              aria-label="Emoji"
              maxLength={4}
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
            />
          </label>
          <label className="editor-field">
            <span>{itemLabel}名称</span>
            <input
              aria-label={`${itemLabel}名称`}
              autoFocus
              maxLength={20}
              placeholder={`写下${itemLabel}名称`}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setShowTitleError(false);
              }}
            />
            <small data-error={showTitleError}>
              {showTitleError ? "名称不能为空。" : `${title.length} / 20`}
            </small>
          </label>
          <label className="editor-field">
            <span>一句描述</span>
            <textarea
              aria-label="一句描述"
              maxLength={60}
              rows={3}
              placeholder="可选，留一句属于你们的话"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <small>{description.length} / 60</small>
          </label>
          <div className="dialog-actions">
            <button className="secondary-button" type="button" onClick={onCancel}>
              取消
            </button>
            <button className="primary-button" type="submit">
              保存
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
