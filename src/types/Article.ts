// ========================================
// UNIFIED ARTICLE INTERFACE - FINAL SCHEMA
// ========================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  read_time: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  view_count: number;
  is_featured: boolean;
  author_id?: string;
  author?: string;
}

// Form data interface for create/update operations
export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  is_featured: boolean;
}

// API response types
export interface ArticleResponse {
  data?: Article;
  error?: any;
}

export interface ArticleListResponse {
  data?: Article[];
  error?: any;
}
