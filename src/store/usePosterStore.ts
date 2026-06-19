import { create } from 'zustand'
import type { PosterData, Tag, TemplateType } from '@/types'
import { PRESET_TAGS } from '@/types'

interface DraftMeta {
  id: string
  title: string
  savedAt: number
}

interface PosterStore extends PosterData {
  drafts: DraftMeta[]
  currentDraftId: string | null

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

  saveDraft: (title?: string) => string
  loadDraft: (id: string) => void
  deleteDraft: (id: string) => void
  clearCurrent: () => void
}

const DRAFTS_KEY = 'rcr_drafts_v1'
const DRAFT_PREFIX = 'rcr_draft_'
const MAX_DRAFTS = 10

function loadDraftsMeta(): DraftMeta[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DraftMeta[]
  } catch {
    return []
  }
}

function saveDraftsMeta(meta: DraftMeta[]) {
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(meta))
  } catch {}
}

function loadDraftData(id: string): PosterData | null {
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw) as PosterData
  } catch {
    return null
  }
}

function saveDraftData(id: string, data: PosterData) {
  try {
    localStorage.setItem(DRAFT_PREFIX + id, JSON.stringify(data))
  } catch {}
}

function deleteDraftData(id: string) {
  try {
    localStorage.removeItem(DRAFT_PREFIX + id)
  } catch {}
}

const INITIAL_DATA: PosterData = {
  templateType: 'archive',
  scriptName: '',
  shopLocation: '',
  date: '',
  duration: '',
  vacancyCount: '',
  feeRange: '',
  tags: [PRESET_TAGS[0], PRESET_TAGS[1], PRESET_TAGS[3]],
  signupCode: '',
}

export const usePosterStore = create<PosterStore>((set, get) => ({
  ...INITIAL_DATA,
  drafts: loadDraftsMeta(),
  currentDraftId: null,

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

  saveDraft: (title?: string) => {
    const state = get()
    const data: PosterData = {
      templateType: state.templateType,
      scriptName: state.scriptName,
      shopLocation: state.shopLocation,
      date: state.date,
      duration: state.duration,
      vacancyCount: state.vacancyCount,
      feeRange: state.feeRange,
      tags: state.tags,
      signupCode: state.signupCode,
    }

    let id = state.currentDraftId
    const draftTitle = title || state.scriptName || `草稿 ${new Date().toLocaleDateString('zh-CN')}`

    if (!id) {
      id = `d${Date.now()}`
    }

    saveDraftData(id, data)

    const meta: DraftMeta[] = state.drafts.filter((d) => d.id !== id)
    meta.unshift({ id, title: draftTitle, savedAt: Date.now() })
    const trimmed = meta.slice(0, MAX_DRAFTS)
    saveDraftsMeta(trimmed)

    set({ drafts: trimmed, currentDraftId: id })
    return id
  },

  loadDraft: (id: string) => {
    const data = loadDraftData(id)
    if (!data) return
    set({ ...data, currentDraftId: id })
  },

  deleteDraft: (id: string) => {
    deleteDraftData(id)
    const state = get()
    const meta = state.drafts.filter((d) => d.id !== id)
    saveDraftsMeta(meta)
    set({
      drafts: meta,
      currentDraftId: state.currentDraftId === id ? null : state.currentDraftId,
    })
  },

  clearCurrent: () => {
    set({ ...INITIAL_DATA, currentDraftId: null })
  },
}))
