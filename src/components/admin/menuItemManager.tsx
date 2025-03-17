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

import ImageUploader from "./imageUploader"
import Image from "next/image"
import { deleteImage } from "@/lib/imageUtils"

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
        const itemToDelete = items.find((item) => item.id === id)
        await deleteMenuItem(id)
        if (itemToDelete?.image) {
          try {
            await deleteImage(itemToDelete.image)
          } catch (error) {
            console.error("Failed to delete image:", error)
          }
        }
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
          <div className="sm:col-span-2">
            <ImageUploader value={newItem.image} onChange={(url) => setNewItem({ ...newItem, image: url })} />
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 ">
          <Plus className="w-4 h-4" />
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
                    <div className="sm:col-span-2">
                      <ImageUploader
                        value={editForm.image}
                        onChange={(url) => setEditForm({ ...editForm, image: url })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row-reverse justify-end gap-2">
                    <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4" />
                      ذخیره
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId("")}>
                      <X className="w-4 h-4" />
                      لغو
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 flex flex-row-reverse gap-4 items-center">
                  {item.image ? (
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="80" />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row-reverse justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-semibold text-amber-700">{formatCurrency(item.price)}</span>
                    </div>
                    <p className="text-sm text-slate-500 text-right">{item.description}</p>
                    <div className="flex flex-row-reverse items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                        {categories.find((c) => c.id === item.categoryId)?.name || "Uncategorized"}
                      </span>
                      {item.ingredients && <span className="text-xs text-slate-400">{item.ingredients}</span>}
                    </div>
                    <div className="flex flex-row-reverse justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-background hover:bg-white"
                        onClick={() => handleEditClick(item)}>
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">ویرایش</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group bg-background hover:bg-red-500" onClick={() => handleDeleteClick(item.id, item.name)}>
                        <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-50" />
                        <span className="sr-only">حذف</span>
                      </Button>
                    </div>
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

