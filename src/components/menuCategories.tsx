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

export default function MenuCategories() {
  const [categories, setCategories] = useState<category[]>([]);
  const [categoryItems, setCategoryItems] = useState<categoryItems>({})
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  const handleAccordionValueChange = async (value: string[]) => {
    // Load items for the selected category if not already loaded
    if (value.length > 0 && !categoryItems[value[0]]) {
      setLoadingCategory(value[0])
      const items = await getCategoryItems(value[0])

      // Add category name to each item
      const currentCategory = categories.find((cat) => cat.id === value[0])
      const itemsWithCategory = items.map((item: item) => ({
        ...item,
        categoryName: currentCategory ? currentCategory.name : "",
      }))

      setCategoryItems((prev) => ({
        ...prev,
        [value[0]]: itemsWithCategory,
      }))
      setLoadingCategory(null)
    }
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
          const isLoading = loadingCategory === category.id

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
                  <div className="py-8 flex justify-center">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
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
        <div className="text-center py-12 text-amber-700">
          <p>Loading menu categories...</p>
        </div>
      )}

      <MenuItemModal item={selectedItem} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
