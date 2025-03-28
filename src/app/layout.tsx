import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn, Changa } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toastContext"
import { Providers } from "./providers"
import { Navbar } from "@/components/ui/navbar"

const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
  display: 'swap'
})

const changa = Changa({
  subsets: ['arabic'],
  variable: '--font-changa',
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Cafe Menu App",
  description: "A digital menu application for cafes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${changa.variable}`}>
      <body>
        <Providers>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}

