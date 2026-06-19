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

export default function TicketTemplate({
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
      className="w-[375px] min-h-[667px] bg-[#1a1610] relative overflow-hidden"
      style={{ fontFamily: '"Noto Serif SC", serif' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2418] to-[#1a1610]" />

      <div className="relative z-10">
        <div className="bg-[#f0e0c0] mx-5 mt-5 rounded-t-lg p-5 relative">
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-dashed border-[#a08060]/40" />
          <div className="absolute top-3 left-3 text-[8px] text-[#a08060]/50 tracking-[2px]">NO.{String(Math.floor(Math.random() * 9000 + 1000)).padStart(4, '0')}</div>

          <div className="text-center mb-3 mt-3">
            <div className="text-[9px] tracking-[4px] text-[#8a6a40] mb-1">硬核推理专线</div>
            <div
              className="text-xl font-black text-[#3a2510] tracking-[3px]"
              style={{ fontFamily: '"ZCOOL QingKe HuangYou", cursive' }}
            >
              {scriptName || '▓▓▓▓▓▓▓▓'}
            </div>
            <div className="text-[9px] text-[#a08060] mt-0.5">ONE WAY TICKET TO TRUTH</div>
          </div>

          <div className="border-t border-dashed border-[#a08060]/40 my-3" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#5a3a18]">
            <div>
              <span className="text-[#a08060] text-[10px]">出发站</span>
              <div className="font-bold">{shopLocation || '待定'}</div>
            </div>
            <div>
              <span className="text-[#a08060] text-[10px]">开车日期</span>
              <div className="font-bold">{date || '待定'}</div>
            </div>
            <div>
              <span className="text-[#a08060] text-[10px]">行程时长</span>
              <div className="font-bold">{duration || '待定'}</div>
            </div>
            <div>
              <span className="text-[#a08060] text-[10px]">空余座位</span>
              <div className="font-bold text-[#8a2020]">{vacancyCount || '?'} 人</div>
            </div>
          </div>

          <div className="border-t border-dashed border-[#a08060]/40 my-3" />

          <div>
            <div className="text-[9px] text-[#a08060] mb-1.5">乘客须知</div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#3a2510]/8 border border-[#a08060]/25 rounded text-[9px] text-[#5a3a18]"
                >
                  {ICON_MAP[tag.icon]}
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {signupCode && (
            <>
              <div className="border-t border-dashed border-[#a08060]/40 my-3" />
              <div>
                <div className="text-[9px] text-[#a08060] mb-1">验票口令</div>
                <div className="text-xs text-[#8a2020] font-bold bg-[#8a2020]/5 border border-[#8a2020]/15 rounded px-2 py-1.5"
                  style={{ fontFamily: '"Ma Shan Zheng", cursive' }}
                >
                  {signupCode}
                </div>
              </div>
            </>
          )}

          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-[7px] text-[#a08060]/40 tracking-[2px]">票价: {feeRange || '面议'} · 限乘{vacancyCount || '?'}人</span>
          </div>
        </div>

        <div className="mx-5 flex">
          <div className="w-4 bg-[#1a1610]" style={{
            backgroundImage: 'radial-gradient(circle, #f0e0c0 5px, transparent 5px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '2px 0',
          }} />
          <div className="flex-1 border-t-2 border-dashed border-[#a08060]/30" />
          <div className="w-4 bg-[#1a1610]" style={{
            backgroundImage: 'radial-gradient(circle, #f0e0c0 5px, transparent 5px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '-6px 0',
          }} />
        </div>

        <div className="bg-[#e8d8b0] mx-5 rounded-b-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-[8px] text-[#a08060] tracking-[2px]">硬核车队 · STUB</div>
              <div className="text-[9px] text-[#5a3a18] font-bold">{scriptName || '▓▓▓▓▓▓▓▓'}</div>
            </div>
            <div className="stamp-effect text-[#8a2020] text-[9px]" style={{ fontFamily: '"Zhi Mang Xing", cursive' }}>
              验 讫
            </div>
          </div>
        </div>

        <div className="text-center mt-4 mb-6">
          <div className="text-[8px] text-[#a08060]/30 tracking-[3px]">
            NOT VALID WITHOUT SEAL · PLEASE KEEP YOUR TICKET
          </div>
        </div>
      </div>
    </div>
  )
}
