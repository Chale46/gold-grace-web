import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calculator, 
  LogOut, 
  Settings,
  TrendingUp,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCalculations: 0,
    totalArticles: 0,
    recentContacts: [],
    recentCalculations: [],
    recentArticles: []
  });

  const navigate = useNavigate();

  const formatDateSafe = (dateValue?: string) => {
    if (!dateValue) return '-';
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleDateString();
  };

  useEffect(() => {
    // Get current session (ProtectedRoute ensures user is authenticated)
    const getCurrentUser = async () => {
      const { session, error } = await api.auth.getCurrentSession();
      
      if (session) {
        setUser(session.user);
        loadDashboardData();
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = api.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        // ProtectedRoute will handle redirect
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load recent articles
      const { data: articles, error: articlesError } = await api.articles.getAll({ limit: 5 });

      // Load recent contacts
      const { data: contacts, error: contactsError } = await api.contacts.getAll({ limit: 5 });

      // Load recent calculations
      const { data: calculations, error: calculationsError } = await api.taxCalculator.getAll({ limit: 5 });

      if (!articlesError && articles) {
        setStats(prev => ({
          ...prev,
          totalArticles: articles.length,
          recentArticles: articles
        }));
      }

      if (!contactsError && contacts) {
        setStats(prev => ({
          ...prev,
          totalContacts: contacts.length,
          recentContacts: contacts
        }));
      }

      if (!calculationsError && calculations) {
        setStats(prev => ({
          ...prev,
          totalCalculations: calculations.length,
          recentCalculations: calculations
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await api.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/admin/content"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" />
              Site Content
            </Link>
            <Link
              to="/admin/articles"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              Articles
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <div className="w-9"></div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="bg-white shadow-sm border-b hidden lg:block">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.email}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">Total Articles</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">Contact Forms</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.totalContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calculator className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">Tax Calculations</h3>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalCalculations}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">Growth Rate</h3>
                  <p className="text-2xl font-bold text-orange-600">+12%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Articles */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-foreground">Recent Articles</h2>
              </div>
              <div className="p-6">
                {stats.recentArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No articles yet</p>
                    <Link
                      to="/admin/articles"
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
                    >
                      Create your first article
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentArticles.map((article) => (
                      <div key={article.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{article.excerpt}</p>
                          <p className="text-xs text-gray-400">
                            {formatDateSafe(article.created_at)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Contact Submissions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-foreground">Recent Contact Submissions</h2>
              </div>
              <div className="p-6">
                {stats.recentContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contact submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentContacts.map((contact) => (
                      <div key={contact.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                          <p className="text-xs text-gray-400">
                            {formatDateSafe(contact.created_at)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {contact.status === 'new' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              New
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/articles"
                  className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Articles
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Website
                </Link>
                <button className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
