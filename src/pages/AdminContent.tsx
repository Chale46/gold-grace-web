import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { 
  LayoutDashboard,
  FileText,
  Save,
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Globe
} from 'lucide-react';

interface SiteContent {
  key: string;
  content: string;
  updated_at: string;
}

const AdminContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Content state
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    const getCurrentUser = async () => {
      const { session, error } = await api.auth.getCurrentSession();
      
      if (session) {
        setUser(session.user);
        loadContent();
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = api.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await api.siteContent.getAll();

      if (error) {
        console.error('Error loading content:', error);
        // If table doesn't exist, use defaults
        setError('Database table not found. Please create site_content table in Supabase.');
      } else {
        // Parse content into state
        data?.forEach((item: SiteContent) => {
          switch (item.key) {
            case 'header':
              setHeader(item.content || '');
              break;
            case 'body':
              setBody(item.content || '');
              break;
            case 'footer':
              setFooter(item.content || '');
              break;
          }
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save all three sections
      const promises = [
        api.siteContent.update('header', header),
        api.siteContent.update('body', body),
        api.siteContent.update('footer', footer)
      ];

      const results = await Promise.all(promises);
      
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        setError('Some content failed to save. Please check console.');
        results.forEach((result, index) => {
          if (result.error) {
            console.error(`Error saving ${['header', 'body', 'footer'][index]}:`, result.error);
          }
        });
      } else {
        setSuccess('Content saved successfully!');
        // Clear success after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await api.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    navigate('/admin/login');
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/admin/content"
              className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg"
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
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
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
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
              <p className="text-sm text-gray-500 mt-1">Manage website content sections</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview Site
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Form */}
        <main className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Header Content
                <span className="text-gray-500 text-xs ml-2">(shown at top of all pages)</span>
              </label>
              <textarea
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter header content here... (HTML supported)"
              />
              <p className="text-xs text-gray-500 mt-2">Supports HTML. Leave empty to use default header.</p>
            </div>

            {/* Body Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Body/Main Content
                <span className="text-gray-500 text-xs ml-2">(main page content)</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter main content here... (HTML supported)"
              />
              <p className="text-xs text-gray-500 mt-2">Supports HTML. This content will be injected into the main content area.</p>
            </div>

            {/* Footer Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Footer Content
                <span className="text-gray-500 text-xs ml-2">(shown at bottom of all pages)</span>
              </label>
              <textarea
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter footer content here... (HTML supported)"
              />
              <p className="text-xs text-gray-500 mt-2">Supports HTML. Leave empty to use default footer.</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Use HTML tags for formatting (e.g., &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;)</li>
              <li>Leave fields empty to use default content</li>
              <li>Click "Preview Site" to see changes on the public website</li>
              <li>Don't forget to click "Save Changes" when done editing</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminContent;
