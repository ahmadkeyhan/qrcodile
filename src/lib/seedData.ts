import connectToDatabase from "./mongodb"
import { Category } from "../models/Category"
import { MenuItem } from "../models/MenuItem"

const categories = [
  { name: "Coffee", description: "Hot and cold coffee beverages" },
  { name: "Tea", description: "Relaxing tea options" },
  { name: "Pastries", description: "Freshly baked goods" },
  { name: "Sandwiches", description: "Savory lunch options" },
]

async function seedDatabase() {
  try {
    await connectToDatabase()

    // Check if we already have data
    const categoryCount = await Category.countDocuments()
    if (categoryCount > 0) {
      console.log("Database already seeded")
      return
    }

    // Insert categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`${createdCategories.length} categories created`)

    // Create menu items
    const menuItems = [
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk and a deep layer of foam",
        price: 4.5,
        categoryId: createdCategories[0]._id,
        ingredients: "Espresso, milk",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Latte",
        description: "Espresso with steamed milk and a light layer of foam",
        price: 4.75,
        categoryId: createdCategories[0]._id,
        ingredients: "Espresso, milk",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Earl Grey",
        description: "Black tea with bergamot oil",
        price: 3.5,
        categoryId: createdCategories[1]._id,
        ingredients: "Black tea, bergamot",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Croissant",
        description: "Buttery, flaky pastry",
        price: 3.25,
        categoryId: createdCategories[2]._id,
        ingredients: "Flour, butter, yeast",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        name: "Avocado Toast",
        description: "Sourdough toast with smashed avocado and seasonings",
        price: 8.5,
        categoryId: createdCategories[3]._id,
        ingredients: "Sourdough bread, avocado, salt, pepper, olive oil",
        image: "/placeholder.svg?height=80&width=80",
      },
    ]

    const createdItems = await MenuItem.insertMany(menuItems)
    console.log(`${createdItems.length} menu items created`)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

export default seedDatabase

