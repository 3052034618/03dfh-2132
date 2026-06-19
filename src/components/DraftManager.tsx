import { useState, useRef, useEffect } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import {
  Save,
  FolderOpen,
  Trash2,
  Plus,
  Clock,
  ChevronDown,
  Pencil,
  Copy,
  Check,
  X,
  Settings,
} from 'lucide-react'

function formatTime(ts: number) {
  const now = Date.now()
  const diff = now - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return new Date(ts).toLocaleDateString('zh-CN')
}

interface DraftRowProps {
  id: string
  title: string
  savedAt: number
  isActive: boolean
  onLoad: () => void
  onRename: (newTitle: string) => void
  onDuplicate: () => void
  onDelete: () => void
}

function DraftRow({
  id,
  title,
  savedAt,
  isActive,
  onLoad,
  onRename,
  onDuplicate,
  onDelete,
}: DraftRowProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== title) {
      onRename(trimmed)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditing(false)
  }

  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
        isActive
          ? 'bg-accent-gold/10 border-accent-gold/40'
          : 'bg-bg-input border-border-subtle hover:border-text-muted'
      }`}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="flex-1 bg-bg-hover border border-accent-gold/30 rounded px-2 py-1 text-sm text-text-primary outline-none"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          onBlur={handleSave}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <button onClick={onLoad} className="flex-1 text-left min-w-0">
          <div className="text-sm text-text-primary truncate">{title}</div>
          <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatTime(savedAt)}
            {isActive && <span className="ml-1 text-accent-gold">· 当前</span>}
          </div>
        </button>
      )}
      <div className="flex items-center gap-0.5">
        {editing ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSave()
            }}
            className="p-1.5 text-green-400 hover:text-green-300 rounded transition-colors"
            title="保存"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
              className="p-1.5 text-text-muted hover:text-accent-gold-light rounded transition-colors"
              title="改名"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
              className="p-1.5 text-text-muted hover:text-text-primary rounded transition-colors"
              title="复制为新草稿"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 text-text-muted hover:text-accent-crimson-light rounded transition-colors"
              title="删除草稿"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DraftManager() {
  const store = usePosterStore()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    store.saveDraft()
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        草稿箱
        {store.currentDraftId && (
          <span className="text-xs text-accent-gold/60 font-normal ml-1">· 已加载</span>
        )}
        {store.autoSaveEnabled && store.currentDraftId && (
          <span className="text-xs text-green-400/80 font-normal ml-auto flex items-center gap-1">
            <Save className="w-3 h-3" />
            自动保存已开启
          </span>
        )}
      </h3>

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accent-gold/15 text-accent-gold rounded-lg border border-accent-gold/25 hover:bg-accent-gold/25 transition-all text-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? '已保存' : '保存草稿'}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-bg-input text-text-secondary rounded-lg border border-border-subtle hover:border-text-muted hover:text-text-primary transition-all text-sm"
        >
          <FolderOpen className="w-4 h-4" />
          历史草稿
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={() => store.clearCurrent()}
          className="px-3 py-2 bg-bg-input text-text-secondary rounded-lg border border-border-subtle hover:border-accent-crimson/40 hover:text-accent-crimson-light transition-all"
          title="清空当前编辑"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mb-2 px-0.5">
        <Settings className="w-3 h-3 text-text-muted" />
        <label className="text-[10px] text-text-muted flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-accent-gold"
            checked={store.autoSaveEnabled}
            onChange={(e) => store.setAutoSaveEnabled(e.target.checked)}
          />
          {store.currentDraftId ? '修改后自动保存' : '保存草稿后自动同步'}
        </label>
      </div>

      {open && (
        <div className="space-y-1.5 animate-fade-in-up">
          {store.drafts.length === 0 && (
            <div className="text-center py-4 text-xs text-text-muted">
              暂无历史草稿，保存后会显示在这里
            </div>
          )}
          {store.drafts.map((d) => (
            <DraftRow
              key={d.id}
              id={d.id}
              title={d.title}
              savedAt={d.savedAt}
              isActive={d.id === store.currentDraftId}
              onLoad={() => store.loadDraft(d.id)}
              onRename={(newTitle) => store.renameDraft(d.id, newTitle)}
              onDuplicate={() => store.duplicateDraft(d.id)}
              onDelete={() => store.deleteDraft(d.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
