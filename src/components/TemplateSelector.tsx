import { usePosterStore } from '@/store/usePosterStore'
import type { TemplateType } from '@/types'
import { TEMPLATE_META } from '@/types'
import { FileArchive, Search, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'

const TEMPLATE_ICONS: Record<TemplateType, React.ReactNode> = {
  archive: <FileArchive className="w-6 h-6" />,
  wanted: <Search className="w-6 h-6" />,
  ticket: <Ticket className="w-6 h-6" />,
}

const TEMPLATE_PREVIEW_COLORS: Record<TemplateType, { bg: string; border: string; accent: string }> = {
  archive: { bg: 'bg-gray-900', border: 'border-gray-600', accent: 'text-red-400' },
  wanted: { bg: 'bg-amber-900/40', border: 'border-amber-700', accent: 'text-amber-200' },
  ticket: { bg: 'bg-stone-800', border: 'border-stone-600', accent: 'text-orange-300' },
}

const TEMPLATE_MINI_PREVIEWS: Record<TemplateType, React.ReactNode> = {
  archive: (
    <div className="w-full h-32 bg-gray-900 rounded-lg p-3 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
      <div className="archive-scanline" />
      <div className="text-[10px] text-gray-400 tracking-widest">FILE NO.2024-007</div>
      <div className="text-xs text-white font-bold tracking-wider">CLASSIFIED</div>
      <div className="text-[8px] text-red-400 stamp-effect scale-75">机 密</div>
      <div className="w-16 h-px bg-gray-600 my-0.5" />
      <div className="text-[8px] text-gray-500">██████████</div>
    </div>
  ),
  wanted: (
    <div className="w-full h-32 parchment-texture rounded-lg p-3 flex flex-col items-center justify-center gap-1">
      <div className="text-[10px] text-amber-900 tracking-widest font-bold">W A N T E D</div>
      <div className="w-12 h-px bg-amber-800 my-0.5" />
      <div className="text-[9px] text-amber-900 font-serif">推理高手</div>
      <div className="w-8 h-8 rounded-full border-2 border-amber-800/40 flex items-center justify-center">
        <div className="text-[8px] text-amber-900">👤</div>
      </div>
      <div className="text-[7px] text-amber-800/60">REWARD: 一车好局</div>
      <div className="fingerprint-watermark" style={{ width: 40, height: 40, right: 8, bottom: 8 }} />
    </div>
  ),
  ticket: (
    <div className="w-full h-32 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-stone-200 p-2 flex-1 flex flex-col items-center justify-center gap-0.5 relative">
        <div className="text-[8px] text-stone-500 tracking-widest">硬核推理专线</div>
        <div className="text-xs text-stone-800 font-serif font-bold">ONE WAY TICKET</div>
        <div className="w-12 h-px border-t border-dashed border-stone-400 my-0.5" />
        <div className="text-[7px] text-stone-500">2024 → 真相</div>
        <div className="absolute right-2 top-2 w-4 h-4 rounded-full border border-stone-400/50" />
      </div>
      <div className="ticket-perforation bg-stone-200" />
      <div className="bg-stone-100 p-1.5 text-center">
        <div className="text-[7px] text-stone-500 tracking-wider">NOT VALID WITHOUT SEAL</div>
      </div>
    </div>
  ),
}

export default function TemplateSelector() {
  const { templateType, setTemplateType } = usePosterStore()
  const types: TemplateType[] = ['archive', 'wanted', 'ticket']

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        选择海报风格
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {types.map((t) => {
          const isActive = templateType === t
          const colors = TEMPLATE_PREVIEW_COLORS[t]
          return (
            <button
              key={t}
              onClick={() => setTemplateType(t)}
              className={cn(
                'rounded-xl p-2 border-2 transition-all duration-300 text-left group',
                isActive
                  ? 'border-accent-gold glow-gold bg-bg-card'
                  : 'border-border-subtle bg-bg-card hover:border-text-muted'
              )}
            >
              <div className="mb-2">
                {TEMPLATE_MINI_PREVIEWS[t]}
              </div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={isActive ? 'text-accent-gold' : 'text-text-secondary'}>
                  {TEMPLATE_ICONS[t]}
                </span>
                <span className={cn(
                  'text-sm font-serif font-bold',
                  isActive ? 'text-accent-gold' : 'text-text-primary'
                )}>
                  {TEMPLATE_META[t].name}
                </span>
              </div>
              <div className="text-[10px] text-text-muted leading-tight">
                {TEMPLATE_META[t].desc}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
