import { useMemo, useState, useRef, useEffect } from 'react'
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
  Sparkles,
  Copy,
  Check,
} from 'lucide-react'
import { generateCopy, COPY_TONES, COPY_CHANNELS, runPrecheck, type CopyTone, type CopyChannel } from '@/lib/utils'
import { cn, parseVacancy } from '@/lib/utils'
import ArchiveTemplate from '@/components/templates/ArchiveTemplate'
import WantedTemplate from '@/components/templates/WantedTemplate'
import TicketTemplate from '@/components/templates/TicketTemplate'
import html2canvas from 'html2canvas'

interface Props {
  tone: CopyTone
  channel: CopyChannel
}

export default function PublishPack({ tone, channel }: Props) {
  const store = usePosterStore()
  const thumbRef = useRef<HTMLDivElement>(null)
  const [thumbUrl, setThumbUrl] = useState<string>('')
  const [copying, setCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [precheckCopied, setPrecheckCopied] = useState(false)

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
  const missingItems = precheckItems.filter((p) => !p.filled)

  const vacancyNum = parseVacancy(store.vacancyCount).num
  const vacancyInt = vacancyNum ? parseInt(vacancyNum, 10) : null
  const players = store.players
  const confirmed = players.filter((p) => p.confirmed).length
  const paid = players.filter((p) => p.paid).length
  const remaining = vacancyInt !== null ? Math.max(vacancyInt - players.length, 0) : null
  const overbooked = vacancyInt !== null ? players.length > vacancyInt : false

  useEffect(() => {
    let cancelled = false
    const gen = async () => {
      if (!thumbRef.current) return
      try {
        const canvas = await html2canvas(thumbRef.current, {
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        })
        if (!cancelled) {
          setThumbUrl(canvas.toDataURL('image/png'))
        }
      } catch {
        // ignore thumb errors
      }
    }
    const t = setTimeout(gen, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [
    store.templateType,
    store.scriptName,
    store.shopLocation,
    store.date,
    store.duration,
    store.vacancyCount,
    store.feeRange,
    store.tags,
    store.signupCode,
  ])

  const buildPrecheckText = useMemo(() => {
    const lines: string[] = []
    const scriptTitle = store.scriptName ? `【${store.scriptName}】发车提醒` : '【发车提醒】'
    lines.push(scriptTitle)

    if (vacancyInt !== null) {
      lines.push(`空位：还差 ${remaining} 人（目标 ${vacancyInt} / 已登记 ${players.length} / 已确认 ${confirmed} / 已付款 ${paid}）`)
    } else if (players.length > 0) {
      lines.push(`进度：已登记 ${players.length} 人，已确认 ${confirmed} 人，已付款 ${paid} 人`)
    }

    if (missingItems.length > 0) {
      lines.push('')
      lines.push(`以下信息还没补完（${missingItems.length}/${precheckItems.length}）：`)
      missingItems.forEach((m, i) => {
        lines.push(`${i + 1}. ${m.label}`)
      })
    } else {
      lines.push('')
      lines.push('✅ 发车信息已全部填完，可以发海报了')
    }

    if (overbooked) {
      lines.push('')
      lines.push(`⚠️ 注意：当前登记人数 ${players.length} 已超过目标空缺 ${vacancyInt} 人`)
    }

    return lines.join('\n')
  }, [missingItems, precheckItems.length, store.scriptName, vacancyInt, players.length, confirmed, paid, remaining, overbooked])

  const handleCopyText = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('复制失败')
    } finally {
      setCopying(false)
    }
  }

  const handleCopyPrecheck = async () => {
    try {
      await navigator.clipboard.writeText(buildPrecheckText)
      setPrecheckCopied(true)
      setTimeout(() => setPrecheckCopied(false), 2000)
    } catch {
      console.error('复制失败')
    }
  }

  const renderTemplate = () => {
    const props = {
      scriptName: store.scriptName,
      shopLocation: store.shopLocation,
      date: store.date,
      duration: store.duration,
      vacancyCount: store.vacancyCount,
      feeRange: store.feeRange,
      tags: store.tags,
      signupCode: store.signupCode,
    }
    switch (store.templateType) {
      case 'wanted':
        return <WantedTemplate {...props} />
      case 'ticket':
        return <TicketTemplate {...props} />
      default:
        return <ArchiveTemplate {...props} />
    }
  }

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
              {COPY_CHANNELS.find((c) => c.key === channel)?.icon}{' '}
              {COPY_CHANNELS.find((c) => c.key === channel)?.name}
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

        <div className="p-3 rounded-lg border border-border-subtle bg-bg-input/40">
          <div className="text-[11px] text-text-secondary font-bold mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-accent-gold/70" />
            当前海报缩略图
          </div>
          <div className="flex gap-3 items-start">
            <div className="relative shrink-0 w-[140px] h-[200px] rounded-lg overflow-hidden border border-border-subtle bg-bg-primary shadow-inner">
              <div className="absolute inset-0 overflow-hidden origin-top-left" style={{ transform: 'scale(0.28)' }}>
                <div className="w-[500px]" ref={thumbRef}>
                  {renderTemplate()}
                </div>
              </div>
              {thumbUrl && (
                <img
                  src={thumbUrl}
                  alt="海报缩略图"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="text-[10px] text-text-muted">
                <span className="text-text-secondary">模板：</span>
                {store.templateType === 'archive' && '冷峻档案风'}
                {store.templateType === 'wanted' && '侦探通缉令风'}
                {store.templateType === 'ticket' && '复古车票风'}
              </div>
              <div className="text-[10px] text-text-muted truncate">
                <span className="text-text-secondary">剧本：</span>
                {store.scriptName || '未填写'}
              </div>
              <div className="text-[10px] text-text-muted truncate">
                <span className="text-text-secondary">日期：</span>
                {store.date || '未填写'}
              </div>
              <div className="text-[10px] text-text-muted truncate">
                <span className="text-text-secondary">时长：</span>
                {store.duration || '未填写'}
              </div>
              <div className="text-[10px] text-text-muted truncate">
                <span className="text-text-secondary">空缺：</span>
                {store.vacancyCount || '未填写'}
              </div>
              <div className="text-[10px] text-text-muted truncate">
                <span className="text-text-secondary">车费：</span>
                {store.feeRange || '未填写'}
              </div>
              <div className="text-[10px] text-text-muted">
                <span className="text-text-secondary">标签：</span>
                {store.tags.length > 0
                  ? store.tags.map((t) => t.text).join(' · ')
                  : '未设置'}
              </div>
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
              <button
                onClick={handleCopyPrecheck}
                className={cn(
                  'ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] border transition-all',
                  precheckCopied
                    ? 'bg-green-900/20 text-green-400 border-green-700/40'
                    : 'bg-bg-hover text-text-muted border-border-subtle hover:text-text-primary hover:border-text-muted'
                )}
              >
                {precheckCopied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                {precheckCopied ? '已复制' : '复制提醒'}
              </button>
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
            <div className="mt-2 text-[10px] text-text-muted">
              已付款：{paid} 人
            </div>
            {store.vacancyCount && (
              <div className="mt-1.5 h-1.5 rounded-full bg-bg-hover overflow-hidden">
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
            <div className="text-xs text-accent-gold-light/90 bg-accent-gold/5 border border-accent-gold/20 rounded px-3 py-2 font-serif whitespace-pre-wrap">
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
            <button
              onClick={handleCopyText}
              disabled={copying}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] border transition-all',
                copied
                  ? 'bg-green-900/20 text-green-400 border-green-700/40'
                  : 'bg-bg-hover text-text-muted border-border-subtle hover:text-text-primary hover:border-text-muted'
              )}
            >
              {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
              {copied ? '已复制' : '复制文案'}
            </button>
          </div>
          <pre className="text-[10px] text-text-secondary/90 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto bg-bg-hover/60 p-2 rounded border border-border-subtle">
            {copyText}
          </pre>
        </div>
      </div>
    </div>
  )
}
