"use client"

import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// List of food & beverage related icons from Lucide
const foodIcons = [
  "Apple",
  "Banana",
  "Beef",
  "Beer",
  "Cake",
  "CakeSlice",
  "Candy",
  "CandyCane",
  "Carrot",
  "ChefHat",
  "Cherry",
  "Citrus",
  "Coffee",
  "Cookie",
  "CookingPot",
  "Croissant",
  "CupSoda",
  "Dessert",
  "Donut",
  "Drumstick",
  "Egg",
  "Fish",
  "GlassWater",
  "Grape",
  "Ham",
  "HandPlatter",
  "IceCreamBowl",
  "IceCream",
  "LeafyGreen",
  "Lollipop",
  "Martini",
  "Microwave",
  "Milk",
  "Nut",
  "Pizza",
  "Popcorn",
  "Popsicle",
  "Refrigerator",
  "Salad",
  "Sandwich",
  "Soup",
  "Torus",
  "Utensils",
  "UtensilsCrossed",
  "Vegan",
  "Wheat",
  "Wine"
]

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string>(value || "")

  useEffect(() => {
    if (value) {
      setSelectedIcon(value)
    }
  }, [value])

  const handleSelect = (iconName: string) => {
    setSelectedIcon(iconName)
    onChange(iconName)
    setOpen(false)
  }

  // Dynamically get the icon component
  const IconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            {selectedIcon ? (
              <>
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {/* <span>{selectedIcon}</span> */}
              </>
            ) : (
              "انتخاب آیکون(اختیاری)"
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="جست‌وجوی آیکون" />
          <CommandList>
            <CommandEmpty>آیکونی یافت نشد</CommandEmpty>
            <CommandGroup className=" overflow-y-auto">
              <div
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect("")}
              >
                <Check className={cn("mr-2 h-4 w-4", !selectedIcon ? "opacity-100" : "opacity-0")} />
                <span>بدون آیکون</span>
              </div>
              {foodIcons.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName]
                return (
                  <div
                    key={iconName}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(iconName)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedIcon === iconName ? "opacity-100" : "opacity-0")} />
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{iconName}</span>
                  </div>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

