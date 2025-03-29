"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IPriceListItem } from "@/models/MenuItem"
import { formatCurrency } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

interface priceListItem {
  subItem: string;
  price: number;
}

interface item {
  id: string;
  name: string;
  description: string;
  iconName: string;
  priceList: priceListItem[];
  categoryName: string;
  ingredients: string;
  image: string;
  order: number;
}

interface MenuItemModalProps {
  item: item
  isOpen: boolean
  onClose: () => void
}

export default function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  if (!item) return null

  const IconComponent = item.iconName ? (LucideIcons as any)[item.iconName] : null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="relative w-full h-[200px] sm:h-[250px]">
                <Image
                  src={item.image || "/placeholder.svg?height=250&width=500"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/90 text-slate-700"
                  >
                  </Button>
                </DialogClose>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <DialogTitle className="flex w-full justify-between">
                      <div className="flex items-center gap-1 text-amber-900">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <h2 className="font-bold text-base">{item.name}</h2>
                      </div>        
                      {item.priceList.length === 1 && <p className="font-semibold text-amber-900">{formatCurrency(item.priceList[0].price)}</p>}
                    </DialogTitle>
                  </div>

                  <motion.p
                    className="text-amber-700 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.description}
                  </motion.p>
                </div>

                {/* Price List Section */}
                  {item.priceList.length > 1 && <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-2 pr-2 text-amber-900">
                      {item.priceList.map((priceItem: IPriceListItem, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1 border-b border-amber-100 last:border-0"
                        >
                          <span>{priceItem.subItem}</span>
                          <span className="font-semibold">{formatCurrency(priceItem.price)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>}

                {item.ingredients && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm text-amber-600 px-2.5">{item.ingredients}</p>
                  </motion.div>
                )}

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    {item.categoryName || "آیتم منو"}
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

