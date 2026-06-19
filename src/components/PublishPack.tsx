import { useMemo } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import {
  Package,
  Image as ImageIcon,
  FileText,
  KeyRound,
  CheckCircle2,
  Circle,
  ShieldAlert,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { generateCopy, COPY_TONES, COPY_CHANNELS, runPrecheck, type CopyTone, type CopyChannel } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { parseVacancy } from '@/lib/utils'

interface Props {
  tone: CopyTone
  channel: CopyChannel
  onClose?: () => void
}

export default function PublishPack({ tone, channel }: Props) {
  const store = usePosterStore()

  const copyData = useMemo(() => ({
    scriptName: store.scriptName,
    shopLocation: store.shopLocation,
    date: store.date,
    duration: store.duration,
    vacancyCount: store.vacancyCount,
    feeRange: store.feeRange,
    tags: store.tags,
    signupCode: store.signupCode,
  }), [store])

  const precheckItems = useMemo(() => runPrecheck(copyData), [copyData])
  const copyText = useMemo(() => generateCopy(copyData, tone, channel), [copyData, tone, channel])
  const allFilled = precheckItems.every((p) => p.filled)
  const filledCount = precheckItems.filter((p) => p.filled).length

  const vacancyNum = parseVacancy(store.vacancyCount).num
  const vacancyInt = vacancyNum ? parseInt(vacancyNum, 10) : null
  const players = store.players
  const confirmed = players.filter((p) => p.confirmed).length
  const remaining = vacancyInt !== null ? Math.max(vacancyInt - players.length, 0) : null
  const overbooked = vacancyInt !== null ? players.length > vacancyInt : false

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        <Package className="w-4 h-4 text-accent-gold/80" />
        发布包预览
        <span className="text-xs text-text-muted font-normal ml-1">
          海报 + 文案 + 暗号 + 预检 + 成车进度
        </span>
      </h3>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent-gold/5 via-bg-hover to-bg-input border border-accent-gold/20">
          <div className="text-[11px] text-accent-gold/80 font-bold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3" />
            发布内容总览 · 当前配置
            <span className="ml-auto text-text-muted font-normal">
              {COPY_TONES.find((t) => t.key === tone)?.name}
              {' · '}
              {COPY_CHANNELS.find((c) => c.key === channel)?.icon} {COPY_CHANNELS.find((c) => c.key === channel)?.name}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bg-input/50 border border-border-subtle">
              <ImageIcon className="w-3 h-3 text-text-muted" />
              <span className="text-text-secondary">海报</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bg-input/50 border border-border-subtle">
              <FileText className="w-3 h-3 text-text-muted" />
              <span className="text-text-secondary">渠道文案</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bg-input/50 border border-border-subtle">
              <KeyRound className="w-3 h-3 text-text-muted" />
              <span className="text-text-secondary">报名暗号</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bg-input/50 border border-border-subtle">
              <Users className="w-3 h-3 text-text-muted" />
              <span className="text-text-secondary">成车进度</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border-subtle bg-bg-input/40">
            <div className="text-[11px] text-text-secondary font-bold mb-2 flex items-center gap-1.5">
              <ShieldAlert className={cn(
                'w-3.5 h-3.5',
                allFilled ? 'text-green-400' : 'text-accent-crimson-light'
              )} />
              预检状态：{filledCount}/{precheckItems.length} 项完成
            </div>
            <div className="space-y-1">
              {precheckItems.map((p) => (
                <div key={p.key} className="flex items-center gap-1.5 text-[10px]">
                  {p.filled ? (
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-text-muted shrink-0" />
                  )}
                  <span className={p.filled ? 'text-text-muted' : 'text-text-secondary'}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
            {allFilled && (
              <div className="mt-2 text-[10px] text-green-400">✅ 可以安心发车了</div>
            )}
          </div>

          <div className="p-3 rounded-lg border border-border-subtle bg-bg-input/40">
            <div className="text-[11px] text-text-secondary font-bold mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent-gold/70" />
              成车进度
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div>
                <div className="text-green-400 font-bold text-sm">{confirmed}</div>
                <div className="text-text-muted">已确认</div>
              </div>
              <div>
                <div className="text-text-primary font-bold text-sm">{players.length}</div>
                <div className="text-text-muted">总登记</div>
              </div>
              <div>
                <div className={cn(
                  'font-bold text-sm',
                  overbooked ? 'text-accent-crimson-light' : remaining === 0 ? 'text-green-400' : 'text-accent-gold'
                )}>
                  {remaining === null ? '?' : remaining}
                </div>
                <div className="text-text-muted">{overbooked ? '超员' : remaining === 0 ? '已满' : '空位'}</div>
              </div>
            </div>
            {store.vacancyCount && (
              <div className="mt-2 h-1.5 rounded-full bg-bg-hover overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    overbooked ? 'bg-accent-crimson' : 'bg-accent-gold'
                  )}
                  style={{
                    width: vacancyInt
                      ? `${Math.min((players.length / vacancyInt) * 100, 120)}%`
                      : '0%',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-border-subtle bg-bg-input/40">
          <div className="text-[11px] text-text-secondary font-bold mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-accent-gold/70" />
            报名暗号
          </div>
          {store.signupCode ? (
            <div className="text-xs text-accent-gold-light/90 bg-accent-gold/5 border border-accent-gold/20 rounded px-3 py-2 font-serif">
              {store.signupCode}
            </div>
          ) : (
            <div className="text-[10px] text-text-muted">还没填写报名暗号</div>
          )}
        </div>

        <div className="p-3 rounded-lg border border-border-subtle bg-bg-input/40">
          <div className="text-[11px] text-text-secondary font-bold mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent-gold/70" />
            渠道文案预览
            <span className="ml-auto text-text-muted font-normal">
              {COPY_CHANNELS.find((c) => c.key === channel)?.icon}{' '}
              {COPY_CHANNELS.find((c) => c.key === channel)?.name}
            </span>
          </div>
          <pre className="text-[10px] text-text-secondary/90 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto bg-bg-hover/60 p-2 rounded border border-border-subtle">
            {copyText}
          </pre>
        </div>
      </div>
    </div>
  )
}
