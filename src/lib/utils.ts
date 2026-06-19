import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface VacancyParts {
  num: string
  unit: string
}

export function parseVacancy(raw: string): VacancyParts {
  if (!raw) return { num: '', unit: '人' }
  const cleaned = raw.trim()
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*([\u4e00-\u9fa5a-zA-Z]*)/)
  if (!match) return { num: cleaned, unit: '人' }
  const num = match[1]
  let unit = match[2]
  if (!unit || unit === '人' || unit === '位' || unit === '个' || unit === '名' || unit === '员') {
    unit = '人'
  }
  return { num, unit }
}

export function formatVacancyForDisplay(raw: string, preferredUnit?: string): string {
  const { num, unit } = parseVacancy(raw)
  if (!num) return ''
  const finalUnit = preferredUnit || unit
  return num + finalUnit
}

export function formatVacancyNumOnly(raw: string): string {
  const { num } = parseVacancy(raw)
  return num
}

export function splitRequirementsToTags(text: string): string[] {
  if (!text.trim()) return []
  const parts = text
    .split(/[,，、；;。\n\r\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 30)
  return parts.slice(0, 30)
}

export type CopyTone = 'neutral' | 'archive' | 'wanted' | 'ticket'
export type CopyChannel = 'moment' | 'group' | 'xhs'

export interface CopyToneInfo {
  key: CopyTone
  name: string
  desc: string
}

export interface CopyChannelInfo {
  key: CopyChannel
  name: string
  desc: string
  icon: string
}

export const COPY_TONES: CopyToneInfo[] = [
  { key: 'neutral', name: '标准说明', desc: '清晰明了，适合任何场合' },
  { key: 'archive', name: '冷峻档案', desc: 'FBI机密档案风格，神秘严肃' },
  { key: 'wanted', name: '侦探通缉令', desc: '悬赏抓捕风格，有戏剧张力' },
  { key: 'ticket', name: '复古车票', desc: '一张车票，带你驶向真相' },
]

export const COPY_CHANNELS: CopyChannelInfo[] = [
  { key: 'moment', name: '朋友圈', desc: '精炼有格调 · 带话题标签', icon: '📸' },
  { key: 'group', name: '微信群', desc: '信息密集快速 · 适合群聊刷屏', icon: '💬' },
  { key: 'xhs', name: '小红书', desc: '有标题有表情 · 适合种草', icon: '📕' },
]

export interface CopyData {
  scriptName: string
  shopLocation: string
  date: string
  duration: string
  vacancyCount: string
  feeRange: string
  tags: { text: string }[]
  signupCode: string
}

export function generateCopy(data: CopyData, tone: CopyTone, channel: CopyChannel = 'group'): string {
  const { scriptName, shopLocation, date, duration, vacancyCount, feeRange, tags, signupCode } = data
  const v = formatVacancyNumOnly(vacancyCount)

  if (tone === 'archive') {
    const lines: string[] = []
    if (channel === 'xhs') {
      lines.push('🚨 机密档案｜硬核推理招募🚨')
      lines.push('')
    }
    if (channel !== 'moment') {
      lines.push('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')
      lines.push('[ 机密档案 DEPT. OF REASONING ]')
      lines.push('FILE NO. ' + String(Math.floor(Math.random() * 9000 + 1000)))
      lines.push('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')
      lines.push('')
    } else {
      lines.push('【机密档案·硬核推理招募】')
      lines.push('')
    }
    lines.push('项目代号：' + (scriptName || '[已加密]'))
    if (shopLocation) lines.push('执行地点：' + shopLocation)
    if (date) lines.push('行动日期：' + date)
    if (duration) lines.push('预计时长：' + duration)
    if (v) lines.push('空缺特工：' + v + ' 名')
    if (feeRange) lines.push('行动经费：' + feeRange)
    lines.push('')
    if (tags.length > 0) {
      lines.push('【准入条件】LEVEL ' + String(tags.length).padStart(2, '0'))
      tags.forEach((t, i) => {
        lines.push(`  ${String(i + 1).padStart(2, '0')}. ${t.text}`)
      })
      lines.push('')
    }
    if (signupCode) {
      lines.push('【接驳暗号】')
      lines.push('  ' + signupCode)
      lines.push('')
    }
    if (channel === 'moment') {
      lines.push('CLASSIFIED · 非资深玩家勿扰')
    } else if (channel === 'xhs') {
      lines.push('CLASSIFIED · UNAUTHORIZED ACCESS PROHIBITED')
      lines.push('')
      lines.push('#剧本杀 #硬核推理 #硬核本 #剧本杀拼车 #推理本')
    } else {
      lines.push('CLASSIFIED · UNAUTHORIZED ACCESS PROHIBITED')
      lines.push('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')
    }
    return lines.join('\n')
  }

  if (tone === 'wanted') {
    const lines: string[] = []
    if (channel === 'xhs') {
      lines.push('🔍 悬赏通缉｜寻找硬核推理高手 🔍')
      lines.push('')
    }
    if (channel === 'group') {
      lines.push('═════════════════════════')
      lines.push('       🔍 W A N T E D 🔍')
      lines.push('═════════════════════════')
      lines.push('')
    } else if (channel === 'moment') {
      lines.push('【WANTED·悬赏缉拿】')
      lines.push('')
    }
    lines.push('【悬赏目标】' + (scriptName || '推理高手一名'))
    lines.push('')
    if (shopLocation) lines.push('📍 设伏地点：' + shopLocation)
    if (date) lines.push('📅 围捕日期：' + date)
    if (duration) lines.push('⏱ 审讯时长：' + duration)
    if (v) lines.push('👥 在逃人数：还差 ' + v + ' 人')
    if (feeRange) lines.push('💰 悬赏金额：' + feeRange)
    lines.push('')
    if (tags.length > 0) {
      lines.push('【罪犯特征】请留意以下特征：')
      tags.forEach((t) => {
        lines.push(`  ✦ ${t.text}`)
      })
      lines.push('')
    }
    if (signupCode) {
      lines.push('【接头暗号】请按此格式对答：')
      lines.push('  🎙️ ' + signupCode)
      lines.push('')
    }
    if (channel === 'moment') {
      lines.push('REWARD: 一车好局 · 线索请自投罗网')
    } else if (channel === 'xhs') {
      lines.push('═════════════════════════')
      lines.push('REWARD: 一车好局 · 请速速自投罗网')
      lines.push('')
      lines.push('#剧本杀 #硬核本 #硬核推理 #剧本杀拼车 #推理')
    } else {
      lines.push('═════════════════════════')
      lines.push('  REWARD: 一车好局 · 线索请自投罗网')
      lines.push('═════════════════════════')
    }
    return lines.join('\n')
  }

  if (tone === 'ticket') {
    const lines: string[] = []
    if (channel === 'xhs') {
      lines.push('🎟 硬核推理专线｜一张车票驶向真相 🎟')
      lines.push('')
    }
    if (channel === 'group') {
      lines.push('┌─────────────────────────┐')
      lines.push('│   硬核推理专线 · 单程票  │')
      lines.push('└─────────────────────────┘')
      lines.push('')
    } else if (channel === 'moment') {
      lines.push('🎟 【一张车票·驶向真相】')
      lines.push('')
    }
    lines.push('🎟 班次：' + (scriptName || '神秘班次'))
    lines.push('')
    if (shopLocation) lines.push('🚉 出发站：' + shopLocation)
    if (date) lines.push('📅 发车日：' + date)
    if (duration) lines.push('⏱ 行程：' + duration)
    if (v) lines.push('🎫 余票：' + v + ' 张')
    if (feeRange) lines.push('💴 票价：' + feeRange)
    lines.push('')
    if (tags.length > 0) {
      lines.push('【乘车须知】请确认具备：')
      tags.forEach((t) => {
        lines.push('  ▸ ' + t.text)
      })
      lines.push('')
    }
    if (signupCode) {
      lines.push('【验票口令】检票时请说：')
      lines.push('  🎤 ' + signupCode)
      lines.push('')
    }
    if (channel === 'moment') {
      lines.push('⛔ NO VALID WITHOUT SEAL ⛔')
      lines.push('一张车票，一车好局')
    } else if (channel === 'xhs') {
      lines.push('─── ⛔ NO VALID WITHOUT SEAL ⛔ ───')
      lines.push('一张车票，驶向真相。请持票上车🎫')
      lines.push('')
      lines.push('#剧本杀 #硬核推理 #硬核本 #拼车 #车票系列')
    } else {
      lines.push('─── ⛔ NO VALID WITHOUT SEAL ⛔ ───')
      lines.push('        一张车票，驶向真相')
    }
    return lines.join('\n')
  }

  if (channel === 'moment') {
    const lines: string[] = []
    lines.push('🔍 【硬核推理车队招募】 ' + (scriptName ? '《' + scriptName + '》' : ''))
    lines.push('')
    if (date) lines.push('📅 ' + date + (duration ? ' ｜ ' + duration : ''))
    if (shopLocation) lines.push('📍 ' + shopLocation)
    if (v) lines.push('👥 空缺：' + v + '人')
    if (feeRange) lines.push('💰 ' + feeRange)
    lines.push('')
    if (tags.length > 0) {
      lines.push('【报名要求】')
      tags.forEach((t) => lines.push('  · ' + t.text))
      lines.push('')
    }
    if (signupCode) {
      lines.push('【报名暗号】')
      lines.push('  ' + signupCode)
      lines.push('')
    }
    lines.push('符合条件的朋友速来～')
    return lines.join('\n')
  }

  if (channel === 'xhs') {
    const lines: string[] = []
    lines.push('🔍 剧本杀拼车｜硬核推理本寻找资深玩家' + (scriptName ? '《' + scriptName + '》' : ''))
    lines.push('')
    lines.push('终于等到这个本！想凑一车真正的硬核玩家，拒绝划水，拒绝跳车。')
    lines.push('')
    lines.push('📒 基本信息：')
    if (scriptName) lines.push('  ▸ 剧本：' + scriptName)
    if (date) lines.push('  ▸ 时间：' + date + (duration ? ' (' + duration + ')' : ''))
    if (shopLocation) lines.push('  ▸ 地点：' + shopLocation)
    if (v) lines.push('  ▸ 车位：还差 ' + v + ' 人')
    if (feeRange) lines.push('  ▸ 费用：' + feeRange)
    lines.push('')
    if (tags.length > 0) {
      lines.push('✅ 对车友的期望：')
      tags.forEach((t) => lines.push('  ▸ ' + t.text))
      lines.push('')
    }
    if (signupCode) {
      lines.push('💌 报名方式：')
      lines.push('  请按以下格式私信我：')
      lines.push('  「' + signupCode + '」')
      lines.push('')
    }
    lines.push('希望能凑到一车热爱推理的朋友，一起盘个爽！')
    lines.push('')
    lines.push('#剧本杀 #硬核本 #硬核推理 #剧本杀拼车 #推理本 ' + (scriptName ? '#' + scriptName.replace(/\s+/g, '') : ''))
    return lines.join('\n')
  }

  const lines: string[] = []
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('🔍 硬核推理车队招募')
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('')
  if (scriptName) lines.push('📖 剧本：' + scriptName)
  if (shopLocation) lines.push('📍 地点：' + shopLocation)
  if (date) lines.push('📅 日期：' + date)
  if (duration) lines.push('⏱ 时长：' + duration)
  if (v) lines.push('👥 空缺：' + v + '人')
  if (feeRange) lines.push('💰 车费：' + feeRange)
  lines.push('')
  if (tags.length > 0) {
    lines.push('📋 报名要求：')
    tags.forEach((tag, i) => {
      lines.push('  ' + (i + 1) + '. ' + tag.text)
    })
    lines.push('')
  }
  if (signupCode) {
    lines.push('🔑 报名暗号：')
    lines.push('  ' + signupCode)
    lines.push('')
  }
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('符合条件的玩家速来！')
  return lines.join('\n')
}

export interface PrecheckItem {
  key: string
  label: string
  filled: boolean
}

export function runPrecheck(data: CopyData): PrecheckItem[] {
  return [
    { key: 'scriptName', label: '剧本名称', filled: !!data.scriptName.trim() },
    { key: 'shopLocation', label: '店铺位置', filled: !!data.shopLocation.trim() },
    { key: 'date', label: '开车日期', filled: !!data.date.trim() },
    { key: 'vacancyCount', label: '空缺人数', filled: !!data.vacancyCount.trim() },
    { key: 'feeRange', label: '车费范围', filled: !!data.feeRange.trim() },
    { key: 'signupCode', label: '报名暗号', filled: !!data.signupCode.trim() },
    { key: 'tags', label: '报名要求标签', filled: data.tags.length > 0 },
  ]
}
