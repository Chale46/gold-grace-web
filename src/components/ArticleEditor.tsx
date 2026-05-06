import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Article, ArticleFormData } from '@/types/Article';
import { compressImage, validateImageFile, createCompressedFile } from '@/utils/imageCompression';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  FileText,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const ArticleEditor = ({ article, onSave, onCancel, mode }: ArticleEditorProps) => {
  const [formData, setFormData] = useState<Article>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    status: 'draft',
    read_time: 5,
    tags: [],
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    is_featured: false,
    ...article
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (formData.title && !article) {
      // Auto-generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      setFormData(prev => ({ ...prev, slug }));
      
      // Auto-generate excerpt from content (first 150 chars)
      if (formData.content) {
        const excerpt = formData.content.substring(0, 150) + '...';
        setFormData(prev => ({ ...prev, excerpt }));
      }
    }
  }, [formData.title, formData.content, article]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Compress image while maintaining quality
      const compressedBlob = await compressImage(file, 1200, 0.8);
      const compressedFile = await createCompressedFile(file, compressedBlob);

      // Use Supabase storage for compressed image upload
      const fileName = `compressed_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, compressedFile);

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        featured_image_url: data.publicUrl,
        og_image_url: data.publicUrl
      }));

      setSuccess('Image compressed and uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.slug) {
        throw new Error('Title, content, and slug are required');
      }

      // Prepare article data with proper defaults
      const articleData = {
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        featured_image_url: formData.featured_image_url || '',
        slug: formData.slug || '',
        meta_title: formData.meta_title || '',
        meta_description: formData.meta_description || '',
        is_featured: formData.is_featured || false,
        status: formData.status || 'draft',
        tags: formData.tags || [],
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      let result;
      if (mode === 'create') {
        // Create new article
        result = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();
      } else {
        // Update existing article
        result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id!)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      onSave(result.data);

      setSuccess('Article saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      setError(error.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    const currentTags = formData.tags ?? [];
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags ?? []), trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateReadTime = () => {
    const wordsPerMinute = 200;
    const wordCount = formData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    setFormData(prev => ({ ...prev, read_time: Math.max(1, readTime) }));
  };

  useEffect(() => {
    calculateReadTime();
  }, [formData.content]);

  if (preview) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Preview</h1>
            <button
              onClick={() => setPreview(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Back to Editor
            </button>
          </div>
          
          <article className="prose prose-lg max-w-none">
            {formData.featured_image_url && (
              <img 
                src={formData.featured_image_url} 
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Admin
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {formData.read_time} min read
              </div>
            </div>
            
            {formData.excerpt && (
              <div className="bg-gray-50 p-4 rounded-lg mb-8 italic">
                {formData.excerpt}
              </div>
            )}
            
            <div className="whitespace-pre-wrap">{formData.content}</div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'create' ? 'Create Article' : 'Edit Article'}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[400px]"
                placeholder="Write your article content here..."
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                {formData.read_time} min read
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                placeholder="Brief description of the article"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Slug */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="article-url-slug"
                required
              />
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Featured Image
              </label>
              {formData.featured_image_url ? (
                <div className="space-y-4">
                  <img
                    src={formData.featured_image_url}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '', og_image_url: '' }))}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mr-2" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add tag"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">SEO Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
                    placeholder="SEO description"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Options</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-foreground">Featured Article</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
