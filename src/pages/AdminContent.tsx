import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye
} from 'lucide-react';

interface SiteContent {
  key: string;
  content: string;
  updated_at: string;
}

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Content state
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        console.error('Error loading content:', error);
        setError('Failed to load content from database');
      } else {
        // Parse content into state using correct keys
        data?.forEach((item: SiteContent) => {
          switch (item.key) {
            case 'header_html':
              setHeader(item.value || '');
              break;
            case 'homepage_content':
              setBody(item.value || '');
              break;
            case 'footer_html':
              setFooter(item.value || '');
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
      // Save all sections using proper upsert array format
      const { data, error } = await supabase
        .from('site_content')
        .upsert([
          { key: 'header_html', value: header },
          { key: 'homepage_content', value: body },
          { key: 'footer_html', value: footer }
        ], {
          onConflict: 'key'
        })
        .select();

      if (error) {
        console.error('Save error:', error);
        setError('Failed to save content');
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

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
            <p className="text-gray-500 mt-1">Manage website header, body, and footer</p>
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </AdminLayout>
  );
};

export default AdminContent;
