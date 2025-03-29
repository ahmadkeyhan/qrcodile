import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { getEvents } from "@/lib/data/eventData"
import { IEvent } from "@/models/Event"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Event = Omit<IEvent, "createdAt" | "updatedAt"> & { id: string }

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Upcoming Events</h1>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Join us for special events, tastings, and gatherings at our cafe. Book your tickets now!
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-amber-700">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            events.map((event: Event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image || "/placeholder.svg?height=200&width=400"}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold text-amber-900 mb-2">{event.name}</h2>
                  <p className="text-amber-700 mb-3 line-clamp-2">{event.description}</p>

                  <div className="flex items-center text-sm text-amber-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-amber-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900">{formatCurrency(event.ticketPrice)}</span>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

