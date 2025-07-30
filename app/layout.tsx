import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Charutos Londrina - Aplicativo de Degustação",
  description: "Gerencie seu estoque de charutos e registre suas degustações",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-amber-50 min-h-screen`}>
        <Navigation />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>

        {/* Made with watermark */}
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
          Made with v0
        </div>
      </body>
    </html>
  )
}
