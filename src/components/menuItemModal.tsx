"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IPriceListItem } from "@/models/MenuItem"
import { formatCurrency } from "@/lib/utils"

interface MenuItemModalProps {
  item: any
  isOpen: boolean
  onClose: () => void
}

export default function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  if (!item) return null


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
                    {/* <X className="h-4 w-4" />
                    <span className="sr-only">Close</span> */}
                  </Button>
                </DialogClose>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <DialogTitle>
                        {item.name}
                    </DialogTitle>
                  </div>

                  <motion.p
                    className="text-amber-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.description}
                  </motion.p>
                </div>

                {/* Price List Section */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-sm font-medium text-amber-800">Options & Pricing</h3>
                    <div className="space-y-2">
                      {item.priceList.map((priceItem: IPriceListItem, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1 border-b border-amber-100 last:border-0"
                        >
                          <span className="text-amber-900">{priceItem.subItem}</span>
                          <span className="font-medium text-amber-700">{formatCurrency(priceItem.price)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                {item.ingredients && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-sm font-medium">
                       مواد اولیه
                    </Badge>
                    <p className="text-sm text-amber-600">{item.ingredients}</p>
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

