"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, BarChart3, Package, Cigarette, History } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/estoque", label: "Estoque", icon: Package },
  { href: "/degustacao", label: "Degustação", icon: Cigarette },
  { href: "/historico", label: "Histórico", icon: History },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Coffee className="h-6 w-6 text-amber-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Charutos Londrina</span>
          </div>

          {/* Navigation Menu */}
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
