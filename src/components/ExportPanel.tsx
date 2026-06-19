import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import ArchiveTemplate from '@/components/templates/ArchiveTemplate'
import WantedTemplate from '@/components/templates/WantedTemplate'
import TicketTemplate from '@/components/templates/TicketTemplate'
import {
  Download,
  Copy,
  Check,
  Image,
  ShieldAlert,
  CheckCircle2,
  Circle,
  ChevronDown,
  FileText,
  X,
  ArrowLeft,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import {
  generateCopy,
  COPY_TONES,
  COPY_CHANNELS,
  runPrecheck,
  type CopyTone,
  type CopyChannel,
  type CopyData,
} from '@/lib/utils'
import { cn } from '@/lib/utils'

function PrecheckModal({
  items,
  onCancel,
  onConfirm,
}: {
  items: { key: string; label: string; filled: boolean }[]
  onCancel: () => void
  onConfirm: () => void
}) {
  const missing = items.filter((i) => !i.filled)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-accent-crimson/20 border border-accent-crimson/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-accent-crimson-light" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-serif font-bold text-text-primary">
              发布前预检
            </h3>
            <p className="text-xs text-text-muted">
              还差 {missing.length} 项未填写，导出可能会显示占位符
            </p>
          </div>
        </div>

        <div className="space-y-1.5 mb-5 p-3 bg-bg-input rounded-lg border border-border-subtle">
          {items.map((p) => (
            <div key={p.key} className="flex items-center gap-2 text-sm">
              {p.filled ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                  <Circle className="w-4 h-4 text-accent-crimson-light shrink-0" />
              )}
              <span className="flex-1">{p.label}</span>
              <span className={p.filled ? 'text-green-400' : 'text-accent-crimson-light'}>
                {p.filled ? '✓' : '未填'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-input text-text-secondary rounded-lg border border-border-subtle hover:border-text-muted hover:text-text-primary transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回补全
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-accent-gold/20 text-accent-gold rounded-lg border border-accent-gold/30 hover:bg-accent-gold/30 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            仍然导出
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExportPanel() {
  const store = usePosterStore()
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showTonePicker, setShowTonePicker] = useState(false)
  const [selectedTone, setSelectedTone] = useState<CopyTone>('neutral')
  const [selectedChannel, setSelectedChannel] = useState<CopyChannel>('group')
  const [showPrecheck, setShowPrecheck] = useState(false)
  const [showChannelPicker, setShowChannelPicker] = useState(false)
  const [copyPreviewOpen, setCopyPreviewOpen] = useState(true)
  const [pendingExport, setPendingExport] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const copyData: CopyData = useMemo(() => ({
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
  const allFilled = precheckItems.every((p) => p.filled)
  const filledCount = precheckItems.filter((p) => p.filled).length

  const copyText = useMemo(
    () => generateCopy(copyData, selectedTone, selectedChannel),
    [copyData, selectedTone, selectedChannel]
  )

  const doExport = useCallback(async () => {
    if (!posterRef.current || exporting) return
    setExporting(true)
    setShowPrecheck(false)
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `硬核车队-${store.scriptName || '招募海报'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      console.error('导出图片失败')
    } finally {
      setExporting(false)
    }
  }, [exporting, store.scriptName])

  const handleExportImage = useCallback(() => {
    if (allFilled) {
      doExport()
    } else {
      setPendingExport(true)
      setShowPrecheck(true)
    }
  }, [allFilled, doExport])

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('复制失败')
    }
  }, [copyText])

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        导出与分享
        {!allFilled && (
          <button
            onClick={() => setShowPrecheck((o) => !o)}
            className="ml-auto flex items-center gap-1 text-xs text-accent-crimson-light hover:text-accent-crimson transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {filledCount}/{precheckItems.length}项待完善
          </button>
        )}
        {allFilled && (
          <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            信息完整
          </span>
        )}
      </h3>

      {showPrecheck && (
        <div className="mb-4 p-3 rounded-lg border border-accent-crimson/25 bg-accent-crimson/10 animate-fade-in-up">
          <div className="text-xs font-bold text-accent-crimson-light mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            手机发布预检
          </div>
          <div className="space-y-1">
            {precheckItems.map((p) => (
              <div key={p.key} className="flex items-center gap-2 text-xs">
                {p.filled ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-text-muted shrink-0" />
                )}
                <span className={p.filled ? 'text-text-secondary' : 'text-text-primary'}>
                  {p.label}
                </span>
                <span className={p.filled ? 'text-green-400' : 'text-accent-crimson-light'}>
                  {p.filled ? '已填写' : '未填写'}
                </span>
              </div>
            ))}
          </div>
          {allFilled && (
            <div className="text-[10px] text-green-400 mt-2">
              ✅ 所有信息已齐，可以安心发布了！
            </div>
          )}
          {!allFilled && (
            <div className="text-[10px] text-text-muted mt-2">
              ⚠️ 空白项会在海报上显示为占位符
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mb-3">
        <div className="flex-1 relative">
          <button
            onClick={handleExportImage}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-gold/20 text-accent-gold rounded-lg border border-accent-gold/30 hover:bg-accent-gold/30 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? '导出中...' : '导出长图'}
          </button>
        </div>
        <div className="flex-1 relative">
          <button
            onClick={() => setShowTonePicker((o) => !o)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-input text-text-secondary rounded-lg border border-border-subtle hover:border-accent-gold/40 hover:text-accent-gold-light transition-all"
          >
            <FileText className="w-4 h-4" />
            {COPY_TONES.find((t) => t.key === selectedTone)?.name || '选择语气'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTonePicker ? 'rotate-180' : ''}`} />
          </button>
          {showTonePicker && (
            <div className="absolute z-50 right-0 left-0 mt-1 bg-bg-card border border-border-subtle rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
              {COPY_TONES.map((tone) => (
                <button
                  key={tone.key}
                  onClick={() => {
                    setSelectedTone(tone.key)
                    setShowTonePicker(false)
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2.5 border-b border-border-subtle last:border-b-0 transition-colors',
                    selectedTone === tone.key
                      ? 'bg-accent-gold/10 text-accent-gold'
                      : 'hover:bg-bg-hover text-text-primary'
                  )}
                >
                  <div className="text-sm font-bold">{tone.name}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{tone.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {COPY_CHANNELS.map((ch) => (
          <button
            key={ch.key}
            onClick={() => setSelectedChannel(ch.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-xs transition-all',
              selectedChannel === ch.key
                ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/40'
                : 'bg-bg-input text-text-secondary border-border-subtle hover:border-text-muted'
            )}
          >
            <span>{ch.icon}</span>
            {ch.name}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <button
          onClick={() => setCopyPreviewOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2 bg-bg-input rounded-lg border border-border-subtle hover:border-text-muted transition-all"
        >
          <span className="text-xs text-text-secondary flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            文字版预览 · {COPY_TONES.find((t) => t.key === selectedTone)?.name} · {COPY_CHANNELS.find((c) => c.key === selectedChannel)?.name}
          </span>
          <span className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopyText()
              }}
              className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-accent-gold/15 text-accent-gold border border-accent-gold/25 hover:bg-accent-gold/25 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制'}
            </button>
            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${copyPreviewOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>
        {copyPreviewOpen && (
          <div className="mt-2 p-3 bg-bg-input rounded-lg border border-border-subtle animate-fade-in-up relative">
            <pre className="text-[11px] text-text-secondary whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto pr-4">
              {copyText}
            </pre>
            <button
              onClick={() => setCopyPreviewOpen(false)}
              className="absolute top-1.5 right-1.5 p-1 text-text-muted hover:text-text-secondary"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-border-subtle">
        <div className="px-3 py-2 bg-bg-input flex items-center gap-2 border-b border-border-subtle">
          <Image className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">海报预览</span>
        </div>
        <div className="bg-[#080810] p-4 flex justify-center overflow-x-auto">
          <div ref={posterRef} className="inline-block">
            {store.templateType === 'archive' && (
              <ArchiveTemplate
                scriptName={store.scriptName}
                shopLocation={store.shopLocation}
                date={store.date}
                duration={store.duration}
                vacancyCount={store.vacancyCount}
                feeRange={store.feeRange}
                tags={store.tags}
                signupCode={store.signupCode}
              />
            )}
            {store.templateType === 'wanted' && (
              <WantedTemplate
                scriptName={store.scriptName}
                shopLocation={store.shopLocation}
                date={store.date}
                duration={store.duration}
                vacancyCount={store.vacancyCount}
                feeRange={store.feeRange}
                tags={store.tags}
                signupCode={store.signupCode}
              />
            )}
            {store.templateType === 'ticket' && (
              <TicketTemplate
                scriptName={store.scriptName}
                shopLocation={store.shopLocation}
                date={store.date}
                duration={store.duration}
                vacancyCount={store.vacancyCount}
                feeRange={store.feeRange}
                tags={store.tags}
                signupCode={store.signupCode}
              />
            )}
          </div>
        </div>
      </div>

      {pendingExport && showPrecheck && (
        <PrecheckModal
          items={precheckItems}
          onCancel={() => {
            setShowPrecheck(false)
            setPendingExport(false)
          }}
          onConfirm={() => {
            doExport()
            setPendingExport(false)
          }}
        />
      )}
    </div>
  )
}
