"use client"

import type React from "react"
import { useState, useEffect, FormEvent } from "react"
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp, LucideListStart } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  getCategories, 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  reorderMenuItems
} from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/useToast"

import ImageUploader from "./imageUploader"
import Image from "next/image"
import SortableMenuItem from "./sortableMenuItem"
import { deleteImage } from "@/lib/imageUtils"

interface item {
    id: string,
    name: string,
    description: string,
    price: number,
    categoryId: string,
    ingredients: string,
    image: string,
    order: number
}

interface category {
    id: string, 
    name: string, 
    description: string,
    order: number
}

interface groupedItems {
  [categoryId: string]: item[]
}

export default function MenuItemManager() {
  const [items, setItems] = useState<item[]>([])
  const [groupedItems,setGroupedItems] = useState<groupedItems>({})
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
  const [isReordering, setIsReordering] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Group items by category
    const grouped: groupedItems = {}

    items.forEach((item) => {
      const categoryId = item.categoryId as string
      if (!grouped[categoryId]) {
        grouped[categoryId] = []
      }
      grouped[categoryId].push(item)
    })

    // Sort items within each category by order
    Object.keys(grouped).forEach((categoryId) => {
      grouped[categoryId].sort((a, b) => (a.order || 0) - (b.order || 0))
    })

    setGroupedItems(grouped)

    // Expand all categories by default
    if (categories.length > 0) {
      const newExpanded = new Set<string>()
      categories.forEach((category) => newExpanded.add(category.id))
      setExpandedCategories(newExpanded)
    }
  }, [items, categories])

  const loadData = async () => {
    const [itemsData, categoriesData] = await Promise.all([getMenuItems(), getCategories()])
    setItems(itemsData)
    setCategories(categoriesData)
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
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
      await loadData()
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && isReordering) {
      try {
        // Find the category items
        const categoryItems = groupedItems[isReordering] || []

        // Calculate the new order of items
        const oldIndex = categoryItems.findIndex((item) => item.id === active.id)
        const newIndex = categoryItems.findIndex((item) => item.id === over.id)

        // Create the new array with the updated order
        const updatedItems = arrayMove([...categoryItems], oldIndex, newIndex)

        // Update the local state for immediate feedback
        const newGroupedItems = { ...groupedItems }
        newGroupedItems[isReordering] = updatedItems
        setGroupedItems(newGroupedItems)

        // Update the items array to reflect the new order
        const newItems = [...items]
        const itemsToUpdate = newItems.filter((item) => item.categoryId === isReordering)

        // Remove the items from this category
        const otherItems = newItems.filter((item) => item.categoryId !== isReordering)

        // Create a mapping of id to new order
        const orderMap = new Map()
        updatedItems.forEach((item, index) => {
          if (item.id) {
            orderMap.set(item.id, index)
          }
        })

        // Update the order of the items
        itemsToUpdate.forEach((item) => {
          if (item.id && orderMap.has(item.id)) {
            item.order = orderMap.get(item.id)
          }
        })

        // Combine the updated items with the other items
        setItems([...otherItems, ...itemsToUpdate])

        // Get the ordered IDs from the updated array
        const orderedIds = updatedItems.map((item) => item.id as string)

        // Save the new order to the database directly
        await reorderMenuItems(isReordering, orderedIds)

        toast({
          title: "Menu items reordered",
          description: "The order of menu items has been updated.",
        })
      } catch (error: any) {
        // If there's an error, reload the original order
        loadData()

        toast({
          title: "Error reordering menu items",
          description: error.message || "Failed to update menu item order",
          variant: "destructive",
        })
      } finally {
        setIsReordering(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium">افزودن آیتم‌ جدید</h3>
        <div className="flex flex-col w-full flex-grow gap-4 sm:flex-row-reverse sm:flex-wrap">
          <div className="sm:w-[calc(50%-0.5rem)]">
            <Input
              placeholder="عنوان آیتم"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </div>
          <div className="sm:w-[calc(50%-0.5rem)]">
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
          <div className="sm:w-[calc(50%-0.5rem)]">
            <Textarea
              placeholder="توضیحات"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              required
            />
          </div>
          <div className="sm:w-[calc(50%-0.5rem)]">
            <Input
              placeholder="مواد تشکیل دهنده (اختیاری)"
              value={newItem.ingredients}
              onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
            />
          </div>
          <div className="sm:w-[calc(50%-0.5rem)]">
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
            <ImageUploader key={`new-item-uploader-${newItem.image}`} value={newItem.image} onChange={(url) => setNewItem({ ...newItem, image: url })} />
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 ">
          <Plus className="w-4 h-4" />
          افزودن آیتم به منو
        </Button>
      </form>

      <div className="space-y-4">
        {/* {items.map((item) => ( */}
        {categories.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No categories yet. Please create a category first.</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryItems = groupedItems[category.id] || []
            const isExpanded = expandedCategories.has(category.id)

            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="py-3 px-4 cursor-pointer" onClick={() => toggleCategory(category.id)}>
                  <div className="flex flex-row-reverse justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      {category.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 pb-3">
                    {categoryItems.length === 0 ? (
                      <div className="text-center py-4 text-slate-500">
                        <p>No items in this category yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-row-reverse justify-between items-center mb-2">
                          {isReordering === category.id ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsReordering(null)}
                            >
                              <X className="w-4 h-4" />
                              انصراف
                            </Button>
                          ) : categoryItems.length > 1 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsReordering(category.id)}
                              disabled={isReordering !== null}
                            >
                              <LucideListStart className="h-5 w-5" />
                              <p>تغییر ترتیب لیست</p>
                            </Button>
                          ) : null}
                        </div>

                        {isReordering === category.id ? (
                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                              items={categoryItems.map((item) => item.id as string)}
                              strategy={verticalListSortingStrategy}
                            >
                              {categoryItems.map((item) => (
                                <SortableMenuItem
                                  key={item.id}
                                  item={item}
                                  category={category}
                                  onEdit={handleEditClick}
                                  onDelete={handleDeleteClick}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        ) : (
                          <div className="space-y-3">
                            {categoryItems.map((item) =>
                              editingId === item.id ? (
                                <Card key={item.id} className="overflow-hidden">
                                  <CardContent className="p-0">
              {/* {editingId === item.id ? ( */}
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
              </CardContent>
            </Card>
          ) : (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
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
                    {item.ingredients && (
                      <span className="text-xs text-slate-400">{item.ingredients}</span>
                    )}
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
              </CardContent>
            </Card>
          ),
        )}
      </div>
    )}
                </div>
              )}
            </CardContent>
                )}
          </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

