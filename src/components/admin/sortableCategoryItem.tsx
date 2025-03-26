"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, GripVertical } from "lucide-react"
import * as LucideIcons from "lucide-react"
import * as LabIcons from "@lucide/lab"

interface category {
    id: string, 
    name: string, 
    description: string,
    iconName: string,
    order: number
}

interface SortableCategoryItemProps {
  category: category
  onEdit: (category: category) => void
  onDelete: (id: string, name: string) => void
  sortDisabled: boolean
}

export default function SortableCategoryItem({ category, onEdit, onDelete, sortDisabled }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    // Add these properties to improve touch handling
    data: {
      type: "category",
      category,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  // Dynamically get the icon component if iconName exists
  const IconComponent = category.iconName && category.iconName.toLowerCase()[0] !== category.iconName[0] ? (LucideIcons as any)[category.iconName] : null
  const LabIconComponent = category.iconName && category.iconName.toLowerCase()[0] === category.iconName[0] ? (LabIcons as any)[category.iconName] : null

  return (
    <div ref={setNodeRef} style={style} className="mb-3 touch-manipulation">
      <Card className={`overflow-hidden ${isDragging ? "shadow-lg" : ""}`}>
        <CardContent className="p-0">
          <div className="p-3 flex flex-row-reverse justify-between items-center">
            <div className="flex flex-row-reverse items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-grab active:cursor-grabbing p-1 h-auto touch-manipulation"
                {...attributes}
                {...listeners}
                // Add this to prevent default touch behavior on Android
                onTouchStart={(e) => {
                  // Don't prevent default here to allow the touch to be captured
                  // but stop propagation to prevent parent elements from handling it
                  e.stopPropagation()
                }}
                disabled={sortDisabled}
              >
                <GripVertical className="w-5 h-5 text-slate-400" />
                <span className="sr-only">Drag to reorder</span>
              </Button>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row-reverse gap-2">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  {LabIconComponent && <LucideIcons.Icon iconNode={LabIconComponent} className="w-5 h-5" />}
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
              </div>
            </div>
            <div className="flex flex-row-reverse gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                <Edit className="w-4 h-4" />
                <span className="sr-only">ویرایش</span>
              </Button>
              <Button variant="outline" size="sm" className="group hover:bg-red-500" onClick={() => onDelete(category.id, category.name)}>
                <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-50" />
                <span className="sr-only">حذف</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}