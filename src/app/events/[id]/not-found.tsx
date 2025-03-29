import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="text-center px-4 py-10">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Event Not Found</h1>
        <p className="text-amber-700 mb-6 max-w-md mx-auto">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/events">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>
    </main>
  )
}

