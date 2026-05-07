import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ArticleEditor from '@/components/ArticleEditor';
import AdminLayout from '@/components/admin/AdminLayout';
import { Article } from '@/types/Article';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';


const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading articles:', error);
        setArticles([]);
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setEditorMode('create');
    setShowEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setEditorMode('edit');
    setShowEditor(true);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setDeleting(articleId);
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      // Remove from local state
      setArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    } finally {
      setDeleting(null);
    }
  };

  const handleSaveArticle = (article: Article) => {
    if (editorMode === 'create') {
      setArticles(prev => [article, ...prev]);
    } else {
      setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    }
    setShowEditor(false);
    setEditingArticle(null);
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  const formatDateSafe = (dateValue?: string) => {
    if (!dateValue) return 'Not published';
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? 'Not published' : parsedDate.toLocaleDateString();
  };

  const filteredArticles = articles.filter(article => {
    const normalizedSearchTerm = (searchTerm ?? '').toLowerCase();
    const authorText = article.author || '';
    const excerptText = article.excerpt || '';
    const titleText = article.title || '';

    const matchesSearch = titleText.toLowerCase().includes(normalizedSearchTerm) ||
                         excerptText.toLowerCase().includes(normalizedSearchTerm) ||
                         authorText.toLowerCase().includes(normalizedSearchTerm);
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (showEditor) {
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSaveArticle}
        onCancel={handleCancelEditor}
        mode={editorMode}
      />
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
            <p className="text-gray-500 mt-1">Manage your blog articles</p>
          </div>
          <button
            onClick={handleCreateArticle}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showFilters && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        All
                      </button>
                      <button
                        onClick={() => { setStatusFilter('published'); setShowFilters(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        Published
                      </button>
                      <button
                        onClick={() => { setStatusFilter('draft'); setShowFilters(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => { setStatusFilter('archived'); setShowFilters(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        Archived
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No articles found</p>
                      <button
                        onClick={handleCreateArticle}
                        className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create your first article
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {article.excerpt}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {(Array.isArray(article.tags) ? article.tags : []).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{article.author || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                          {getStatusIcon(article.status)}
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDateSafe(article.published_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{article.read_time} min</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View article"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditArticle(article)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteArticle(article.id)}
                            disabled={deleting === article.id}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete article"
                          >
                            {deleting === article.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Website
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminArticles;
