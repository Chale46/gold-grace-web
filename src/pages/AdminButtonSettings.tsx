import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Phone,
  MessageCircle,
} from 'lucide-react';

const AdminButtonSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    consultation_phone: '',
    consultation_whatsapp: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('key', ['consultation_phone', 'consultation_whatsapp']);

      if (error) {
        console.error('Error loading button settings:', error);
        setError('Failed to load button settings');
      } else {
        const values: Record<string, string> = {
          consultation_phone: '',
          consultation_whatsapp: '',
        };

        data?.forEach((item: any) => {
          values[item.key] = item.value ?? item.content ?? '';
        });

        setForm(values);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load button settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = Object.entries(form).map(([key, value]) => ({ key, value }));
      let { error } = await supabase
        .from('site_content')
        .upsert(payload, {
          onConflict: 'key',
        });

      if (error?.message?.toLowerCase().includes('column') && error.message.toLowerCase().includes('value')) {
        const fallbackPayload = Object.entries(form).map(([key, value]) => ({ key, content: value }));
        const fallbackResult = await supabase
          .from('site_content')
          .upsert(fallbackPayload, {
            onConflict: 'key',
          });
        error = fallbackResult.error;
      }

      if (error) {
        console.error('Save error:', error);
        setError('Failed to save button settings');
      } else {
        setSuccess('Button settings saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save button settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Kontak</h1>
            <p className="text-gray-500 mt-1">Ubah nomor telepon dan WhatsApp untuk tombol konsultasi mengambang.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Phone Number</h2>
                  <p className="text-sm text-gray-500">This is the number used for the direct call action.</p>
                </div>
              </div>
              <input
                type="tel"
                value={form.consultation_phone}
                onChange={(e) => setForm(prev => ({ ...prev, consultation_phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. +6281234567890"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Nomor WhatsApp</h2>
                  <p className="text-sm text-gray-500">Masukkan nomor WhatsApp tanpa spasi atau simbol.</p>
                </div>
              </div>
              <input
                type="text"
                value={form.consultation_whatsapp}
                onChange={(e) => setForm(prev => ({ ...prev, consultation_whatsapp: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. 6281234567890"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-sm text-blue-800">
              <p className="font-medium mb-2">How this works</p>
              <ul className="list-disc list-inside space-y-1">
                <li>If you enter a phone number, the button will use it for the phone call action.</li>
                <li>If you enter a WhatsApp number, the chat button will open WhatsApp with the selected number.</li>
                <li>Leave these fields blank to use the current app defaults.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminButtonSettings;
