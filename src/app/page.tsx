import { Suspense } from "react"
import Link from "next/link"
import { Coffee, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import MenuCategories from "@/components/menuCategories"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-amber-900">Cafe Menu</h1>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-900 hover:bg-amber-100">
              Admin
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-amber-900">Our Delicious Menu</h2>
          <p className="text-center text-amber-700 max-w-md mx-auto">
            Explore our carefully crafted selection of drinks and treats, made with love and the finest ingredients.
          </p>

          <Suspense fallback={<MenuSkeleton />}>
            <MenuCategories />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

function MenuSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
          ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-amber-100">
              <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

