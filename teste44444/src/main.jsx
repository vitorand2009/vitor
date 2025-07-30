import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import { Dashboard } from '@/pages/Dashboard'
import Estoque from '@/pages/Estoque'
import Degustacao from '@/pages/Degustacao'
import Historico from '@/pages/Historico'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/degustacao" element={<Degustacao />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
