"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getCategories } from "@/lib/data";
import { getCategoryItems } from "@/lib/data";
import { Badge } from "./ui/badge";
import MenuItemCard from "./menuItemCard";
import MenuItemModal from "./menuItemModal";
import * as LucideIcons from "lucide-react";

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

// Animation variants for the container
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    transitionEnd: { position: "absolute" } as any,
    width: "100%",
  },
  visible: {
    opacity: 1,
    x: 0,
    position: "relative" as any,
    width: "100%",
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    position: "absolute" as any,
    width: "100%",
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.2,
    },
  },
};

// Animation variants for individual items
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: {
      duration: 0.2,
    },
  },
};

export default function MenuCategories() {
  const [categories, setCategories] = useState<category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>();
  const [items, setItems] = useState<item[]>([]);
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].id);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      if (activeCategory) {
        setItems([]); // Clear items immediately to show loading state
        const data = await getCategoryItems(activeCategory);
        setItems(data);
        // Add category name to each item
        const currentCategory = categories.find(
          (cat) => cat.id === activeCategory
        );
        const itemsWithCategory = data.map((item: item) => ({
          ...item,
          categoryName: currentCategory ? currentCategory.name : "",
        }));

        setItems(itemsWithCategory);
      }
    };

    loadItems();
  }, [activeCategory, categories]);

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
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {categories.map((category) => {
          // Dynamically get the icon component if iconName exists
          const IconComponent = category.iconName ? (LucideIcons as any)[category.iconName] : null
          return (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all duration-300 snap-start ${
                activeCategory === category.id
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "hover:bg-amber-100 border-amber-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex flex-row-reverse items-center gap-1.5">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {category.name}
              </div>
            </Badge>
          )
      })}
      </div>

      <div className="relative min-h-[200px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {items.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} custom={index}>
                <MenuItemCard item={item} onClick={handleItemClick} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
