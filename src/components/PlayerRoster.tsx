import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  CreditCard,
  Banknote,
  Edit3,
  X,
  Check,
  UserCheck,
  Phone,
  Copy,
  ListFilter,
} from 'lucide-react'
import { cn, formatVacancyNumOnly, parseVacancy } from '@/lib/utils'
import type { Player } from '@/types'

type RosterFilter = 'all' | 'confirmed' | 'paid' | 'unconfirmed'

const FILTER_TABS: { key: RosterFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'confirmed', label: '已确认' },
  { key: 'paid', label: '已付款' },
  { key: 'unconfirmed', label: '未确认' },
]

interface PlayerRowProps {
  player: Player
  onUpdate: (patch: Partial<Player>) => void
  onRemove: () => void
}

function PlayerRow({ player, onUpdate, onRemove }: PlayerRowProps) {
  const [editing, setEditing] = useState<'none' | 'nickname' | 'contact' | 'note'>('none')
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const startEdit = (field: 'nickname' | 'contact' | 'note') => {
    setEditing(field)
    setValue(player[field] || '')
  }

  const commit = () => {
    if (editing !== 'none') {
      onUpdate({ [editing]: value.trim() })
      setEditing('none')
    }
  }

  const cancel = () => {
    setEditing('none')
  }

  useEffect(() => {
    if (editing !== 'none') {
      setTimeout(() => {
        if (editing === 'note' && textareaRef.current) {
          textareaRef.current.focus()
        } else if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 0)
    }
  }, [editing])

  return (
    <div className="p-2.5 bg-bg-input/60 rounded-lg border border-border-subtle hover:border-text-muted transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <button
          onClick={() => onUpdate({ confirmed: !player.confirmed })}
          className={cn(
            'p-1 rounded transition-colors shrink-0',
            player.confirmed
              ? 'text-green-400 hover:text-green-300'
              : 'text-text-muted hover:text-text-secondary'
          )}
          title={player.confirmed ? '已确认' : '未确认'}
        >
          {player.confirmed ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {editing === 'nickname' ? (
            <input
              ref={inputRef}
              className="w-full bg-bg-hover border border-accent-gold/30 rounded px-2 py-0.5 text-sm text-text-primary outline-none"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') cancel()
              }}
              onBlur={commit}
              placeholder="玩家昵称"
            />
          ) : (
            <div
              onClick={() => startEdit('nickname')}
              className="text-sm text-text-primary font-bold truncate cursor-pointer hover:text-accent-gold-light flex items-center gap-1"
              title="点击编辑昵称"
            >
              {player.nickname || '未命名玩家'}
              <Edit3 className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100" />
            </div>
          )}
        </div>

        <button
          onClick={() => onUpdate({ paid: !player.paid })}
          className={cn(
            'p-1 rounded transition-colors shrink-0',
            player.paid
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-text-muted hover:text-text-secondary'
          )}
          title={player.paid ? '已付款' : '未付款'}
        >
          {player.paid ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
        </button>

        <button
          onClick={onRemove}
          className="p-1 text-text-muted hover:text-accent-crimson-light transition-colors shrink-0"
          title="移出"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-2 mb-1.5 pl-7">
        <Phone className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          {editing === 'contact' ? (
            <input
              ref={inputRef}
              className="w-full bg-bg-hover border border-accent-gold/30 rounded px-2 py-0.5 text-xs text-text-secondary outline-none"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') cancel()
              }}
              onBlur={commit}
              placeholder="联系方式 / 备注"
            />
          ) : (
            <div
              onClick={() => startEdit('contact')}
              className="text-xs text-text-muted truncate cursor-pointer hover:text-text-secondary"
              title="点击编辑联系方式"
            >
              {player.contact || '点击添加联系方式...'}
            </div>
          )}
        </div>
      </div>

      {player.note || editing === 'note' ? (
        <div className="flex items-start gap-2 pl-7">
          <div className="w-3 shrink-0" />
          <div className="flex-1 min-w-0">
            {editing === 'note' ? (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className="w-full bg-bg-hover border border-accent-gold/30 rounded px-2 py-1 text-xs text-text-secondary outline-none resize-none min-h-[48px]"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit()
                    if (e.key === 'Escape') cancel()
                  }}
                  onBlur={commit}
                  placeholder="备注信息..."
                />
                <div className="absolute top-1 right-1 flex gap-0.5">
                  <button
                    onClick={commit}
                    className="p-1 text-green-400 hover:text-green-300"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={cancel}
                    className="p-1 text-text-muted hover:text-text-secondary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => startEdit('note')}
                className="text-[10px] text-accent-gold/60 cursor-pointer hover:text-accent-gold bg-accent-gold/5 rounded px-1.5 py-0.5 border border-accent-gold/10 inline-block"
                title="点击编辑备注"
              >
                {player.note || '+ 加备注'}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="pl-7">
          <button
            onClick={() => startEdit('note')}
            className="text-[10px] text-text-muted hover:text-accent-gold/60 transition-colors"
          >
            + 加备注
          </button>
        </div>
      )}
    </div>
  )
}

export default function PlayerRoster() {
  const { players, addPlayer, removePlayer, updatePlayer, vacancyCount, scriptName } = usePosterStore()
  const [filter, setFilter] = useState<RosterFilter>('all')
  const [copied, setCopied] = useState(false)

  const vacancy = useMemo(() => {
    const num = parseVacancy(vacancyCount).num
    return num ? parseInt(num, 10) : null
  }, [vacancyCount])

  const confirmed = players.filter((p) => p.confirmed).length
  const paid = players.filter((p) => p.paid).length
  const remaining = vacancy !== null ? Math.max(vacancy - players.length, 0) : null
  const overbooked = vacancy !== null ? players.length > vacancy : false

  const filteredPlayers = useMemo(() => {
    switch (filter) {
      case 'confirmed':
        return players.filter((p) => p.confirmed)
      case 'paid':
        return players.filter((p) => p.paid)
      case 'unconfirmed':
        return players.filter((p) => !p.confirmed)
      default:
        return players
    }
  }, [players, filter])

  const buildRosterText = useCallback(() => {
    const title = scriptName ? `【${scriptName}】` : '【成车点名】'
    const lines: string[] = [title]

    const confirmedList = players.filter((p) => p.confirmed)
    const unconfirmedList = players.filter((p) => !p.confirmed)
    const paidList = players.filter((p) => p.paid)

    if (vacancy !== null) {
      lines.push(`目标 ${vacancy} 人，已登记 ${players.length} 人，已确认 ${confirmed} 人，已付款 ${paid} 人，剩余空位 ${remaining} 人`)
    } else {
      lines.push(`已登记 ${players.length} 人，已确认 ${confirmed} 人，已付款 ${paid} 人`)
    }
    lines.push('')

    if (confirmedList.length > 0) {
      lines.push(`✅ 已确认（${confirmedList.length} 人）：`)
      confirmedList.forEach((p, i) => {
        const tag = p.paid ? ' [已付款]' : ''
        const contact = p.contact ? `（${p.contact}）` : ''
        const note = p.note ? ` — ${p.note}` : ''
        lines.push(`${i + 1}. ${p.nickname || '未命名玩家'}${tag}${contact}${note}`)
      })
      lines.push('')
    }

    if (unconfirmedList.length > 0) {
      lines.push(`⏳ 待确认（${unconfirmedList.length} 人）：`)
      unconfirmedList.forEach((p, i) => {
        const contact = p.contact ? `（${p.contact}）` : ''
        const note = p.note ? ` — ${p.note}` : ''
        lines.push(`${i + 1}. ${p.nickname || '未命名玩家'}${contact}${note}`)
      })
      lines.push('')
    }

    if (paidList.length > 0) {
      lines.push(`💰 已付款（${paidList.length} 人）：${paidList.map((p) => p.nickname || '未命名玩家').join('、')}`)
    }

    return lines.join('\n')
  }, [players, scriptName, vacancy, confirmed, paid, remaining])

  const handleCopyRoster = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildRosterText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('复制失败')
    }
  }, [buildRosterText])

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        成车名单
        <span className="text-xs text-text-muted font-normal ml-1">
          已登记 {players.length}{vacancy !== null && ` / 目标 ${vacancy}`}
        </span>
        <button
          onClick={handleCopyRoster}
          disabled={players.length === 0}
          className={cn(
            'ml-auto flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border transition-all',
            players.length === 0
              ? 'bg-bg-input text-text-muted border-border-subtle cursor-not-allowed opacity-50'
              : copied
              ? 'bg-green-900/20 text-green-400 border-green-700/40'
              : 'bg-accent-gold/10 text-accent-gold border-accent-gold/25 hover:bg-accent-gold/20'
          )}
          title="复制群内点名用名单"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? '已复制' : '复制名单'}
        </button>
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2.5 rounded-lg bg-green-900/15 border border-green-800/30 text-center">
          <UserCheck className="w-4 h-4 text-green-400 mx-auto mb-0.5" />
          <div className="text-lg font-bold text-green-400 leading-none">{confirmed}</div>
          <div className="text-[9px] text-green-400/70 mt-0.5">已确认</div>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-900/15 border border-amber-800/30 text-center">
          <CreditCard className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
          <div className="text-lg font-bold text-amber-400 leading-none">{paid}</div>
          <div className="text-[9px] text-amber-400/70 mt-0.5">已付款</div>
        </div>
        <div
          className={cn(
            'p-2.5 rounded-lg text-center border',
            overbooked
              ? 'bg-accent-crimson/15 border-accent-crimson/30'
              : remaining === 0
              ? 'bg-green-900/15 border-green-800/30'
              : 'bg-bg-input border-border-subtle'
          )}
        >
          <Users className={cn(
            'w-4 h-4 mx-auto mb-0.5',
            overbooked ? 'text-accent-crimson-light' : remaining === 0 ? 'text-green-400' : 'text-text-secondary'
          )} />
          <div className={cn(
            'text-lg font-bold leading-none',
            overbooked ? 'text-accent-crimson-light' : remaining === 0 ? 'text-green-400' : 'text-text-primary'
          )}>
            {remaining !== null ? remaining : '?'}
          </div>
          <div className={cn(
            'text-[9px] mt-0.5',
            overbooked ? 'text-accent-crimson-light/70' : remaining === 0 ? 'text-green-400/70' : 'text-text-muted'
          )}>
            {overbooked ? `超员${players.length - (vacancy || 0)}` : remaining === 0 ? '已满员' : '空位'}
          </div>
        </div>
      </div>

      {vacancy !== null && overbooked && (
        <div className="mb-3 p-2 rounded-lg bg-accent-crimson/10 border border-accent-crimson/30 text-[10px] text-accent-crimson-light flex items-start gap-1.5">
          <Users className="w-3 h-3 shrink-0 mt-0.5" />
          <span>
            当前登记人数已超过目标空缺 {vacancy} 人，请确认是否调整空缺数或移除部分玩家。
          </span>
        </div>
      )}

      {vacancy !== null && !overbooked && players.length < vacancy && (
        <div className="mb-3 p-2 rounded-lg bg-accent-gold/8 border border-accent-gold/20 text-[10px] text-accent-gold/80 flex items-start gap-1.5">
          <Users className="w-3 h-3 shrink-0 mt-0.5" />
          <span>
            还差 {remaining} 人成车，空位信息已与海报上的「空缺人数」联动。
          </span>
        </div>
      )}

      {players.length > 0 && (
        <div className="mb-3 flex items-center gap-1 flex-wrap">
          <ListFilter className="w-3 h-3 text-text-muted" />
          {FILTER_TABS.map((tab) => {
            const count = (() => {
              switch (tab.key) {
                case 'all': return players.length
                case 'confirmed': return confirmed
                case 'paid': return paid
                case 'unconfirmed': return players.length - confirmed
              }
            })()
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] border transition-all',
                  filter === tab.key
                    ? 'bg-accent-gold/15 text-accent-gold border-accent-gold/40'
                    : 'bg-bg-input text-text-muted border-border-subtle hover:text-text-secondary hover:border-text-muted'
                )}
              >
                {tab.label}
                <span className="ml-1 text-[9px] opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {filteredPlayers.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {filteredPlayers.map((p) => (
            <PlayerRow
              key={p.id}
              player={p}
              onUpdate={(patch) => updatePlayer(p.id, patch)}
              onRemove={() => removePlayer(p.id)}
            />
          ))}
        </div>
      )}

      {players.length > 0 && filteredPlayers.length === 0 && (
        <div className="mb-3 p-3 text-center rounded-lg bg-bg-input/40 border border-dashed border-border-subtle">
          <div className="text-[11px] text-text-muted">当前筛选下没有玩家</div>
        </div>
      )}

      {players.length === 0 && (
        <div className="mb-3 p-4 text-center rounded-lg bg-bg-input/50 border border-dashed border-border-subtle">
          <div className="text-xs text-text-muted">暂无玩家</div>
          <div className="text-[10px] text-text-muted/60 mt-0.5">点击下方按钮添加已报名玩家</div>
        </div>
      )}

      <button
        onClick={() => addPlayer()}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent-gold/10 text-accent-gold rounded-lg border border-accent-gold/25 hover:bg-accent-gold/20 transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        添加报名玩家
      </button>
    </div>
  )
}
