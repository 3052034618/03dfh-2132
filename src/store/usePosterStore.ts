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
  autoSaveEnabled: boolean
  lastSavedAt: number | null

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
  editTag: (id: string, text: string) => void
  reorderTags: (tags: Tag[]) => void
  setAutoSaveEnabled: (v: boolean) => void

  saveDraft: (title?: string) => string
  renameDraft: (id: string, title: string) => void
  duplicateDraft: (id: string) => string
  loadDraft: (id: string) => void
  deleteDraft: (id: string) => void
  clearCurrent: () => void
}

const DRAFTS_KEY = 'rcr_drafts_v1'
const DRAFT_PREFIX = 'rcr_draft_'
const MAX_DRAFTS = 10
const SETTINGS_KEY = 'rcr_settings'

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

function loadAutoSaveSetting(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return true
    return JSON.parse(raw).autoSave ?? true
  } catch {
    return true
  }
}

function saveAutoSaveSetting(v: boolean) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ autoSave: v }))
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
  autoSaveEnabled: loadAutoSaveSetting(),
  lastSavedAt: null,

  setTemplateType: (v) => {
    set({ templateType: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setScriptName: (v) => {
    set({ scriptName: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setShopLocation: (v) => {
    set({ shopLocation: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setDate: (v) => {
    set({ date: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setDuration: (v) => {
    set({ duration: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setVacancyCount: (v) => {
    set({ vacancyCount: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setFeeRange: (v) => {
    set({ feeRange: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setSignupCode: (v) => {
    set({ signupCode: v })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  addTag: (tag) => {
    set((s) => {
      if (s.tags.find((t) => t.id === tag.id)) return s
      return { tags: [...s.tags, tag] }
    })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  removeTag: (id) => {
    set((s) => ({
      tags: s.tags.filter((t) => t.id !== id),
    }))
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  editTag: (id, text) => {
    set((s) => ({
      tags: s.tags.map((t) => t.id === id ? { ...t, text } : t),
    }))
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  reorderTags: (tags) => {
    set({ tags })
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  },
  setAutoSaveEnabled: (v) => {
    set({ autoSaveEnabled: v })
    saveAutoSaveSetting(v)
  },

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

    set({ drafts: trimmed, currentDraftId: id, lastSavedAt: Date.now() })
    return id
  },

  renameDraft: (id, title) => {
    const state = get()
    const meta = state.drafts.map((d) => d.id === id ? { ...d, title, savedAt: Date.now() } : d)
    saveDraftsMeta(meta)
    set({ drafts: meta })
  },

  duplicateDraft: (id) => {
    const data = loadDraftData(id)
    if (!data) return ''
    const state = get()
    const sourceMeta = state.drafts.find((d) => d.id === id)
    const newId = `d${Date.now()}`
    const newTitle = sourceMeta ? sourceMeta.title + ' 副本' : '草稿副本'
    saveDraftData(newId, data)
    const meta: DraftMeta[] = [{ id: newId, title: newTitle, savedAt: Date.now() }, ...state.drafts]
    const trimmed = meta.slice(0, MAX_DRAFTS)
    saveDraftsMeta(trimmed)
    set({ drafts: trimmed })
    return newId
  },

  loadDraft: (id) => {
    const data = loadDraftData(id)
    if (!data) return
    set({ ...data, currentDraftId: id, lastSavedAt: Date.now() })
  },

  deleteDraft: (id) => {
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
    set({ ...INITIAL_DATA, currentDraftId: null, lastSavedAt: null })
  },
}))
