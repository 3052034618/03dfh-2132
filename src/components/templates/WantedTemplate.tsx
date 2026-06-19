import type { Tag } from '@/types'
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

export default function WantedTemplate({
  scriptName,
  shopLocation,
  date,
  duration,
  vacancyCount,
  feeRange,
  tags,
  signupCode,
}: Props) {
  return (
    <div
      className="w-[375px] min-h-[667px] parchment-texture text-[#3a2510] relative overflow-hidden"
      style={{ fontFamily: '"Noto Serif SC", "Georgia", serif' }}
    >
      <div className="p-6 relative z-10">
        <div className="text-center mb-3">
          <div
            className="text-3xl font-black tracking-[8px] text-[#5a3a18] mb-1"
            style={{ fontFamily: '"ZCOOL QingKe HuangYou", cursive' }}
          >
            W A N T E D
          </div>
          <div className="text-[10px] tracking-[4px] text-[#8a6a40]">硬核推理高手 · 悬赏令</div>
          <div className="w-32 h-0.5 bg-[#8a6a40]/40 mx-auto mt-2" />
        </div>

        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-full border-3 border-[#5a3a18]/30 flex items-center justify-center bg-[#3a2510]/5">
            <span className="text-3xl">🔍</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div
            className="text-2xl font-black text-[#3a2510] mb-0.5"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {scriptName || '「 悬赏目标 」'}
          </div>
          <div className="text-xs text-[#6a4a20]">紧急召集 · 线索待查</div>
        </div>

        <div className="border-2 border-[#8a6a40]/30 rounded-lg p-3 mb-4 bg-[#3a2510]/5">
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#8a6a40] font-bold w-12">地点</span>
              <span className="text-[#3a2510]">{shopLocation || '待确认'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a6a40] font-bold w-12">时间</span>
              <span className="text-[#3a2510]">{date || '待确认'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a6a40] font-bold w-12">时长</span>
              <span className="text-[#3a2510]">{duration || '待确认'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a6a40] font-bold w-12">人数</span>
              <span className="text-[#8a2020] font-bold text-sm">{vacancyCount || '?'}</span>
              <span className="text-[#8a6a40]">人</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a6a40] font-bold w-12">悬赏</span>
              <span className="text-[#3a2510]">{feeRange || '面议'}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[10px] tracking-[3px] text-[#8a6a40] mb-2 text-center">通缉特征</div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3a2510]/10 border border-[#8a6a40]/30 rounded text-[10px] text-[#5a3a18]"
              >
                {ICON_MAP[tag.icon]}
                {tag.text}
              </span>
            ))}
          </div>
        </div>

        {signupCode && (
          <div className="mb-4">
            <div className="text-[10px] tracking-[3px] text-[#8a6a40] mb-1 text-center">接头暗号</div>
            <div className="text-center text-sm text-[#8a2020] font-bold bg-[#8a2020]/8 border border-[#8a2020]/20 rounded px-3 py-2"
              style={{ fontFamily: '"Ma Shan Zheng", cursive' }}
            >
              「{signupCode}」
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="stamp-effect text-[#8a2020] text-xs font-bold" style={{ fontFamily: '"Zhi Mang Xing", cursive' }}>
            通 缉 令
          </div>
        </div>

        <div className="mt-3 text-center text-[8px] text-[#8a6a40]/50 tracking-[2px]">
          REWARD: A GOOD GAME · INQUIRE WITHIN
        </div>
      </div>

      <div className="fingerprint-watermark" />
    </div>
  )
}
