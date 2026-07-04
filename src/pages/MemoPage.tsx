import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Toast } from "../components/ui/Toast";
import { useAppStore } from "../store/appStore";
import type { MemoItem, MemoItemInput } from "../store/types";

const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

type MemoPageProps = {
  onBack: () => void;
};

type MemoEditorProps = {
  open: boolean;
  mode: "add" | "edit";
  initialValue?: MemoItem;
  onCancel: () => void;
  onSave: (value: MemoItemInput) => void;
};

function formatMemoDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function MemoEditor({
  open,
  mode,
  initialValue,
  onCancel,
  onSave,
}: MemoEditorProps) {
  const [text, setText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageName, setImageName] = useState<string | undefined>();
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setText(initialValue?.text ?? "");
    setImageDataUrl(initialValue?.imageDataUrl);
    setImageName(initialValue?.imageName);
    setShowEmptyError(false);
    setFileError(null);
  }, [initialValue, open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("请选择图片文件。");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFileError("图片建议小于 3MB。");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setFileError("图片读取失败，请重试。");
        return;
      }

      setImageDataUrl(reader.result);
      setImageName(file.name);
      setFileError(null);
      setShowEmptyError(false);
    };

    reader.onerror = () => setFileError("图片读取失败，请重试。");
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedText = text.trim();

    if (!normalizedText && !imageDataUrl) {
      setShowEmptyError(true);
      return;
    }

    onSave({
      text: normalizedText,
      imageDataUrl,
      imageName: imageDataUrl ? imageName : undefined,
    });
  }

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="bottom-sheet memo-editor-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memo-editor-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="bottom-sheet__handle" aria-hidden="true" />
        <header className="bottom-sheet__header">
          <div>
            <p className="eyebrow">Memo</p>
            <h2 id="memo-editor-title">
              {mode === "add" ? "添加备忘录" : "编辑备忘录"}
            </h2>
          </div>
          <button className="sheet-close-button" type="button" aria-label="关闭编辑弹窗" onClick={onCancel}>
            ×
          </button>
        </header>
        <form className="memo-editor-form" onSubmit={handleSubmit}>
          <label className="editor-field">
            <span>文字</span>
            <textarea
              aria-label="备忘录文字"
              autoFocus
              maxLength={500}
              rows={6}
              placeholder="写下今天想记住的话"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setShowEmptyError(false);
              }}
            />
            <small data-error={showEmptyError}>
              {showEmptyError ? "请至少添加文字或图片。" : `${text.length} / 500`}
            </small>
          </label>

          <div className="memo-image-field">
            <div>
              <span>图片</span>
              <small>支持 JPG、PNG、WebP，单张不超过 3MB</small>
            </div>
            {imageDataUrl ? (
              <figure className="memo-image-preview">
                <img src={imageDataUrl} alt={imageName ? `已选择图片：${imageName}` : "已选择图片"} />
                <figcaption>{imageName ?? "已选择图片"}</figcaption>
              </figure>
            ) : (
              <div className="memo-image-empty">还没有选择图片</div>
            )}
            <div className="memo-image-actions">
              <label className="secondary-button memo-file-button">
                选择图片
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              <button
                className="secondary-button"
                type="button"
                disabled={!imageDataUrl}
                onClick={() => {
                  setImageDataUrl(undefined);
                  setImageName(undefined);
                }}
              >
                移除图片
              </button>
            </div>
            {fileError && <p className="memo-file-error">{fileError}</p>}
          </div>

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

export function MemoPage({ onBack }: MemoPageProps) {
  const memoItems = useAppStore((state) => state.memoItems);
  const addMemoItem = useAppStore((state) => state.addMemoItem);
  const updateMemoItem = useAppStore((state) => state.updateMemoItem);
  const deleteMemoItem = useAppStore((state) => state.deleteMemoItem);
  const [editorMode, setEditorMode] = useState<"add" | "edit" | null>(null);
  const [editingMemo, setEditingMemo] = useState<MemoItem | null>(null);
  const [deletingMemo, setDeletingMemo] = useState<MemoItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openAddEditor() {
    setEditingMemo(null);
    setEditorMode("add");
  }

  function openEditEditor(item: MemoItem) {
    setEditingMemo(item);
    setEditorMode("edit");
  }

  function closeEditor() {
    setEditorMode(null);
    setEditingMemo(null);
  }

  function handleSave(value: MemoItemInput) {
    if (editorMode === "edit" && editingMemo) {
      updateMemoItem(editingMemo.id, value);
      setToast("备忘录已更新");
    } else {
      addMemoItem(value);
      setToast("备忘录已保存");
    }

    closeEditor();
  }

  function handleDelete() {
    if (!deletingMemo) return;

    deleteMemoItem(deletingMemo.id);
    setDeletingMemo(null);
    setToast("备忘录已删除");
  }

  return (
    <section className="page memo-page">
      <header className="memo-header">
        <button className="memo-back-button" type="button" aria-label="返回首页" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="eyebrow">Memo</p>
          <h1>备忘录</h1>
          <p>随手记下想说的话，也可以留下一张图片。</p>
        </div>
      </header>

      <div className="memo-summary card card--soft">
        <div>
          <strong>{memoItems.length}</strong>
          <span>条备忘</span>
        </div>
        <button className="add-item-button" type="button" onClick={openAddEditor}>
          <span aria-hidden="true">＋</span>
          添加备忘
        </button>
      </div>

      {memoItems.length === 0 ? (
        <article className="bucket-empty-state memo-empty-state">
          <div aria-hidden="true">✎</div>
          <h2>还没有备忘录</h2>
          <p>先写一句话，或者放一张想留住的图片。</p>
          <button className="add-item-button" type="button" onClick={openAddEditor}>
            <span aria-hidden="true">＋</span>
            添加备忘
          </button>
        </article>
      ) : (
        <div className="memo-list">
          {memoItems.map((item) => (
            <article className="memo-card card" key={item.id}>
              {item.imageDataUrl && (
                <img
                  className="memo-card__image"
                  src={item.imageDataUrl}
                  alt={item.imageName ? `备忘录图片：${item.imageName}` : "备忘录图片"}
                />
              )}
              <div className="memo-card__body">
                <p>{item.text || "图片备忘"}</p>
                <span>{formatMemoDate(item.updatedAt)}</span>
              </div>
              <div className="memo-card__actions">
                <button className="icon-text-button" type="button" onClick={() => openEditEditor(item)}>
                  编辑
                </button>
                <button
                  className="icon-text-button icon-text-button--danger"
                  type="button"
                  onClick={() => setDeletingMemo(item)}
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <MemoEditor
        open={editorMode !== null}
        mode={editorMode ?? "add"}
        initialValue={editingMemo ?? undefined}
        onCancel={closeEditor}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deletingMemo !== null}
        title="删除备忘录"
        message="确定要删除这条备忘录吗？"
        onCancel={() => setDeletingMemo(null)}
        onConfirm={handleDelete}
      />
      <Toast message={toast} />
    </section>
  );
}
