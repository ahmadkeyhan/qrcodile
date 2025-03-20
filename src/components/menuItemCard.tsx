"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

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

export default function MenuItemCard({ item, onClick } : {item:item, onClick: (item:item) => void}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="flex gap-4 p-4 rounded-lg border border-amber-100 bg-white hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
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
          <h3 className="font-medium text-amber-900">{item.name}</h3>
          <motion.span className="font-semibold text-amber-700" whileHover={{ scale: 1.1 }}>
            {formatCurrency(item.price)}
          </motion.span>
        </div>
        <p className="text-sm text-amber-700 line-clamp-2">{item.description}</p>
        {item.ingredients && <p className="text-xs text-amber-500">{item.ingredients}</p>}
      </div>
    </motion.div>
  )
}

