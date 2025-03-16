// This is a mock data service that would be replaced with a real database in production
// You could use Supabase, Firebase, or any other database service

// In-memory storage
const categories = [
    { id: "1", name: "Coffee", description: "Hot and cold coffee beverages" },
    { id: "2", name: "Tea", description: "Relaxing tea options" },
    { id: "3", name: "Pastries", description: "Freshly baked goods" },
    { id: "4", name: "Sandwiches", description: "Savory lunch options" },
  ]
  
  let menuItems = [
    {
      id: "1",
      name: "Cappuccino",
      description: "Espresso with steamed milk and a deep layer of foam",
      price: 4.5,
      categoryId: "1",
      ingredients: "Espresso, milk",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Latte",
      description: "Espresso with steamed milk and a light layer of foam",
      price: 4.75,
      categoryId: "1",
      ingredients: "Espresso, milk",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Earl Grey",
      description: "Black tea with bergamot oil",
      price: 3.5,
      categoryId: "2",
      ingredients: "Black tea, bergamot",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Croissant",
      description: "Buttery, flaky pastry",
      price: 3.25,
      categoryId: "3",
      ingredients: "Flour, butter, yeast",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      name: "Avocado Toast",
      description: "Sourdough toast with smashed avocado and seasonings",
      price: 8.5,
      categoryId: "4",
      ingredients: "Sourdough bread, avocado, salt, pepper, olive oil",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]
  
  // Helper function to generate IDs
  const generateId = () => Math.random().toString(36).substring(2, 9)
  
  // Category CRUD operations
  export async function getCategories() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...categories]
  }
  
  export async function createCategory(categoryData:{name: string, description: string}) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newCategory = {
      id: generateId(),
      ...categoryData,
    }
    categories.push(newCategory)
    return categoryData
  }
  
  export async function updateCategory(id: string, categoryData:{name: string, description: string}) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = categories.findIndex((cat) => cat.id === id)
    if (index === -1) throw new Error("Category not found")
  
    categories[index] = { ...categories[index], ...categoryData }
    return categories[index]
  }
  
  export async function deleteCategory(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = categories.findIndex((cat) => cat.id === id)
    if (index === -1) throw new Error("Category not found")
  
    categories.splice(index, 1)
    // Also remove or update menu items in this category
    menuItems = menuItems.filter((item) => item.categoryId !== id)
    return { success: true }
  }
  
  // Menu Item CRUD operations
  export async function getMenuItems() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...menuItems]
  }
  
  export async function getCategoryItems(categoryId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return menuItems.filter((item) => item.categoryId === categoryId)
  }
  
  export async function createMenuItem(itemData:{
    name: string,
    description: string,
    price: number,
    categoryId: string,
    ingredients: string,
    image: string,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newItem = {
      id: generateId(),
      ...itemData,
    }
    menuItems.push(newItem)
    return itemData
  }
  
  export async function updateMenuItem(id: string, itemData:{
    id: string,
    name: string,
    description: string,
    price: number,
    categoryId: string,
    ingredients: string,
    image: string,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = menuItems.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Menu item not found")
  
    menuItems[index] = { ...menuItems[index], ...itemData }
    return menuItems[index]
  }
  
  export async function deleteMenuItem(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = menuItems.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Menu item not found")
  
    menuItems.splice(index, 1)
    return { success: true }
  }
  
  