"use client"

import { useState, useEffect, FormEvent } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardContent } from "@/components/ui/card"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/data"
import { toast } from "@/components/ui/useToast"

import mongoose from "mongoose"

interface category {
    id: string, 
    name: string, 
    description: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<category[]>([])
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editingId, setEditingId] = useState<string>("")
  const [editForm, setEditForm] = useState({ name: "", description: "" })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await createCategory(newCategory)
      setNewCategory({ name: "", description: "" })
      loadCategories()
      toast({
        title: "دسته‌بندی‌ ایجاد شد!",
        description: `${newCategory.name} به منو اضافه شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در ایجاد دسته‌بندی‌!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (category: category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, description: category.description })
  }

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await updateCategory(editingId, {...editForm, _id: editingId})
      setEditingId("")
      loadCategories()
      toast({
        title: "دسته‌بندی‌ به‌روزرسانی شد!",
        description: `${editForm.name} به‌روزرسانی شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در به‌روزرسانی دسته‌بندی‌!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`از حذف "${name}" مطمئنید؟`)) {
      try {
        await deleteCategory(id)
        loadCategories()
        toast({
          title: "دسته‌بندی‌ حذف شد!",
          description: `${name} از منو حذف شد.`,
        })
      } catch (error: any) {
        toast({
          title: "خطا در حذف دسته‌بندی‌!",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium">افزودن دسته‌بندی جدید</h3>
        <div className="flex flex-grow w-full gap-4 flex-col sm:flex-row-reverse">
          <div className="w-full">
            <Input
              placeholder="عنوان دسته‌بندی"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div className="w-full">
            <Textarea
              placeholder="توضیحات (اختیاری)"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4" />
          افزودن دسته‌بندی
        </Button>
      </form>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-0">
              {editingId === category.id ? (
                <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        placeholder="عنوان دسته‌بندی"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="توضیحات (اختیاری)"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row-reverse justify-end gap-2">
                    <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      ذخیره
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId("")}>
                      <X className="w-4 h-4 mr-2" />
                      لغو
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 flex flex-row-reverse justify-between items-center">
                  <div className="flex flex-col w-3/4 gap-2">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
                  </div>
                  <div className="flex flex-row-reverse gap-2">
                    <Button variant="outline" size="sm" className="bg-background hover:bg-white" onClick={() => handleEditClick(category)}>
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">ویرایش</span>
                    </Button>
                    <Button variant="outline" size="sm" className="group bg-background hover:bg-red-500" onClick={() => handleDeleteClick(category.id, category.name)}>
                      <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-50" />
                      <span className="sr-only">حذف</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

