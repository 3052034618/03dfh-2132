import { useState } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import { Save, FolderOpen, Trash2, Plus, Clock, ChevronDown } from 'lucide-react'

function formatTime(ts: number) {
  const now = Date.now()
  const diff = now - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return new Date(ts).toLocaleDateString('zh-CN')
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

      {open && (
        <div className="space-y-1.5 animate-fade-in-up">
          {store.drafts.length === 0 && (
            <div className="text-center py-4 text-xs text-text-muted">
              暂无历史草稿，保存后会显示在这里
            </div>
          )}
          {store.drafts.map((d) => (
            <div
              key={d.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                d.id === store.currentDraftId
                  ? 'bg-accent-gold/10 border-accent-gold/40'
                  : 'bg-bg-input border-border-subtle hover:border-text-muted'
              }`}
            >
              <button
                onClick={() => store.loadDraft(d.id)}
                className="flex-1 text-left min-w-0"
              >
                <div className="text-sm text-text-primary truncate">{d.title}</div>
                <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {formatTime(d.savedAt)}
                </div>
              </button>
              <button
                onClick={() => store.deleteDraft(d.id)}
                className="p-1.5 text-text-muted hover:text-accent-crimson-light rounded transition-colors"
                title="删除草稿"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
