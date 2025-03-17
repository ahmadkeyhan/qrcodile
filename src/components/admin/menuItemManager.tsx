"use client"

import { useState, useEffect, FormEvent } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCategories, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/useToast"
import mongoose from "mongoose"

interface item {
    id: string,
    name: string,
    description: string,
    price: number,
    categoryId: string,
    ingredients: string,
    image: string,
}

interface category {
    id: string, 
    name: string, 
    description: string
}

export default function MenuItemManager() {
  const [items, setItems] = useState<item[]>([])
  const [categories, setCategories] = useState<category[]>([])
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    ingredients: "",
    image: "",
  })
  const [editingId, setEditingId] = useState<string>("")
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    ingredients: "",
    image: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [itemsData, categoriesData] = await Promise.all([getMenuItems(), getCategories()])
    setItems(itemsData)
    setCategories(categoriesData)
  }

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const formattedItem = {
        ...newItem,
        price: Number.parseFloat(newItem.price)
      }
      await createMenuItem(formattedItem)
      setNewItem({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        ingredients: "",
        image: "",
      })
      loadData()
      toast({
        title: "آیتم ایجاد شد!",
        description: `${newItem.name} به منو اضافه شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در ایجاد آیتم!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (item: item) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      ingredients: item.ingredients || "",
      image: item.image || "",
    })
  }

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
        //not sure about the id assignment
      const formattedItem = {
        ...editForm,
        _id: editingId,
        price: Number.parseFloat(editForm.price),
      }
      await updateMenuItem(editingId, formattedItem)
      setEditingId("")
      loadData()
      toast({
        title: "آیتم به‌روزرسانی شد!",
        description: `${editForm.name} به‌روزرسانی شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در به‌روزرسانی آیتم!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`از حذف "${name}" مطمئنید؟`)) {
      try {
        await deleteMenuItem(id)
        loadData()
        toast({
          title: "آیتم حذف شد!",
          description: `${name} از منو حذف شد.`,
        })
      } catch (error: any) {
        toast({
          title: "خطا در حذف آیتم!",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium">افزودن آیتم‌ جدید</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              placeholder="عنوان آیتم"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="قیمت"
              type="number"
              step="0.01"
              min="0"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              placeholder="توضیحات"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="مواد تشکیل دهنده (اختیاری)"
              value={newItem.ingredients}
              onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="آدرس تصویر (اختیاری)"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              value={newItem.categoryId}
              onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          افزودن آیتم به منو
        </Button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              {editingId === item.id ? (
                <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        placeholder="عنوان آیتم"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="قیمت"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea
                        placeholder="توضیحات"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="مواد تشکیل دهنده (اختیاری)"
                        value={editForm.ingredients}
                        onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="آدرس تصویر (اختیاری)"
                        value={editForm.image}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Select
                        value={editForm.categoryId}
                        onValueChange={(value) => setEditForm({ ...editForm, categoryId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب دسته‌بندی" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-semibold text-amber-700">{formatCurrency(item.price)}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                        {categories.find((c) => c.id === item.categoryId)?.name || "Uncategorized"}
                      </span>
                      {item.ingredients && <span className="text-xs text-slate-400 truncate">{item.ingredients}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">ویرایش</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item.id, item.name)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
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

