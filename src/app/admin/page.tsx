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
import PasswordManager from "@/components/admin/passwordManager"
import UserManager from "@/components/admin/userManager"
import MenuSettingsManager from "@/components/admin/menuSettingsManager"

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

  const isAdmin = session?.user?.role === "admin"

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm">
                نمایش منو
                <ListTodo className="w-4 h-4" />
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
              خروج
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="inline-flex w-ful max-w-md mx-auto">
            <TabsTrigger value="items">آیتم‌ها</TabsTrigger>
            {isAdmin && <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>}
            {isAdmin && <TabsTrigger value="menu">منو</TabsTrigger>}
            <TabsTrigger value="preferences">تنظیمات</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">کارکنان</TabsTrigger>}
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <h1 className="text-xl font-semibold text-slate-900">مدیریت آیتم‌ها</h1>
            <Suspense fallback={<ItemsSkeleton />}>
              <MenuItemManager isAdmin={isAdmin} />
            </Suspense>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="categories" className="space-y-6">
              <h1 className="text-xl font-semibold text-slate-900">مدیریت دسته‌بندی‌ها</h1>
              <Suspense fallback={<CategoriesSkeleton />}>
                <CategoryManager />
              </Suspense>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="menu" className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">تنظیمات منو</h2>
              <Suspense fallback={<SettingsSkeleton />}>
                <MenuSettingsManager />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="preferences" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">تنظیمات اکانت</h2>
            <Suspense fallback={<PreferencesSkeleton />}>
              <PasswordManager />
            </Suspense>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">مدیریت کارکنان</h2>
              <Suspense fallback={<UsersSkeleton />}>
                <UserManager />
              </Suspense>
            </TabsContent>
          )}
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

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}

function PreferencesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

function UsersSkeleton() {
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

