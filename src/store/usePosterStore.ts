import { create } from 'zustand'
import type { PosterData, Tag, TemplateType } from '@/types'
import { PRESET_TAGS } from '@/types'

interface PosterStore extends PosterData {
  setTemplateType: (t: TemplateType) => void
  setScriptName: (v: string) => void
  setShopLocation: (v: string) => void
  setDate: (v: string) => void
  setDuration: (v: string) => void
  setVacancyCount: (v: string) => void
  setFeeRange: (v: string) => void
  setSignupCode: (v: string) => void
  addTag: (tag: Tag) => void
  removeTag: (id: string) => void
  reorderTags: (tags: Tag[]) => void
}

export const usePosterStore = create<PosterStore>((set) => ({
  templateType: 'archive',
  scriptName: '',
  shopLocation: '',
  date: '',
  duration: '',
  vacancyCount: '',
  feeRange: '',
  tags: [PRESET_TAGS[0], PRESET_TAGS[1], PRESET_TAGS[3]],
  signupCode: '',

  setTemplateType: (v) => set({ templateType: v }),
  setScriptName: (v) => set({ scriptName: v }),
  setShopLocation: (v) => set({ shopLocation: v }),
  setDate: (v) => set({ date: v }),
  setDuration: (v) => set({ duration: v }),
  setVacancyCount: (v) => set({ vacancyCount: v }),
  setFeeRange: (v) => set({ feeRange: v }),
  setSignupCode: (v) => set({ signupCode: v }),
  addTag: (tag) => set((s) => {
    if (s.tags.find((t) => t.id === tag.id)) return s
    return { tags: [...s.tags, tag] }
  }),
  removeTag: (id) => set((s) => ({
    tags: s.tags.filter((t) => t.id !== id),
  })),
  reorderTags: (tags) => set({ tags }),
}))
