"use client"

import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// List of food & beverage related icons from Lucide
const foodIcons = [
  'Snowflake',
  'Hand'
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
    if (typeof(iconName) === "string") {
      setSelectedIcon(iconName)
      onChange(iconName)
    } 
    setOpen(false)
  }

  // Dynamically get the icon component
  const IconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : null
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-amber-50 border-amber-200">
          <div className="flex flex-row-reverse items-start gap-2">
            {selectedIcon ? (
              <>
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{selectedIcon === "Snowflake" ? "امکان سرو سرد" : "از ویتر بپرس"}</span>
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
          <CommandList>
            <CommandGroup className=" overflow-y-auto">
              <div
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect("")}
              >
                <Check className={cn("h-4 w-4", !selectedIcon ? "opacity-100" : "opacity-0")} />
                <span>بدون آیکون</span>
              </div>
              {foodIcons.map((iconName) => {
                  const LucideIcon = (LucideIcons as any)[iconName]
                  return (
                    <div
                      key={iconName}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelect(iconName)}
                    >
                      <Check className={cn("h-4 w-4", selectedIcon === iconName ? "opacity-100" : "opacity-0")} />
                      {LucideIcon && <LucideIcon className="h-4 w-4" />}
                      <span>{iconName === "Snowflake" ? "امکان سرو سرد" : "از ویتر بپرس"}</span>
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

