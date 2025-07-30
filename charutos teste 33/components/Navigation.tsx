"use client"

import { BarChart3, Package, Coffee, History } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "estoque", label: "Estoque", icon: Package },
    { id: "degustacao", label: "Degustação", icon: Coffee },
    { id: "historico", label: "Histórico", icon: History },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-amber-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <h1 className="text-xl font-bold text-gray-800">Momentos Charutos</h1>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
