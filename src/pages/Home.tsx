import TemplateSelector from '@/components/TemplateSelector'
import PosterForm from '@/components/PosterForm'
import TagManager from '@/components/TagManager'
import SignupCode from '@/components/SignupCode'
import ExportPanel from '@/components/ExportPanel'
import DraftManager from '@/components/DraftManager'
import { Skull } from 'lucide-react'

export default function Home() {
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-3 space-y-0">
            <DraftManager />
            <TemplateSelector />
            <PosterForm />
            <TagManager />
            <SignupCode />
          </div>
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="lg:sticky lg:top-16">
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
