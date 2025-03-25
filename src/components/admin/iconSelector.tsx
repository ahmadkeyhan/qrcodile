"use client"

import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Icon } from "lucide-react"
import * as LabIcons from "@lucide/lab"
import { cn } from "@/lib/utils"

// List of food & beverage related icons from Lucide
const foodIcons = [
  "Apple",
  ["avocado"],
  "Banana",
  ["barbecue"],
  "Beef",
  "Beer",
  ["bowlChopsticks"],
  ["bullHead"],
  ["burger"],
  "Cake",
  "CakeSlice",
  "Candy",
  "CandyCane",
  "Carrot",
  ["cheese"],
  "ChefHat",
  "Cherry",
  "Citrus",
  ["cocktail"],
  "Coffee",
  ["coffeeBean"],
  ["coffeemaker"],
  "Cookie",
  "CookingPot",
  ["cowHead"],
  ["cupSaucer"],
  "Croissant",
  "CupSoda",
  ["cupToGo"],
  "Dessert",
  "Donut",
  "Drumstick",
  "Egg",
  ["eggCup"],
  "Fish",
  ["fruit"],
  "GlassWater",
  ["goblet"],
  "Grape",
  "Ham",
  "HandPlatter",
  ["hotDog"],
  "IceCreamBowl",
  "IceCream",
  ["jar"],
  ["jug"],
  ["kebab"],
  ["kettle"],
  ["kettleElectric"],
  ['kiwi'],
  "LeafyGreen",
  ['lemon'],
  "Lollipop",
  "Martini",
  "Microwave",
  "Milk",
  ["mortarPestle"],
  ["mug"],
  ["mugTeabag"],
  "Nut",
  ["onion"],
  ["pancakes"],
  ["pepperChilli"],
  ["pie"],
  "Pizza",
  "Popcorn",
  "Popsicle",
  "Refrigerator",
  "Salad",
  "Sandwich",
  ["sausage"],
  "Soup",
  ["strawberry"],
  ["sushi"],
  ["sushi2"],
  ["sushi3"],
  ["toast"],
  ["toaster"],
  "Torus",
  "Utensils",
  "UtensilsCrossed",
  "Vegan",
  ["waffle"],
  "Wheat",
  "Wine",
  ["wineGlassBottle"]
]

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string>(value || "")
  const [labIcon,setLabIcon] = useState<boolean>(false)

  useEffect(() => {
    if(value.toLowerCase()[0] === value[0]) setLabIcon(true)
    if (value) {
      setSelectedIcon(value)
    }
  }, [value])

  const handleSelect = (iconName: string | string[]) => {
    if (typeof(iconName) === "string") {
      setSelectedIcon(iconName)
      onChange(iconName)
      setLabIcon(false) 
    } else {
      setSelectedIcon(iconName[0])
      onChange(iconName[0])
      setLabIcon(true)
    }
    setOpen(false)
  }

  // Dynamically get the icon component
  const IconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : null
  const LabIconComponent = selectedIcon ? (LabIcons as any)[selectedIcon] : null
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-amber-50 border-amber-200">
          <div className="flex flex-row-reverse items-start gap-2">
            {selectedIcon && !labIcon ? (
              <>
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{selectedIcon}</span>
              </>
            ) : labIcon ? (
              <>
                {LabIconComponent && <Icon iconNode={LabIconComponent} className="h-4 w-4" />}
                <span>{selectedIcon}</span>
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
                <Check className={cn("h-4 w-4", !selectedIcon ? "opacity-100" : "opacity-0")} />
                <span>بدون آیکون</span>
              </div>
              {foodIcons.map((iconName) => {
                if (typeof(iconName) === 'string') {
                  const LucideIcon = (LucideIcons as any)[iconName]
                  return (
                    <div
                      key={iconName}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelect(iconName)}
                    >
                      <Check className={cn("h-4 w-4", selectedIcon === iconName ? "opacity-100" : "opacity-0")} />
                      {LucideIcon && <LucideIcon className="h-4 w-4" />}
                      <span>{iconName}</span>
                    </div>
                  )
                } else {
                  const LabIcon = (LabIcons as any)[iconName[0]]
                  return (
                    <div
                      key={iconName[0]}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelect(iconName)}
                    >
                      <Check className={cn("h-4 w-4", selectedIcon === iconName[0] ? "opacity-100" : "opacity-0")} />
                      {LabIcon && <Icon iconNode={LabIcon} className="h-4 w-4" />}
                      <span>{iconName[0]}</span>
                    </div>
                  )
                }
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

