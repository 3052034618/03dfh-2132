import { useState, useEffect } from 'react'
import TemplateSelector from '@/components/TemplateSelector'
import PosterForm from '@/components/PosterForm'
import TagManager from '@/components/TagManager'
import SignupCode from '@/components/SignupCode'
import ExportPanel from '@/components/ExportPanel'
import DraftManager from '@/components/DraftManager'
import PlayerRoster from '@/components/PlayerRoster'
import PublishPack from '@/components/PublishPack'
import { Skull, X, RotateCcw } from 'lucide-react'
import { usePosterStore } from '@/store/usePosterStore'

export default function Home() {
  const [toast, setToast] = useState<null | { type: 'session'; msg: string; action?: () => void }>(null)
  const { __sessionRestored, clearSessionState, setVacancyCount } = usePosterStore()
  const tone = usePosterStore((s) => s.tone)
  const channel = usePosterStore((s) => s.channel)

  useEffect(() => {
    if (__sessionRestored) {
      setToast({
        type: 'session',
        msg: '已自动恢复上次未保存的编辑内容',
      })
    }
  }, [__sessionRestored])

  return (
    <div className="min-h-screen">
      <header className="border-b border-border-subtle bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-crimson/20 border border-accent-crimson/30 flex items-center justify-center">
            <Skull className="w-4 h-4 text-accent-crimson-light" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-text-primary leading-tight">
              硬核推理车队招募海报生成器
            </h1>
            <p className="text-[10px] text-text-muted">门槛说清楚 · 高手才上车</p>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed top-[57px] left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease-out]">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent-gold/15 border border-accent-gold/40 backdrop-blur-sm shadow-xl shadow-black/40">
            <RotateCcw className="w-4 h-4 text-accent-gold/80" />
            <span className="text-xs text-accent-gold/95 font-medium">{toast.msg}</span>
            <button
              onClick={() => {
                clearSessionState()
                setToast(null)
              }}
              className="ml-1 p-1 text-text-muted hover:text-text-primary transition-colors"
              title="关闭提示，且清除临时快照"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-3 space-y-0">
            <DraftManager />
            <TemplateSelector />
            <PosterForm />
            <TagManager />
            <PlayerRoster />
            <SignupCode />
          </div>
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="lg:sticky lg:top-16 space-y-0">
              <PublishPack tone={tone} channel={channel} />
              <ExportPanel />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-subtle py-4 text-center text-[10px] text-text-muted">
        硬核推理车队招募海报生成器 · 纯前端工具 · 草稿保存在本地浏览器
      </footer>
    </div>
  )
}
