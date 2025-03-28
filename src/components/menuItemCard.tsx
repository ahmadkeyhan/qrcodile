"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface priceListItem {
  subItem: string;
  price: number;
}

interface item {
  id: string;
  name: string;
  description: string;
  priceList: priceListItem[];
  categoryId: string;
  ingredients: string;
  image: string;
  order: number;
}

export default function MenuItemCard({
  item,
  onClick,
}: {
  item: item;
  onClick: (item: item) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the price range if there's a price list
  const getPriceRange = () => {
    if (item.priceList.length === 1) {
      return item.priceList[0].price;
    }

    if (item.priceList.length > 1) {
      const prices = item.priceList.map((p: priceListItem) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) return minPrice;
      return `${minPrice} - ${maxPrice}`;
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-lg border border-amber-100 bg-white hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
    >
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=80&width=80"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
        />
        <motion.div
          className="absolute inset-0 bg-amber-500 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-1 flex-1">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-base text-amber-900">{item.name}</h2>
          {item.priceList.length === 1 && <p className="font-semibold text-amber-900">{getPriceRange()}</p>}
        </div>
        {/* Show price list items */}
        {item.priceList.length > 1 && <div className="mt-1 flex flex-col gap-1">
          {item.priceList.map((subItem, index) => (
            <div
              key={index}
              className="text-sm px-2 -ml-2 py-0.5 flex justify-between text-amber-900 border-b border-amber-100 last:border-0"
            >
              <p>{subItem.subItem}</p>
              <p className="font-semibold">{subItem.price}</p>
            </div>
          ))}
        </div>}
        <p className="text-sm text-amber-700 line-clamp-2">
          {item.description}
        </p>
        {item.ingredients && (
          <p className="text-xs text-amber-500">
            {item.ingredients}
          </p>
        )}
      </div>
    </motion.div>
  );
}
