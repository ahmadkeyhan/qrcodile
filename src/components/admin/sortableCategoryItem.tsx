"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, GripVertical } from "lucide-react"
import type { ICategory } from "@/models/Category"

type Category = Omit<ICategory, "createdAt" | "updatedAt"> & { id: string }

interface SortableCategoryItemProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string, name: string) => void
}

export default function SortableCategoryItem({ category, onEdit, onDelete }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className={`overflow-hidden ${isDragging ? "shadow-lg" : ""}`}>
        <CardContent className="p-0">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-grab active:cursor-grabbing p-1 h-auto"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-5 h-5 text-slate-400" />
                <span className="sr-only">Drag to reorder</span>
              </Button>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                <Edit className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(category.id, category.name)}>
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

