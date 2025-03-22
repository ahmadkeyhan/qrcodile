import { Suspense } from "react";
import Link from "next/link";
import { Coffee, UserCogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuCategories from "@/components/menuCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenuSettings } from "@/lib/data";

export default async function Home() {
  // Fetch menu settings
  const menuSettings = await getMenuSettings();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-amber-600" />
            <h1 className="text-lg font-bold text-amber-900">کافه کروکودیل</h1>
          </div>
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              ادمین
              <UserCogIcon className="w-4 h-4" />
            </Button>
          </Link>
        </header>
        <section className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-amber-900">
            {menuSettings.title}
          </h1>
          <p className="text-center text-amber-700 max-w-md mx-auto">
            {menuSettings.description}
          </p>
          <Suspense fallback={<MenuSkeleton />}>
            <MenuCategories />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function MenuSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 rounded-full flex-shrink-0"
            />
          ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-lg border border-amber-100"
            >
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
  );
}
