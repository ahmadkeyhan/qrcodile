"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { getCategories } from "@/lib/data"
import { getCategoryItems } from "@/lib/data"
import { Badge } from "./ui/badge"
import MenuItemCard from "./menuItemCard"
import MenuItemModal from "./menuItemModal"

interface category {
    id: string, 
    name: string, 
    description: string
}
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

export default function MenuCategories() {
  const [categories, setCategories] = useState<category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>()
  const [items, setItems] = useState<item[]>([])
  const [selectedItem, setSelectedItem] = useState<item|null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories()
      setCategories(data)
      if (data.length > 0) {
        setActiveCategory(data[0].id)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const loadItems = async () => {
      if (activeCategory) {
        setItems([]) // Clear items immediately to show loading state
        const data = await getCategoryItems(activeCategory)
        setItems(data)
        // Add category name to each item
        const currentCategory = categories.find((cat) => cat.id === activeCategory)
        const itemsWithCategory = data.map((item: item) => ({
          ...item,
          categoryName: currentCategory ? currentCategory.name : "",
        }))

        setItems(itemsWithCategory)
      }
    }

    loadItems()
  }, [activeCategory, categories])

  const handleItemClick = (item: item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Optional: delay clearing the selected item to allow for exit animations
    setTimeout(() => setSelectedItem(null), 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all duration-300 snap-start ${
              activeCategory === category.id ? "bg-amber-500 hover:bg-amber-600" : "hover:bg-amber-100 border-amber-200"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
              key={activeCategory}
              initial={{ opacity: 0, position: "absolute", width: "100%" }}
              animate={{ opacity: 1, position: "relative" }}
              exit={{ opacity: 0, position: "absolute", width: "100%" }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} onClick={handleItemClick} />
              ))}
            </motion.div>
        </AnimatePresence>
      </div>
      <MenuItemModal item={selectedItem} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

