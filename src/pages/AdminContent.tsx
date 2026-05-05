import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import RichEditor from '@/components/editor/RichEditor';
import { 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye
} from 'lucide-react';

interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

interface TextContent {
  hero_title?: string;
  hero_subtitle?: string;
  footer_company?: string;
  footer_email?: string;
  footer_phone?: string;
  footer_address?: string;
  nav_home?: string;
  nav_about?: string;
  nav_services?: string;
  nav_contact?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_linkedin?: string;
  social_facebook?: string;
  social_instagram?: string;
  company_name?: string;
  company_tagline?: string;
  company_description?: string;
}

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Content state
  const [content, setContent] = useState<TextContent>({
    hero_title: '',
    hero_subtitle: '',
    footer_company: '',
    footer_email: '',
    footer_phone: '',
    footer_address: '',
    nav_home: '',
    nav_about: '',
    nav_services: '',
    nav_contact: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_linkedin: '',
    social_facebook: '',
    social_instagram: '',
    company_name: '',
    company_tagline: '',
    company_description: ''
  });

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
        // Parse content into state using text-based keys
        data?.forEach((item: SiteContent) => {
          setContent(prev => ({
            ...prev,
            [item.key as keyof TextContent]: item.value || ''
          }));
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
      // Convert content object to array of key-value pairs
      const contentArray = Object.entries(content).map(([key, value]) => ({
        key,
        value: value || ''
      }));

      const { data, error } = await supabase
        .from('site_content')
        .upsert(contentArray, {
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
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Hero Title
                <span className="text-gray-500 text-xs ml-2">(main heading on homepage)</span>
              </label>
              <input
                type="text"
                value={content.hero_title || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero_title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter hero title..."
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Hero Subtitle
                <span className="text-gray-500 text-xs ml-2">(subtitle below main heading)</span>
              </label>
              <textarea
                value={content.hero_subtitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter hero subtitle..."
              />
            </div>

            {/* Footer Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Footer Company
                <span className="text-gray-500 text-xs ml-2">(company name in footer)</span>
              </label>
              <input
                type="text"
                value={content.footer_company || ''}
                onChange={(e) => setContent(prev => ({ ...prev, footer_company: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter company name..."
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Footer Email
                <span className="text-gray-500 text-xs ml-2">(contact email)</span>
              </label>
              <input
                type="email"
                value={content.footer_email || ''}
                onChange={(e) => setContent(prev => ({ ...prev, footer_email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter email..."
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Footer Phone
                <span className="text-gray-500 text-xs ml-2">(contact phone)</span>
              </label>
              <input
                type="tel"
                value={content.footer_phone || ''}
                onChange={(e) => setContent(prev => ({ ...prev, footer_phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter phone number..."
              />
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
