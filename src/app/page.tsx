
import { Suspense } from "react";
import MenuCategories from "@/components/menu/menuCategories";
import { getMenuSettings } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default async function Home() {
  // Fetch menu settings
  const menuSettings = await getMenuSettings();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container p-4 mx-auto max-w-3xl">
        <section className="space-y-6"> 
          <Suspense fallback={<MenuSkeleton />}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              {menuSettings.title}
            </h1>
            <p className="text-amber-700 max-w-md mx-auto">
              {menuSettings.description}
            </p>
          </div>
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
    <AnimatePresence>
      <motion.div
        variants={spinnerVariants}
        initial="initial"
        animate="animate"
        className="w-3 h-3 rounded-full"
      >
        <Loader2 />
      </motion.div>
    </AnimatePresence>
  )
}
