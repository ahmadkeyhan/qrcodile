import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, ArrowLeft, Ticket } from "lucide-react"
import { getEventById } from "@/lib/data/eventData"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  try {
    const {id} = await params
    const event = await getEventById(id)

    // Format dates
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container px-4 py-6 mx-auto max-w-4xl">
          <Link href="/events" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>

          <Card className="overflow-hidden">
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={event.image || "/placeholder.svg?height=400&width=800"}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 mb-2">{event.name}</h1>
                  <div className="flex items-center text-amber-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(startDate)}</span>
                    {!isSameDay(startDate, endDate) && (
                      <>
                        <span className="mx-2">-</span>
                        <span>{formatDate(endDate)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center text-amber-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>
                      {formatTime(startDate)} - {formatTime(endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Ticket className="h-5 w-5 mr-2 text-amber-700" />
                    <span className="text-lg font-bold text-amber-900">{formatCurrency(event.ticketPrice)}</span>
                  </div>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600">Book Tickets</Button>
                </div>
              </div>

              <div className="prose prose-amber max-w-none">
                <h2 className="text-xl font-semibold text-amber-900 mb-3">About This Event</h2>
                <div className="whitespace-pre-line text-amber-800">{event.description}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  } catch (error) {
    return notFound()
  }
}

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

