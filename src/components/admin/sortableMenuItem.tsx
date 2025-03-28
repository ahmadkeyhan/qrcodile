"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
  available: boolean
}

interface category {
    id: string, 
    name: string, 
    description: string,
    order: number
}

interface SortableMenuItemProps {
  item: item
  category?: category
  onEdit: (item: item) => void
  onDelete: (id: string, name: string) => void
}

export default function SortableMenuItem({ item }: SortableMenuItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id || "",
    // Add these properties to improve touch handling
    data: {
      type: "menuItem",
      item,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }


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
    <div ref={setNodeRef} style={style} className="mb-3 touch-manipulation">
      <Card className={`overflow-hidden ${isDragging ? "shadow-lg" : ""}`}>
        <CardContent className="p-0">
          <div className="p-3 flex flex-row-reverse gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing p-1 h-auto self-center touch-none select-none"
              {...attributes}
              {...listeners}
              onTouchStart={(e) => {
                // Don't prevent default here to allow the touch to be captured
                // but stop propagation to prevent parent elements from handling it
                e.stopPropagation()
              }}
            >
              <GripVertical className="w-5 h-5 text-slate-400" />
              <span className="sr-only">Drag to reorder</span>
            </Button>

            {item.image ? (
              <div className="relative h-20 w-20 hidden sm:flex rounded-md overflow-hidden flex-shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-20 w-20 hidden sm:flex rounded-md bg-slate-100 items-center justify-center flex-shrink-0">
                <span className="text-slate-400 text-xs">No image</span>
              </div>
            )}


            <div className="flex-1">
              <div className="flex flex-row-reverse justify-between items-start">
                <h3 className="font-medium">{item.name}</h3>
                <span className="font-semibold text-amber-700">{getPriceRange()}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
            {/* Show price list items if available */}
              {item.priceList.length > 1 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.priceList.map((priceItem, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-amber-50 rounded-full text-amber-700">
                        {priceItem.subItem}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

