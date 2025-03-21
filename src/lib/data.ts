"use server"

import connectToDatabase from "./mongodb"
import { Category, ICategory } from "../models/Category"
import { MenuItem, IMenuItem } from "../models/MenuItem"
import { User, IUser } from "../models/User"
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
    // Updated to sort by categoryId first, then order
    const menuItems = await MenuItem.find().sort({ categoryId: 1, order: 1, name: 1 })
    return JSON.parse(JSON.stringify(menuItems))
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw new Error("Failed to fetch menu items")
  }
}

// Update the getCategoryItems function to filter by available
export async function getCategoryItems(categoryId:IMenuItem["categoryId"]) {
  try {
    await connectToDatabase()
    // Updated to sort by order first, then name, and only return available items for the main page
    const items = await MenuItem.find({ categoryId, available: true }).sort({ order: 1, name: 1 })
    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error("Error fetching category items:", error)
    throw new Error("Failed to fetch category items")
  }
}

// Add a new function to get all items for a category (for admin)
export async function getAllCategoryItems(categoryId: string) {
  try {
    await connectToDatabase()
    // Return all items regardless of availability status
    const items = await MenuItem.find({ categoryId }).sort({ order: 1, name: 1 })
    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error("Error fetching all category items:", error)
    throw new Error("Failed to fetch all category items")
  }
}

export async function createMenuItem(itemData: IMenuItem) {
  try {
    await connectToDatabase()
    // If order is not provided, set it to be the last item in the category
    if (itemData.categoryId && itemData.order === undefined) {
      const lastItem = await MenuItem.findOne({ categoryId: itemData.categoryId }).sort({ order: -1 }).limit(1)

      itemData.order = lastItem ? (lastItem.order || 0) + 1 : 0
    }
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

export async function reorderMenuItems(categoryId: string, orderedIds: string[]) {
  try {
    await connectToDatabase()

    // Update each menu item with its new order
    const updatePromises = orderedIds.map((id, index) => {
      return MenuItem.findByIdAndUpdate(id, { order: index })
    })

    await Promise.all(updatePromises)

    return { success: true, message: "Menu items reordered successfully" }
  } catch (error) {
    console.error("Error reordering menu items:", error)
    throw new Error("Failed to reorder menu items")
  }
}

//User CRUD operations
// Get all users
export async function getUsers() {
  try {
    await connectToDatabase()
    const users = await User.find().sort({ name: 1 })
    return JSON.parse(JSON.stringify(users))
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

// Create a new user
export async function createUser(userData: IUser) {
  try {
    await connectToDatabase()
    const newUser = new User({...userData, _id: new mongoose.Types.ObjectId()})
    await newUser.save()
    return JSON.parse(JSON.stringify(newUser))
  } catch (error: any) {
    console.error("Error creating user:", error)
    if (error.code === 11000) {
      throw new Error("Username already exists")
    }
    throw new Error("Failed to create user")
  }
}

// Update a user
export async function updateUser(id: string, userData: Partial<{
  name: string
  email: string
  password: string
  role: "admin" | "employee"
}>) {
  try {
    await connectToDatabase()

    // If password is being updated, we need to handle it specially
    if (userData.password) {
      // Find the user first
      const user = await User.findById(id)
      if (!user) {
        throw new Error("User not found")
      }

      // Update user fields
      if (userData.name) user.name = userData.name
      if (userData.email) user.email = userData.email
      if (userData.role) user.role = userData.role

      // Set the password - it will be hashed by the pre-save hook
      user.password = userData.password

      // Save the user to trigger the pre-save hook
      await user.save()
      return JSON.parse(JSON.stringify(user))
    } else {
      // For non-password updates, we can use findByIdAndUpdate
      const user = await User.findByIdAndUpdate(id, { $set: userData }, { new: true, runValidators: true })

      if (!user) {
        throw new Error("User not found")
      }

      return JSON.parse(JSON.stringify(user))
    }
  } catch (error: any) {
    console.error("Error updating user:", error)
    if (error.code === 11000) {
      throw new Error("Username already exists")
    }
    throw new Error(error.message || "Failed to update user")
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      throw new Error("User not found")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

