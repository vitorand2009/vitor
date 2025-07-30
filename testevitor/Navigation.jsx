import { Link, useLocation } from 'react-router-dom'
import { Home, Package, Coffee, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/estoque', label: 'Estoque', icon: Package },
    { path: '/degustacao', label: 'Degustação', icon: Coffee },
    { path: '/historico', label: 'Histórico', icon: History },
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
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    location.pathname === path 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
