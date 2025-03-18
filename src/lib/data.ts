"use server"

import connectToDatabase from "./mongodb"
import { Category, ICategory } from "../models/Category"
import { MenuItem, IMenuItem } from "../models/MenuItem"
import mongoose from "mongoose"

// Category CRUD operations
export async function getCategories() {
  try {
    await connectToDatabase()
    const categories = await Category.find().sort({ order: 1, name: 1 })
    return JSON.parse(JSON.stringify(categories))
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

export async function createCategory(categoryData: ICategory) {
  try {
    await connectToDatabase()
    const newCategory = new Category({...categoryData,_id: new mongoose.Types.ObjectId()})
    await newCategory.save()
    return JSON.parse(JSON.stringify(newCategory))
  } catch (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }
}

export async function updateCategory(id: string, categoryData: ICategory) {
  try {
    await connectToDatabase()
    const category = await Category.findByIdAndUpdate(id, { $set: categoryData }, { new: true, runValidators: true })

    if (!category) {
      throw new Error("Category not found")
    }

    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDatabase()
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Delete the category
      const deletedCategory = await Category.findByIdAndDelete(id).session(session)
      if (!deletedCategory) {
        throw new Error("Category not found")
      }

      // Delete all menu items in this category
      await MenuItem.deleteMany({ categoryId: id }).session(session)

      await session.commitTransaction()
      return { success: true }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }
}

export async function reorderCategories(orderedIds: string[]) {
  console.log(orderedIds)
  try {
    await connectToDatabase()

    // Update each category with its new order
    const updatePromises = orderedIds.map((id, index) => {
      return Category.findByIdAndUpdate(id, { order: index })
    })

    await Promise.all(updatePromises)

    return { success: true, message: "Categories reordered successfully" }
  } catch (error) {
    console.error("Error reordering categories:", error)
    throw new Error("Failed to reorder categories")
  }
}

// Menu Item CRUD operations
export async function getMenuItems() {
  try {
    await connectToDatabase()
    const menuItems = await MenuItem.find().sort({ name: 1 })
    return JSON.parse(JSON.stringify(menuItems))
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw new Error("Failed to fetch menu items")
  }
}

export async function getCategoryItems(categoryId:IMenuItem["categoryId"]) {
  try {
    await connectToDatabase()
    const items = await MenuItem.find({ categoryId }).sort({ name: 1 })
    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error("Error fetching category items:", error)
    throw new Error("Failed to fetch category items")
  }
}

export async function createMenuItem(itemData: IMenuItem) {
  try {
    await connectToDatabase()
    const newItem = new MenuItem({...itemData, _id: new mongoose.Types.ObjectId()})
    await newItem.save()
    return JSON.parse(JSON.stringify(newItem))
  } catch (error) {
    console.error("Error creating menu item:", error)
    throw new Error("Failed to create menu item")
  }
}

export async function updateMenuItem(id: string, itemData: IMenuItem) {
  try {
    await connectToDatabase()
    const item = await MenuItem.findByIdAndUpdate(id, { $set: itemData }, { new: true, runValidators: true })

    if (!item) {
      throw new Error("Menu item not found")
    }

    return JSON.parse(JSON.stringify(item))
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw new Error("Failed to update menu item")
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await connectToDatabase()
    const deletedItem = await MenuItem.findByIdAndDelete(id)

    if (!deletedItem) {
      throw new Error("Menu item not found")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw new Error("Failed to delete menu item")
  }
}

