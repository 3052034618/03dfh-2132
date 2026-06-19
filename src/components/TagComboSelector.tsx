import { usePosterStore } from '@/store/usePosterStore'
import { TAG_COMBOS } from '@/types'
import { Layers, Replace, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TagComboSelector() {
  const { applyTagCombo, tags } = usePosterStore()

  return (
    <div className="mb-3">
      <div className="text-xs text-text-muted mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-accent-gold/70" />
        常用组合一键套用
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {TAG_COMBOS.map((combo) => {
          const tagCount = combo.tagIds.length + (combo.extraTags?.length || 0)
          const matched = combo.tagIds.filter((tid) => tags.find((t) => t.id === tid)).length
          const fullyApplied = matched === combo.tagIds.length
          return (
            <div
              key={combo.id}
              className={cn(
                'flex items-center gap-2 p-2 rounded-lg border transition-all',
                fullyApplied
                  ? 'bg-accent-gold/10 border-accent-gold/30'
                  : 'bg-bg-input border-border-subtle hover:border-text-muted'
              )}
            >
              <div className="w-7 h-7 rounded-md bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5 text-accent-gold/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-primary font-bold flex items-center gap-1.5">
                  {combo.name}
                  <span className="text-[9px] text-text-muted font-normal">
                    {tagCount}项
                    {fullyApplied && (
                      <span className="ml-1 text-accent-gold">· 已套用</span>
                    )}
                  </span>
                </div>
                <div className="text-[10px] text-text-muted truncate">{combo.desc}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => applyTagCombo(combo.id, false)}
                  className="p-1.5 rounded bg-bg-hover text-text-secondary hover:text-accent-gold-light border border-border-subtle hover:border-accent-gold/30 transition-all"
                  title="追加此组合"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => applyTagCombo(combo.id, true)}
                  className="p-1.5 rounded bg-bg-hover text-text-secondary hover:text-accent-crimson-light border border-border-subtle hover:border-accent-crimson/30 transition-all"
                  title="替换现有标签"
                >
                  <Replace className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
