"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, ListTodo, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AdminHeader from "@/components/admin/adminHeader";
import CategoryManager from "@/components/admin/categoryManager";
import MenuItemManager from "@/components/admin/menuItemManager";
import PasswordManager from "@/components/admin/passwordManager";
import UserManager from "@/components/admin/userManager";
import MenuSettingsManager from "@/components/admin/menuSettingsManager";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Don't render anything until we check authentication
  if (!isClient || status === "loading") {
    return <AdminSkeleton />;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <AdminHeader />
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="inline-flex w-full max-w-md mx-auto">
            {isAdmin && (
              <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
            )}
            <TabsTrigger value="items">آیتم‌ها</TabsTrigger>
            {isAdmin && <TabsTrigger value="menu">منو</TabsTrigger>}
            <TabsTrigger value="preferences">اکانت</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">کارمندان</TabsTrigger>}
          </TabsList>

          {isAdmin && (
            <TabsContent value="categories" className="space-y-6">
              <h1 className="text-xl font-semibold text-center text-amber-900">
                مدیریت دسته‌بندی‌ها
              </h1>
              <Suspense fallback={<CategoriesSkeleton />}>
                <CategoryManager />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="items" className="space-y-6">
            <h1 className="text-xl font-semibold text-center text-amber-900">
              مدیریت آیتم‌ها
            </h1>
            <Suspense fallback={<ItemsSkeleton />}>
              <MenuItemManager isAdmin={isAdmin} />
            </Suspense>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="menu" className="space-y-6">
              <h1 className="text-xl font-semibold text-center text-amber-900">
                تنظیمات منو
              </h1>
              <Suspense fallback={<SettingsSkeleton />}>
                <MenuSettingsManager />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="preferences" className="space-y-6">
            <h1 className="text-xl font-semibold text-center text-amber-900">
              تنظیمات اکانت
            </h1>
            <Suspense fallback={<PreferencesSkeleton />}>
              <PasswordManager />
            </Suspense>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <h1 className="text-xl font-semibold text-center text-amber-900">
                مدیریت کارمندان
              </h1>
              <Suspense fallback={<UsersSkeleton />}>
                <UserManager />
              </Suspense>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
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
  );
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
  );
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
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
}

function PreferencesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
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
  );
}
