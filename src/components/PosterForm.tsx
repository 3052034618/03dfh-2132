import { usePosterStore } from '@/store/usePosterStore'
import { BookOpen, MapPin, Calendar, Clock, Users, Coins } from 'lucide-react'

const FIELDS = [
  {
    key: 'scriptName' as const,
    label: '剧本名称',
    placeholder: '例如：年轮、虚构推理、死者在幻夜中醒来',
    icon: <BookOpen className="w-4 h-4" />,
    setter: 'setScriptName' as const,
  },
  {
    key: 'shopLocation' as const,
    label: '店铺位置',
    placeholder: '例如：朝阳区望京XX剧本杀',
    icon: <MapPin className="w-4 h-4" />,
    setter: 'setShopLocation' as const,
  },
  {
    key: 'date' as const,
    label: '开车日期',
    placeholder: '选择日期',
    icon: <Calendar className="w-4 h-4" />,
    type: 'date' as const,
    setter: 'setDate' as const,
  },
  {
    key: 'duration' as const,
    label: '预计时长',
    placeholder: '例如：5-6小时',
    icon: <Clock className="w-4 h-4" />,
    setter: 'setDuration' as const,
  },
  {
    key: 'vacancyCount' as const,
    label: '空缺人数',
    placeholder: '例如：3人',
    icon: <Users className="w-4 h-4" />,
    setter: 'setVacancyCount' as const,
  },
  {
    key: 'feeRange' as const,
    label: '车费范围',
    placeholder: '例如：88-128元/人',
    icon: <Coins className="w-4 h-4" />,
    setter: 'setFeeRange' as const,
  },
]

export default function PosterForm() {
  const store = usePosterStore()

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        填写发车信息
      </h3>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="editor-label flex items-center gap-1.5">
              <span className="text-accent-gold/70">{f.icon}</span>
              {f.label}
            </label>
            <input
              type={f.type || 'text'}
              className="editor-input"
              placeholder={f.placeholder}
              value={store[f.key]}
              onChange={(e) => store[f.setter](e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
