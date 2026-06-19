import { create } from 'zustand'
import type { PosterData, Tag, TemplateType, Player } from '@/types'
import { PRESET_TAGS, TAG_COMBOS } from '@/types'
import type { CopyTone, CopyChannel } from '@/lib/utils'

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
  tone: CopyTone
  channel: CopyChannel
  __sessionRestored: boolean

  setTemplateType: (t: TemplateType) => void
  setScriptName: (v: string) => void
  setShopLocation: (v: string) => void
  setDate: (v: string) => void
  setDuration: (v: string) => void
  setVacancyCount: (v: string) => void
  setFeeRange: (v: string) => void
  setSignupCode: (v: string) => void
  setTone: (v: CopyTone) => void
  setChannel: (v: CopyChannel) => void
  addTag: (tag: Tag) => void
  removeTag: (id: string) => void
  editTag: (id: string, text: string) => void
  reorderTags: (tags: Tag[]) => void
  applyTagCombo: (comboId: string, replace?: boolean) => void
  setAutoSaveEnabled: (v: boolean) => void

  addPlayer: (player?: Partial<Player>) => void
  removePlayer: (id: string) => void
  updatePlayer: (id: string, patch: Partial<Player>) => void

  saveDraft: (title?: string) => string
  renameDraft: (id: string, title: string) => void
  duplicateDraft: (id: string) => string
  loadDraft: (id: string) => void
  deleteDraft: (id: string) => void
  clearCurrent: () => void
  restoreSession: () => boolean
  clearSessionState: () => void
}

const DRAFTS_KEY = 'rcr_drafts_v1'
const DRAFT_PREFIX = 'rcr_draft_'
const SESSION_KEY = 'rcr_session_state'
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

function saveSessionState(data: PosterData & { tone: CopyTone; channel: CopyChannel }) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
  } catch {}
}

function loadSessionState(): (PosterData & { tone: CopyTone; channel: CopyChannel }) | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as (PosterData & { tone: CopyTone; channel: CopyChannel })
  } catch {
    return null
  }
}

function clearSessionStorage() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
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
  players: [],
}

let __sessionRestoredFlag = false

function buildInitialState(): { data: PosterData; tone: CopyTone; channel: CopyChannel } {
  const session = loadSessionState()
  if (session) {
    __sessionRestoredFlag = true
    const { tone, channel, ...data } = session
    return {
      data,
      tone: tone ?? 'neutral',
      channel: channel ?? 'group',
    }
  }
  return { data: { ...INITIAL_DATA }, tone: 'neutral', channel: 'group' }
}

function snapshotSession(state: PosterStore): PosterData & { tone: CopyTone; channel: CopyChannel } {
  return {
    templateType: state.templateType,
    scriptName: state.scriptName,
    shopLocation: state.shopLocation,
    date: state.date,
    duration: state.duration,
    vacancyCount: state.vacancyCount,
    feeRange: state.feeRange,
    tags: state.tags,
    signupCode: state.signupCode,
    players: state.players,
    tone: state.tone,
    channel: state.channel,
  }
}

export const usePosterStore = create<PosterStore>((set, get) => {
  const initial = buildInitialState()

  const syncSession = () => {
    saveSessionState(snapshotSession(get()))
  }

  const autoSaveIfNeeded = () => {
    syncSession()
    if (get().autoSaveEnabled && get().currentDraftId) {
      get().saveDraft()
    }
  }

  return {
    ...initial.data,
    tone: initial.tone,
    channel: initial.channel,
    __sessionRestored: __sessionRestoredFlag,
    drafts: loadDraftsMeta(),
    currentDraftId: null,
    autoSaveEnabled: loadAutoSaveSetting(),
    lastSavedAt: null,

    setTemplateType: (v) => {
      set({ templateType: v })
      autoSaveIfNeeded()
    },
    setScriptName: (v) => {
      set({ scriptName: v })
      autoSaveIfNeeded()
    },
    setShopLocation: (v) => {
      set({ shopLocation: v })
      autoSaveIfNeeded()
    },
    setDate: (v) => {
      set({ date: v })
      autoSaveIfNeeded()
    },
    setDuration: (v) => {
      set({ duration: v })
      autoSaveIfNeeded()
    },
    setVacancyCount: (v) => {
      set({ vacancyCount: v })
      autoSaveIfNeeded()
    },
    setFeeRange: (v) => {
      set({ feeRange: v })
      autoSaveIfNeeded()
    },
    setSignupCode: (v) => {
      set({ signupCode: v })
      autoSaveIfNeeded()
    },
    setTone: (v) => {
      set({ tone: v })
      syncSession()
    },
    setChannel: (v) => {
      set({ channel: v })
      syncSession()
    },
    addTag: (tag) => {
      set((s) => {
        if (s.tags.find((t) => t.id === tag.id)) return s
        return { tags: [...s.tags, tag] }
      })
      autoSaveIfNeeded()
    },
    removeTag: (id) => {
      set((s) => ({
        tags: s.tags.filter((t) => t.id !== id),
      }))
      autoSaveIfNeeded()
    },
    editTag: (id, text) => {
      set((s) => ({
        tags: s.tags.map((t) => t.id === id ? { ...t, text } : t),
      }))
      autoSaveIfNeeded()
    },
    reorderTags: (tags) => {
      set({ tags })
      autoSaveIfNeeded()
    },
    applyTagCombo: (comboId, replace = false) => {
      const combo = TAG_COMBOS.find((c) => c.id === comboId)
      if (!combo) return
      const baseTags = combo.tagIds
        .map((tid) => PRESET_TAGS.find((pt) => pt.id === tid))
        .filter(Boolean) as Tag[]
      const extraTags: Tag[] = (combo.extraTags || []).map((t, i) => ({
        ...t,
        id: `${comboId}-extra-${i}-${Date.now()}`,
      }))
      const allNewTags = [...baseTags, ...extraTags]

      set((s) => {
        if (replace) {
          return { tags: allNewTags }
        }
        const existing = new Set(s.tags.map((t) => t.id))
        const merged = [...s.tags]
        allNewTags.forEach((t) => {
          if (!existing.has(t.id)) merged.push(t)
        })
        return { tags: merged }
      })
      autoSaveIfNeeded()
    },
    setAutoSaveEnabled: (v) => {
      set({ autoSaveEnabled: v })
      saveAutoSaveSetting(v)
    },

    addPlayer: (player) => {
      set((s) => ({
        players: [
          ...s.players,
          {
            id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nickname: player?.nickname || '',
            contact: player?.contact || '',
            confirmed: player?.confirmed ?? false,
            paid: player?.paid ?? false,
            note: player?.note || '',
            createdAt: Date.now(),
          },
        ],
      }))
      autoSaveIfNeeded()
    },
    removePlayer: (id) => {
      set((s) => ({
        players: s.players.filter((p) => p.id !== id),
      }))
      autoSaveIfNeeded()
    },
    updatePlayer: (id, patch) => {
      set((s) => ({
        players: s.players.map((p) => p.id === id ? { ...p, ...patch } : p),
      }))
      autoSaveIfNeeded()
    },

    saveDraft: (title?) => {
      const state = get()
      const full = snapshotSession(state)
      const data: PosterData = {
        templateType: full.templateType,
        scriptName: full.scriptName,
        shopLocation: full.shopLocation,
        date: full.date,
        duration: full.duration,
        vacancyCount: full.vacancyCount,
        feeRange: full.feeRange,
        tags: full.tags,
        signupCode: full.signupCode,
        players: full.players,
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
      syncSession()
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
      set({
        ...INITIAL_DATA,
        tone: 'neutral',
        channel: 'group',
        currentDraftId: null,
        lastSavedAt: null,
      })
      clearSessionStorage()
    },

    restoreSession: () => {
      const session = loadSessionState()
      if (!session) return false
      const hasAnyContent =
        session.scriptName ||
        session.shopLocation ||
        session.date ||
        session.vacancyCount ||
        session.tags.length > 3 ||
        session.players.length > 0
      if (!hasAnyContent) return false
      const { tone, channel, ...data } = session
      set({ ...data, tone: tone ?? 'neutral', channel: channel ?? 'group' })
      syncSession()
      return true
    },

    clearSessionState: () => {
      clearSessionStorage()
      set({ __sessionRestored: false })
    },
  }
})
