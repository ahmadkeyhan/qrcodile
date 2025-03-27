"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getCategoryItems } from "@/lib/data";
import MenuItemCard from "./menuItemCard";
import MenuItemModal from "./menuItemModal";
import * as LucideIcons from "lucide-react";
import * as LabIcons from "@lucide/lab";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}
interface item {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  ingredients: string;
  image: string;
  order: number;
}

interface categoryItems {
  [key : string] : item[]
}


// Animation variants for menu items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Loading spinner animation variants
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1,
      ease: "linear",
    },
  },
}

export default function MenuCategories() {
  const [categories, setCategories] = useState<category[]>([]);
  const [categoryItems, setCategoryItems] = useState<categoryItems>({})
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(new Set())
  const [openCategories, setOpenCategories] = useState<string[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadItemsForCategories = async () => {
      // Find categories that are open but don't have items loaded yet
      const categoriesToLoad = openCategories.filter(
        (categoryId) => !categoryItems[categoryId] && !loadingCategories.has(categoryId),
      )

      if (categoriesToLoad.length === 0) return

      // Update loading state for these categories
      const newLoadingCategories = new Set(loadingCategories)
      categoriesToLoad.forEach((categoryId) => newLoadingCategories.add(categoryId))
      setLoadingCategories(newLoadingCategories)

      // Load items for each category in parallel
      const loadPromises = categoriesToLoad.map(async (categoryId) => {
        try {
          const items = await getCategoryItems(categoryId)

          // Add category name to each item
          const currentCategory = categories.find((cat: category) => cat.id === categoryId)
          const itemsWithCategory = items.map((item: item) => ({
            ...item,
            categoryName: currentCategory ? currentCategory.name : "",
          }))

          return { categoryId, items: itemsWithCategory }
        } catch (error) {
          console.error(`Error loading items for category ${categoryId}:`, error)
          return { categoryId, items: [] }
        }
      })

      // Wait for all loading to complete
      const results = await Promise.all(loadPromises)

      // Update state with all loaded items
      const newCategoryItems = { ...categoryItems }
      results.forEach(({ categoryId, items }) => {
        newCategoryItems[categoryId] = items
      })

      setCategoryItems(newCategoryItems)

      // Update loading state
      const finalLoadingCategories = new Set(loadingCategories)
      categoriesToLoad.forEach((categoryId) => finalLoadingCategories.delete(categoryId))
      setLoadingCategories(finalLoadingCategories)
    }

    loadItemsForCategories()
  }, [openCategories, categoryItems, loadingCategories, categories])

  const handleAccordionValueChange = (value : string[]) => {
    setOpenCategories(value)
  }

  const handleItemClick = (item: item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: delay clearing the selected item to allow for exit animations
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full" onValueChange={handleAccordionValueChange}>
        {categories.map((category) => {
          // Dynamically get the icon component if iconName exists
          const IconComponent = category.iconName ? (LucideIcons as any)[category.iconName] : null
          const LabIconComponent = category.iconName && category.iconName.toLowerCase()[0] === category.iconName[0] ? (LabIcons as any)[category.iconName] : null
          const items = categoryItems[category.id] || []
          const isLoading = loadingCategories.has(category.id)

          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border border-amber-100 rounded-lg mb-4 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-amber-50 hover:bg-amber-100 hover:no-underline">
                <div className="flex items-center gap-2 text-amber-900">
                  {IconComponent && <IconComponent className="w-5 h-5 text-amber-600" />}
                  {LabIconComponent && <LucideIcons.Icon iconNode={LabIconComponent} className="w-4 h-4" />}
                  <span className="font-medium">{category.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 bg-white">
                {isLoading ? (
                  <div className="py-12 flex justify-center items-center">
                  <div className="flex space-x-3">
                      <motion.div
                        variants={spinnerVariants}
                        initial="initial"
                        animate="animate"
                        className="w-5 h-5 text-amber-500 flex justify-center items-center"
                      >
                        <LucideIcons.Loader2 />
                      </motion.div>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-8 text-center text-amber-700">
                    <p>No items available in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.05 }}
                        >
                          <MenuItemCard item={item} onClick={handleItemClick} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {categories.length === 0 && (
        <div className="py-12 flex justify-center items-center">
          <div className="flex space-x-3">
            <motion.div
              variants={spinnerVariants}
              initial="initial"
              animate="animate"
              className="w-5 h-5 text-amber-500 flex justify-center items-center"
            >
              <LucideIcons.Loader2 />
            </motion.div>
          </div>
        </div>
      )}

      <MenuItemModal item={selectedItem} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
