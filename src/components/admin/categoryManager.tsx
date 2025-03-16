"use client"

import { useState, useEffect, FormEvent } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardContent } from "@/components/ui/card"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/data"
import { toast } from "@/components/ui/useToast"

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
        title: "Category created",
        description: `${newCategory.name} has been added to your menu.`,
      })
    } catch (error: any) {
      toast({
        title: "Error creating category",
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
      await updateCategory(editingId, editForm)
      setEditingId("")
      loadCategories()
      toast({
        title: "Category updated",
        description: `${editForm.name} has been updated.`,
      })
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCategory(id)
        loadCategories()
        toast({
          title: "Category deleted",
          description: `${name} has been removed from your menu.`,
        })
      } catch (error: any) {
        toast({
          title: "Error deleting category",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium">Add New Category</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
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
                        placeholder="Category Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description (optional)"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId("")}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(category)}>
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(category.id, category.name)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="sr-only">Delete</span>
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

