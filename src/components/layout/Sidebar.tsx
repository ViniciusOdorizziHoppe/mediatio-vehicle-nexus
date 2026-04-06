import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/vehicles', label: 'Veículos', icon: '🚗' },
  { path: '/pipeline', label: 'Pipeline', icon: '📋' },
  { path: '/leads', label: 'Leads (CRM)', icon: '👥' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">Mediatio</h1>
        <p className="text-xs text-gray-400 mt-1">CRM de Veículos</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}
