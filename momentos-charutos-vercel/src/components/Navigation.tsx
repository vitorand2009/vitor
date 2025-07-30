'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Coffee, History } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/estoque', label: 'Estoque', icon: Package },
    { href: '/degustacao', label: 'Degustação', icon: Coffee },
    { href: '/historico', label: 'Histórico', icon: History },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4">
              <Coffee className="h-8 w-8 text-amber-600 mr-2" />
              <span className="font-bold text-xl text-gray-800">Momentos Charutos</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-4 px-2 text-gray-500 font-semibold hover:text-amber-600 transition duration-300 flex items-center ${
                    isActive ? 'text-amber-600 border-b-4 border-amber-600' : ''
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

