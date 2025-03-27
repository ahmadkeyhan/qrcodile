
import { Suspense } from "react";
import Link from "next/link";
import { Coffee, UserCogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuCategories from "@/components/menuCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenuSettings } from "@/lib/data";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default async function Home() {
  // Fetch menu settings
  const menuSettings = await getMenuSettings();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-3xl">
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              {menuSettings.title}
            </h1>
            <p className="text-amber-700 max-w-md mx-auto">
              {menuSettings.description}
            </p>
          </div>
          <Suspense fallback={<MenuSkeleton />}>
            <MenuCategories />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

// Loading spinner animation variants
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1,
      ease: "linear",
    },
  },
}

function MenuSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border border-amber-100 rounded-lg overflow-hidden">
            <div className="bg-amber-50 p-4">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="p-4">
              <div className="py-8 flex justify-center items-center">
                <div className="flex space-x-3">

                    <motion.div
                      variants={spinnerVariants}
                      initial="initial"
                      animate="animate"
                      className="w-3 h-3 rounded-full"
                    >
                      <Loader2 />
                    </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
