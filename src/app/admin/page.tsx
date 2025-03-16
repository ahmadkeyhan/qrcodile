import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import CategoryManager from "@/components/admin/categoryManager"
import MenuItemManager from "@/components/admin/menuItemManager"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 ml-4">Menu Admin</h1>
        </header>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Manage Menu Items</h2>
            <Suspense fallback={<ItemsSkeleton />}>
              <MenuItemManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Manage Categories</h2>
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoryManager />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function ItemsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}

