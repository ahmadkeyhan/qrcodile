"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LogOut, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import CategoryManager from "@/components/admin/categoryManager"
import MenuItemManager from "@/components/admin/menuItemManager"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])
  
  // Don't render anything until we check authentication
  if (!isClient || status === "loading") {
    return <AdminSkeleton />
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex gap-2">
                <ListTodo className="w-4 h-4 mr-1" />
                نمایش منو
              </Button>
            </Link>
            {/* <h1 className="text-2xl font-bold text-slate-900 ml-4">Menu Admin</h1> */}
          </div>

          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-sm text-slate-600">
                {session.user.name}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-slate-700">
              <LogOut className="w-4 h-4 mr-1" />
              خروج
            </Button>
          </div>
        </header>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="items">آیتم‌ها</TabsTrigger>
            <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <h1 className="text-xl font-semibold text-slate-900">مدیریت آیتم‌ها</h1>
            <Suspense fallback={<ItemsSkeleton />}>
              <MenuItemManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h1 className="text-xl font-semibold text-slate-900">مدیریت دسته‌بندی‌ها</h1>
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoryManager />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-md mx-auto mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
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

