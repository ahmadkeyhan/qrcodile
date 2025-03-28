"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateMenuItem } from "@/lib/data"
import { useToast } from "@/components/ui/toastContext"
import { IMenuItem } from "@/models/MenuItem"

interface AvailabilityToggleProps {
  itemId: string
  itemName: string
  item: IMenuItem
  initialAvailable: boolean
  onToggle?: (available: boolean) => void
}

export default function AvailabilityToggle({ itemId, itemName, item, initialAvailable, onToggle }: AvailabilityToggleProps) {
  const [available, setAvailable] = useState(initialAvailable)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true)
    try {
        
      await updateMenuItem(itemId, {...item ,available: checked })
      setAvailable(checked)
      if (onToggle) {
        onToggle(checked)
      }
      toast({
        title: `${itemName} is now ${checked ? "available" : "unavailable"}`,
        description: checked ? "Customers can now see and order this item" : "This item is now hidden from customers",
      })
    } catch (error: any) {
      toast({
        title: "Error updating availability",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id={`available-${itemId}`} checked={available} onCheckedChange={handleToggle} disabled={isUpdating} />
      <Label htmlFor={`available-${itemId}`} className={isUpdating ? "opacity-50" : ""}>
        {available ? "موجود" : "ناموجود"}
      </Label>
    </div>
  )
}

