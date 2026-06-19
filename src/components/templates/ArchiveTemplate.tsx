import type { Tag } from '@/types'
import { formatVacancyNumOnly } from '@/lib/utils'
import { Clock, BookOpen, Crosshair, ShieldAlert, PenLine, Drama, Wifi, RefreshCw, Puzzle, Award, Tags } from 'lucide-react'

const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-3 h-3" />,
  BookOpen: <BookOpen className="w-3 h-3" />,
  Crosshair: <Crosshair className="w-3 h-3" />,
  ShieldAlert: <ShieldAlert className="w-3 h-3" />,
  PenLine: <PenLine className="w-3 h-3" />,
  Drama: <Drama className="w-3 h-3" />,
  Wifi: <Wifi className="w-3 h-3" />,
  RefreshCw: <RefreshCw className="w-3 h-3" />,
  Puzzle: <Puzzle className="w-3 h-3" />,
  Award: <Award className="w-3 h-3" />,
  Tags: <Tags className="w-3 h-3" />,
}

interface Props {
  scriptName: string
  shopLocation: string
  date: string
  duration: string
  vacancyCount: string
  feeRange: string
  tags: Tag[]
  signupCode: string
}

export default function ArchiveTemplate({
  scriptName,
  shopLocation,
  date,
  duration,
  vacancyCount,
  feeRange,
  tags,
  signupCode,
}: Props) {
  const v = formatVacancyNumOnly(vacancyCount)
  return (
    <div
      className="w-[375px] min-h-[667px] bg-[#0d0d12] text-white font-mono relative overflow-hidden"
      style={{ fontFamily: '"Courier New", "Noto Serif SC", monospace' }}
    >
      <div className="archive-scanline" />
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] text-gray-500 tracking-[4px]">FILE NO.{Math.floor(Math.random() * 9000 + 1000)}</div>
          <div className="text-[10px] text-gray-600">DEPT. OF REASONING</div>
        </div>

        <div className="border-b border-gray-700 mb-4" />

        <div className="text-center mb-4">
          <div className="text-2xl font-bold tracking-[6px] text-white mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {scriptName || '▓▓▓▓▓▓▓▓'}
          </div>
          <div className="text-[10px] text-gray-500 tracking-[3px]">HARDCORE REASONING TEAM</div>
        </div>

        <div className="border-b border-dashed border-gray-700 mb-4" />

        <div className="space-y-2 text-xs mb-5">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">LOCATION</span>
            <span className="text-gray-300">{shopLocation || '█████████'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">DATE</span>
            <span className="text-gray-300">{date || '█████████'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">DURATION</span>
            <span className="text-gray-300">{duration || '█████████'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">VACANCY</span>
            <span className="text-red-400 font-bold">{v ? v + ' 名' : '█'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">FEE</span>
            <span className="text-gray-300">{feeRange || '█████████'}</span>
          </div>
        </div>

        <div className="border-b border-gray-700 mb-3" />

        <div className="mb-4">
          <div className="text-[10px] text-gray-500 tracking-[3px] mb-2">REQUIREMENTS</div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/80 border border-gray-600 rounded text-[10px] text-gray-300"
              >
                {ICON_MAP[tag.icon]}
                {tag.text}
              </span>
            ))}
          </div>
        </div>

        {signupCode && (
          <>
            <div className="border-b border-dashed border-gray-700 mb-3" />
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 tracking-[3px] mb-1">SIGNAL PROTOCOL</div>
              <div className="text-xs text-amber-400/90 bg-amber-900/15 border border-amber-800/30 rounded px-3 py-2 font-mono">
                {signupCode}
              </div>
            </div>
          </>
        )}

        <div className="border-b border-gray-700 mb-3" />

        <div className="flex items-center justify-center">
          <span className="stamp-effect text-red-500 text-sm font-bold" style={{ fontFamily: '"Zhi Mang Xing", cursive' }}>
            机 密
          </span>
        </div>

        <div className="mt-3 text-center text-[8px] text-gray-600 tracking-[2px]">
          THIS DOCUMENT IS CLASSIFIED · UNAUTHORIZED ACCESS PROHIBITED
        </div>
      </div>
    </div>
  )
}
