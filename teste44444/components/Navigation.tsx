"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, Package, Cigarette, History } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "estoque", label: "Estoque", icon: Package },
    { id: "degustacao", label: "Degustação", icon: Cigarette },
    { id: "historico", label: "Histórico", icon: History },
  ]

  return (
    <Card className="m-4 p-4">
      <div className="flex flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-amber-800 mr-8 flex items-center">🚬 Charutos Manager</h1>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
