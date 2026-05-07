import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Phone,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  user: any;
  onLogout: () => void;
}

const AdminSidebar = ({ user, onLogout }: AdminSidebarProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
    { path: '/admin/settings', label: 'Pengaturan Kontak', icon: Phone },
    { path: '/admin/content', label: 'Site Content', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-semibold text-gray-900">Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">JADTRA</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <span>{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 px-4 py-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
