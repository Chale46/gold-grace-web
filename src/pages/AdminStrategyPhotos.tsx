import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Upload,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface StrategyPhoto {
  id: string;
  order: number;
  url: string;
  uploaded_at: string;
}

const AdminStrategyPhotos = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photos, setPhotos] = useState<StrategyPhoto[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const MAX_PHOTOS = 6;

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('strategy_photos')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading photos:', error);
        setError('Gagal memuat foto');
      } else {
        setPhotos(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat foto');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      setUploading(true);
      setError('');

      if (photos.length + files.length > MAX_PHOTOS) {
        setError(`Maksimal ${MAX_PHOTOS} foto. Anda sudah memiliki ${photos.length} foto.`);
        setUploading(false);
        return;
      }

      const uploadedPhotos: StrategyPhoto[] = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Hanya file gambar yang diizinkan');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Ukuran file maksimal 5MB');
          continue;
        }

        // Upload to Supabase storage
        const fileName = `strategy-photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
        const { data, error: uploadError } = await supabase.storage
          .from('strategy-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Gagal mengunggah ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: publicData } = supabase.storage
          .from('strategy-photos')
          .getPublicUrl(fileName);

        uploadedPhotos.push({
          id: fileName,
          order: photos.length + uploadedPhotos.length,
          url: publicData.publicUrl,
          uploaded_at: new Date().toISOString(),
        });
      }

      // Save to database
      if (uploadedPhotos.length > 0) {
        const { error: insertError } = await supabase
          .from('strategy_photos')
          .insert(uploadedPhotos);

        if (insertError) {
          console.error('Insert error:', insertError);
          setError('Gagal menyimpan foto ke database');
          return;
        }

        setPhotos([...photos, ...uploadedPhotos]);
        setSuccess(`${uploadedPhotos.length} foto berhasil diunggah`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Terjadi kesalahan saat mengunggah');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Hapus foto ini?')) return;

    try {
      setError('');
      
      // Delete from storage
      const { error: deleteStorageError } = await supabase.storage
        .from('strategy-photos')
        .remove([id]);

      if (deleteStorageError) {
        console.error('Delete storage error:', deleteStorageError);
        setError('Gagal menghapus foto dari storage');
        return;
      }

      // Delete from database
      const { error: deleteDbError } = await supabase
        .from('strategy_photos')
        .delete()
        .eq('id', id);

      if (deleteDbError) {
        console.error('Delete db error:', deleteDbError);
        setError('Gagal menghapus foto dari database');
        return;
      }

      setPhotos(photos.filter(p => p.id !== id));
      setSuccess('Foto berhasil dihapus');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menghapus foto');
    }
  };

  const reorderPhotos = async (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);

    // Update order values
    const updatedPhotos = newPhotos.map((photo, index) => ({
      ...photo,
      order: index,
    }));

    setSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('strategy_photos')
        .upsert(
          updatedPhotos.map(p => ({ id: p.id, order: p.order })),
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Update error:', error);
        setError('Gagal menyimpan urutan foto');
        return;
      }

      setPhotos(updatedPhotos);
      setSuccess('Urutan foto berhasil diperbarui');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menyimpan urutan foto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Foto Strategi</h1>
          <p className="text-gray-600 mt-2">Kelola foto untuk bagian "Strategi Disesuaikan" di halaman utama (Maksimal {MAX_PHOTOS} foto)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Upload Area */}
        {photos.length < MAX_PHOTOS && (
          <div
            className={`mb-8 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Seret foto ke sini atau klik untuk memilih</p>
                <p className="text-sm text-gray-600 mt-1">Format: JPG, PNG (Maks 5MB per foto, {MAX_PHOTOS - photos.length} foto tersisa)</p>
              </div>
              <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                Pilih Foto
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleInputChange}
                  disabled={uploading || photos.length >= MAX_PHOTOS}
                  className="hidden"
                />
              </label>
              {uploading && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {photos.length >= MAX_PHOTOS && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Anda sudah mengunggah {MAX_PHOTOS} foto maksimal</p>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Foto yang Diunggah ({photos.length}/{MAX_PHOTOS})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer?.setData('photoIndex', index.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('ring-2', 'ring-primary');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('ring-2', 'ring-primary');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2', 'ring-primary');
                    const fromIndex = parseInt(e.dataTransfer?.getData('photoIndex') || '-1');
                    if (fromIndex !== -1 && fromIndex !== index) {
                      reorderPhotos(fromIndex, index);
                    }
                  }}
                >
                  <img
                    src={photo.url}
                    alt={`Strategy photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with delete button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      disabled={saving}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">💡 Seret foto untuk mengubah urutan tampilan</p>
          </div>
        )}

        {photos.length === 0 && !uploading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Belum ada foto. Mulai dengan mengunggah foto pertama Anda</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStrategyPhotos;
