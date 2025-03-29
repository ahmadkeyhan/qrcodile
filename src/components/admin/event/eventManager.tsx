"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toastContext"
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/data/eventData"
import ImageUploader from "../imageUploader"
import type { IEvent } from "@/models/Event"

type Event = Omit<IEvent, "createdAt" | "updatedAt"> & { id: string }

type FormEvent = {
  name: string
  description: string
  image: string
  ticketPrice: string
  startDate: string
  endDate: string
  location: string
}

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<FormEvent>({
    name: "",
    description: "",
    image: "",
    ticketPrice: "",
    startDate: "",
    endDate: "",
    location: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormEvent>({
    name: "",
    description: "",
    image: "",
    ticketPrice: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (error: any) {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate dates
      const startDate = new Date(newEvent.startDate)
      const endDate = new Date(newEvent.endDate)

      if (endDate < startDate) {
        toast({
          title: "Invalid dates",
          description: "End date cannot be before start date",
          variant: "destructive",
        })
        return
      }

      const eventData: Partial<IEvent> = {
        name: newEvent.name,
        description: newEvent.description,
        ticketPrice: Number.parseFloat(newEvent.ticketPrice),
        startDate,
        endDate,
        location: newEvent.location,
      }

      if (newEvent.image) {
        eventData.image = newEvent.image
      }

      await createEvent(eventData)
      setNewEvent({
        name: "",
        description: "",
        image: "",
        ticketPrice: "",
        startDate: "",
        endDate: "",
        location: "",
      })
      loadEvents()
      toast({
        title: "Event created",
        description: `${newEvent.name} has been added to your events.`,
      })
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (event: Event) => {
    setEditingId(event.id)
    setEditForm({
      name: event.name,
      description: event.description,
      image: event.image || "",
      ticketPrice: event.ticketPrice.toString(),
      startDate: new Date(event.startDate).toISOString().split("T")[0],
      endDate: new Date(event.endDate).toISOString().split("T")[0],
      location: event.location,
    })
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Validate dates
        const startDate = new Date(editForm.startDate)
        const endDate = new Date(editForm.endDate)

        if (endDate < startDate) {
          toast({
            title: "Invalid dates",
            description: "End date cannot be before start date",
            variant: "destructive",
          })
          return
        }

        const eventData: Partial<IEvent> = {
          name: editForm.name,
          description: editForm.description,
          ticketPrice: Number.parseFloat(editForm.ticketPrice),
          startDate,
          endDate,
          location: editForm.location,
        }

        if (editForm.image) {
          eventData.image = editForm.image
        }

        await updateEvent(editingId, eventData)
        setEditingId(null)
        loadEvents()
        toast({
          title: "Event updated",
          description: `${editForm.name} has been updated.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteEvent(id)
        loadEvents()
        toast({
          title: "Event deleted",
          description: `${name} has been removed.`,
        })
      } catch (error: any) {
        toast({
          title: "Error deleting event",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium">Add New Event</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Input
              placeholder="Ticket Price"
              type="number"
              step="0.01"
              min="0"
              value={newEvent.ticketPrice}
              onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploader value={newEvent.image} onChange={(url) => setNewEvent({ ...newEvent, image: url })} />
          </div>
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="font-medium text-slate-700">Events</h3>
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No events yet. Add your first event above.</p>
          </div>
        ) : (
          events.map((event) =>
            editingId === event.id ? (
              <Card key={event.id} className="overflow-hidden mb-3">
                <CardContent className="p-0">
                  <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          placeholder="Event Name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Textarea
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          required
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Ticket Price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.ticketPrice}
                          onChange={(e) => setEditForm({ ...editForm, ticketPrice: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <Input
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <Input
                          type="date"
                          value={editForm.endDate}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploader
                          value={editForm.image}
                          onChange={(url) => setEditForm({ ...editForm, image: url })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card key={event.id} className="overflow-hidden mb-3">
                <CardContent className="p-0">
                  <div className="p-4 flex gap-4">
                    {event.image ? (
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-400 text-xs">No image</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{event.name}</h3>
                        <span className="font-semibold text-amber-700">
                          ${Number.parseFloat(event.ticketPrice.toString()).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                          {formatDate(event.startDate.toString())}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">{event.location}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(event)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(event.id, event.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )
        )}
      </div>
    </div>
  )
}

