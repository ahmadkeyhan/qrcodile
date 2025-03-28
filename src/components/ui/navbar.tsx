"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { name: "خانه", href: "/" },
  { name: "رستری", href: "/roastery" },
  { name: "رویدادها", href: "/event" },
  { name: "درباره", href: "/about" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <header className="sticky top-0 z-50">
      {/* Glassmorphism background with futuristic border */}
      <div className="absolute inset-0 backdrop-blur-md shadow-sm bg-amber-50"></div>

      {/* Decorative gradient line */}
      

      <nav className="relative mx-auto flex max-w-7xl h-[3.75rem] sm:h-[4.5rem] items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center text-amber-500">
          <Link href="/" className="">
            <Image src={'/qqLogo.svg'} alt="لوگوی قوشاقاف" width={30} height={12}/>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:gap-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative h-9 w-9 rounded-full overflow-hidden group backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-5 w-5 group-hover:text-primary transition-colors duration-300" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 group-hover:bg-primary transition-opacity duration-300"></div>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{
            transitionProperty: "opacity, visibility",
            transitionDuration: "300ms",
            visibility: mobileMenuOpen ? "visible" : "hidden",
          }}
      >
        <div 
            className="fixed inset-0 bg-amber-50/80 backdrop-blur-md transition-opacity duration-300" 
            style={{
                opacity: mobileMenuOpen ? 1 : 0,
                transitionProperty: "opacity",
                transitionDuration: "300ms",
              }}
            onClick={() => setMobileMenuOpen(false)}></div>
        <div 
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-amber-50 backdrop-blur-md p-4 shadow-lg"
            style={{
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
                transitionProperty: "transform",
                transitionDuration: "300ms",
              }}>
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-bold bg-clip-text">
                QQ
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full overflow-hidden group backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 group-hover:bg-primary transition-opacity duration-300"></div>
            </Button>
          </div>
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-primary/5 rounded-md transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

