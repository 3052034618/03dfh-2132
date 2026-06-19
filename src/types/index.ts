export type TemplateType = 'archive' | 'wanted' | 'ticket'

export interface Tag {
  id: string
  text: string
  icon: string
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
]

export const TEMPLATE_META: Record<TemplateType, { name: string; desc: string }> = {
  archive: { name: '冷峻档案风', desc: '机密档案 · CLASSIFIED · 打字机质感' },
  wanted: { name: '侦探通缉令风', desc: 'WANTED · 牛皮纸 · 悬赏令排版' },
  ticket: { name: '复古车票风', desc: '老式车票 · 撕边打孔 · 印章式排版' },
}
