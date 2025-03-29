import connectToDatabase from "../mongodb"
import { Event, type IEvent } from "../../models/Event"

// Get all events
export async function getEvents() {
  try {
    await connectToDatabase()
    const events = await Event.find().sort({ startDate: 1 })
    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events")
  }
}

// Get event by ID
export async function getEventById(id: string) {
  try {
    await connectToDatabase()
    const event = await Event.findById(id)

    if (!event) {
      throw new Error("Event not found")
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error)
    throw new Error("Failed to fetch event")
  }
}

// Create a new event
export async function createEvent(eventData: Partial<IEvent>) {
  try {
    await connectToDatabase()
    const newEvent = new Event(eventData)
    await newEvent.save()
    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }
}

// Update an event
export async function updateEvent(id: string, eventData: Partial<IEvent>) {
  try {
    await connectToDatabase()
    const event = await Event.findByIdAndUpdate(id, { $set: eventData }, { new: true, runValidators: true })

    if (!event) {
      throw new Error("Event not found")
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.error("Error updating event:", error)
    throw new Error("Failed to update event")
  }
}

// Delete an event
export async function deleteEvent(id: string) {
  try {
    await connectToDatabase()
    const deletedEvent = await Event.findByIdAndDelete(id)

    if (!deletedEvent) {
      throw new Error("Event not found")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    throw new Error("Failed to delete event")
  }
}

