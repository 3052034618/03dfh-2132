export type TemplateType = 'archive' | 'wanted' | 'ticket'

export interface Tag {
  id: string
  text: string
  icon: string
}

export interface Player {
  id: string
  nickname: string
  contact: string
  confirmed: boolean
  paid: boolean
  note?: string
  createdAt: number
}

export interface PosterData {
  templateType: TemplateType
  scriptName: string
  shopLocation: string
  date: string
  duration: string
  vacancyCount: string
  feeRange: string
  tags: Tag[]
  signupCode: string
  players: Player[]
}

export const PRESET_TAGS: Tag[] = [
  { id: 'tag-timeline', text: '能做时间线', icon: 'Clock' },
  { id: 'tag-reading', text: '不怕长阅读', icon: 'BookOpen' },
  { id: 'tag-method', text: '接受盘凶盘手法', icon: 'Crosshair' },
  { id: 'tag-nolate', text: '禁迟到鸽子', icon: 'ShieldAlert' },
  { id: 'tag-notes', text: '需要笔记习惯', icon: 'PenLine' },
  { id: 'tag-crossplay', text: '欢迎反串', icon: 'Drama' },
  { id: 'tag-focus', text: '需全程在线', icon: 'Wifi' },
  { id: 'tag-twist', text: '不怕反转多', icon: 'RefreshCw' },
  { id: 'tag-mechanism', text: '能接受机制复杂', icon: 'Puzzle' },
  { id: 'tag-experience', text: '希望有硬核经验', icon: 'Award' },
  { id: 'tag-nophone', text: '禁玩手机', icon: 'ShieldAlert' },
  { id: 'tag-snack', text: '零食饮料全包', icon: 'Award' },
  { id: 'tag-beginner', text: '新手友好', icon: 'Award' },
]

export interface TagCombo {
  id: string
  name: string
  desc: string
  tagIds: string[]
  extraTags?: Omit<Tag, 'id'>[]
}

export const TAG_COMBOS: TagCombo[] = [
  {
    id: 'combo-hardcore',
    name: '硬核老手',
    desc: '时间线·手法·长阅读·经验',
    tagIds: ['tag-timeline', 'tag-reading', 'tag-method', 'tag-experience', 'tag-nolate'],
  },
  {
    id: 'combo-relaxed',
    name: '轻松欢乐',
    desc: '新手友好·零食·不玩手机',
    tagIds: ['tag-focus', 'tag-beginner', 'tag-snack'],
    extraTags: [
      { text: '接受微剧透', icon: 'Drama' },
      { text: '主打氛围', icon: 'Award' },
    ],
  },
  {
    id: 'combo-crossplay',
    name: '反串友好',
    desc: '欢迎反串·不怕反转·笔记',
    tagIds: ['tag-crossplay', 'tag-twist', 'tag-notes', 'tag-nolate'],
  },
  {
    id: 'combo-criminal',
    name: '盘凶重点',
    desc: '手法·机制·反转·全程在线',
    tagIds: ['tag-method', 'tag-mechanism', 'tag-twist', 'tag-focus', 'tag-nolate'],
  },
  {
    id: 'combo-tournament',
    name: '高难度烧脑',
    desc: '全要求拉满，谢绝划水',
    tagIds: [
      'tag-timeline',
      'tag-reading',
      'tag-method',
      'tag-nolate',
      'tag-notes',
      'tag-focus',
      'tag-twist',
      'tag-mechanism',
      'tag-experience',
    ],
  },
]

export const TEMPLATE_META: Record<TemplateType, { name: string; desc: string }> = {
  archive: { name: '冷峻档案风', desc: '机密档案 · CLASSIFIED · 打字机质感' },
  wanted: { name: '侦探通缉令风', desc: 'WANTED · 牛皮纸 · 悬赏令排版' },
  ticket: { name: '复古车票风', desc: '老式车票 · 撕边打孔 · 印章式排版' },
}
