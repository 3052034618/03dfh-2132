import { useState, useCallback } from 'react'
import { usePosterStore } from '@/store/usePosterStore'
import { PRESET_TAGS } from '@/types'
import type { Tag } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  X,
  Plus,
  Clock,
  BookOpen,
  Crosshair,
  ShieldAlert,
  PenLine,
  Drama,
  Wifi,
  RefreshCw,
  Puzzle,
  Award,
  Tags,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Crosshair: <Crosshair className="w-3.5 h-3.5" />,
  ShieldAlert: <ShieldAlert className="w-3.5 h-3.5" />,
  PenLine: <PenLine className="w-3.5 h-3.5" />,
  Drama: <Drama className="w-3.5 h-3.5" />,
  Wifi: <Wifi className="w-3.5 h-3.5" />,
  RefreshCw: <RefreshCw className="w-3.5 h-3.5" />,
  Puzzle: <Puzzle className="w-3.5 h-3.5" />,
  Award: <Award className="w-3.5 h-3.5" />,
}

function SortableTag({ tag, onRemove }: { tag: Tag; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'tag-chip bg-accent-gold/15 text-accent-gold-light border border-accent-gold/25',
        isDragging && 'drag-overlay'
      )}
    >
      <span {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-accent-gold/50">
        <GripVertical className="w-3.5 h-3.5" />
      </span>
      {ICON_MAP[tag.icon]}
      <span>{tag.text}</span>
      <button
        onClick={() => onRemove(tag.id)}
        className="ml-0.5 text-accent-gold/40 hover:text-accent-crimson-light transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function TagManager() {
  const { tags, addTag, removeTag, reorderTags } = usePosterStore()
  const [customText, setCustomText] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex((t) => t.id === active.id)
      const newIndex = tags.findIndex((t) => t.id === over.id)
      reorderTags(arrayMove(tags, oldIndex, newIndex))
    }
  }, [tags, reorderTags])

  const handleAddCustom = useCallback(() => {
    const text = customText.trim()
    if (!text) return
    addTag({
      id: `custom-${Date.now()}`,
      text,
      icon: 'Tags',
    })
    setCustomText('')
  }, [customText, addTag])

  const availablePresets = PRESET_TAGS.filter(
    (pt) => !tags.find((t) => t.id === pt.id)
  )

  return (
    <div className="editor-section">
      <h3 className="text-base font-serif font-bold text-accent-gold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-gold rounded-full" />
        报名要求标签
        <span className="text-xs text-text-muted font-normal ml-1">拖拽排序 · 重要的放上面</span>
      </h3>

      {tags.length > 0 && (
        <div className="mb-4 p-3 bg-bg-input rounded-lg border border-border-subtle">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tags.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <SortableTag key={tag.id} tag={tag} onRemove={removeTag} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {availablePresets.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-text-muted mb-1.5">点击添加预设标签：</div>
          <div className="flex flex-wrap gap-1.5">
            {availablePresets.map((pt) => (
              <button
                key={pt.id}
                onClick={() => addTag(pt)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-bg-input border border-border-subtle text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold-light transition-all duration-200"
              >
                <Plus className="w-3 h-3" />
                {pt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="editor-input flex-1"
          placeholder="自定义标签，如「禁玩手机」"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddCustom()
          }}
        />
        <button
          onClick={handleAddCustom}
          disabled={!customText.trim()}
          className="px-4 py-2.5 bg-accent-gold/20 text-accent-gold rounded-lg border border-accent-gold/30 hover:bg-accent-gold/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>
    </div>
  )
}
