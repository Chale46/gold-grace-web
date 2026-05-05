import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { session, error } = await api.auth.getCurrentSession();
        
        if (session?.user) {
          setUser(session.user);
        } else {
          // ProtectedRoute should handle redirect, but just in case
          console.log('No session found in AdminLayout');
        }
      } catch (error) {
        console.error('Error getting user in AdminLayout:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = api.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await api.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              JADTRA Consulting Administration
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              View Website →
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
