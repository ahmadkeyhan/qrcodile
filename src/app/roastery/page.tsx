
import { Suspense } from "react";
import MenuCategories from "@/components/menu/menuCategories";
import Products from "@/components/roastery/products";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Roastery() {
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container p-4 mx-auto max-w-3xl">
        <section className="space-y-6"> 
          <Suspense fallback={<MenuSkeleton />}>
            <Products />
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
