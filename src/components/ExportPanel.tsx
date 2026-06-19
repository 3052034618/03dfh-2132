import { useRef, useState, useCallback } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import ArchiveTemplate from '@/components/templates/ArchiveTemplate'
import WantedTemplate from '@/components/templates/WantedTemplate'
import TicketTemplate from '@/components/templates/TicketTemplate'
import { Download, Copy, Check, Image } from 'lucide-react'
import html2canvas from 'html2canvas'

function generateText(
  scriptName: string,
  shopLocation: string,
  date: string,
  duration: string,
  vacancyCount: string,
  feeRange: string,
  tags: { text: string }[],
  signupCode: string,
): string {
  const lines: string[] = []
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('🔍 硬核推理车队招募')
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('')
  if (scriptName) lines.push(`📖 剧本：${scriptName}`)
  if (shopLocation) lines.push(`📍 地点：${shopLocation}`)
  if (date) lines.push(`📅 日期：${date}`)
  if (duration) lines.push(`⏱ 时长：${duration}`)
  if (vacancyCount) lines.push(`👥 空缺：${vacancyCount}人`)
  if (feeRange) lines.push(`💰 车费：${feeRange}`)
  lines.push('')
  if (tags.length > 0) {
    lines.push('📋 报名要求：')
    tags.forEach((tag, i) => {
      lines.push(`  ${i + 1}. ${tag.text}`)
    })
    lines.push('')
  }
  if (signupCode) {
    lines.push('🔑 报名暗号：')
    lines.push(`  ${signupCode}`)
    lines.push('')
  }
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('符合条件的玩家速来！')
  return lines.join('\n')
}

export default function ExportPanel() {
  const store = usePosterStore()
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const handleExportImage = useCallback(async () => {
    if (!posterRef.current || exporting) return
    setExporting(true)
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

  const handleCopyText = useCallback(async () => {
    const text = generateText(
      store.scriptName,
      store.shopLocation,
      store.date,
      store.duration,
      store.vacancyCount,
      store.feeRange,
      store.tags,
      store.signupCode,
    )
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('复制失败')
    }
  }, [store])

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        导出与分享
      </h3>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleExportImage}
          disabled={exporting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-gold/20 text-accent-gold rounded-lg border border-accent-gold/30 hover:bg-accent-gold/30 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中...' : '导出长图'}
        </button>
        <button
          onClick={handleCopyText}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-input text-text-secondary rounded-lg border border-border-subtle hover:border-accent-gold/40 hover:text-accent-gold-light transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? '已复制！' : '复制文字版'}
        </button>
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
    </div>
  )
}
