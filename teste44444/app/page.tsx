"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Dashboard } from "@/components/Dashboard"
import { Estoque } from "@/components/Estoque"
import { Degustacao } from "@/components/Degustacao"
import { Historico } from "@/components/Historico"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "estoque":
        return <Estoque />
      case "degustacao":
        return <Degustacao />
      case "historico":
        return <Historico />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  )
}
