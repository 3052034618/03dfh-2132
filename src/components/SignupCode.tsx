import { usePosterStore } from '@/store/usePosterStore'
import { KeyRound } from 'lucide-react'

export default function SignupCode() {
  const { signupCode, setSignupCode } = usePosterStore()

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        <KeyRound className="w-4 h-4 text-accent-gold/70" />
        报名暗号
        <span className="text-xs text-text-muted font-normal ml-1">避免群里只回复"我来"</span>
      </h3>
      <div className="relative">
        <input
          className="editor-input pr-10"
          placeholder="例如：昵称+打过的三个硬核本+可到时间"
          value={signupCode}
          onChange={(e) => setSignupCode(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-gold/30">
          <KeyRound className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2 text-[10px] text-text-muted">
        此暗号将显示在海报上，报名者需按此格式回复才算有效报名
      </div>
    </div>
  )
}
