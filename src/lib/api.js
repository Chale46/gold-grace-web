// src/lib/api.js
import { supabase } from './supabase';

// API utility functions for common operations
export const api = {
  // Articles API
  articles: {
    // Get all articles
    getAll: async (options = {}) => {
      const { limit = 50, offset = 0, status = null, search = null } = options;
      
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      const { data, error } = await query;
      return { data, error };
    },

    // Get article by ID
    getById: async (id) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    },

    // Get article by slug
    getBySlug: async (slug) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      return { data, error };
    },

    // Create new article
    create: async (articleData) => {
      const { data, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      return { data, error };
    },

    // Update article
    update: async (id, articleData) => {
      const { data, error } = await supabase
        .from('articles')
        .update({ ...articleData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    // Delete article
    delete: async (id) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      return { error };
    },

    // Get published articles for public display
    getPublished: async (limit = 10) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      return { data, error };
    },

    // Get featured articles
    getFeatured: async (limit = 5) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      return { data, error };
    },

    // Increment view count
    incrementViews: async (id) => {
      const { error } = await supabase.rpc('increment_view_count', { article_uuid: id });
      return { error };
    }
  },

  // Contact Submissions API
  contacts: {
    // Get all contact submissions
    getAll: async (options = {}) => {
      const { limit = 50, offset = 0, status = null } = options;
      
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      return { data, error };
    },

    // Create new contact submission
    create: async (contactData) => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(contactData)
        .select()
        .single();

      return { data, error };
    },

    // Update contact status
    updateStatus: async (id, status) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      return { error };
    },

    // Delete contact submission
    delete: async (id) => {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      return { error };
    }
  },

  // Tax Calculator API
  taxCalculator: {
    // Get all calculations
    getAll: async (options = {}) => {
      const { limit = 50, offset = 0 } = options;
      
      const { data, error } = await supabase
        .from('tax_calculator_history')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return { data, error };
    },

    // Create new calculation record
    create: async (calculationData) => {
      const { data, error } = await supabase
        .from('tax_calculator_history')
        .insert(calculationData)
        .select()
        .single();

      return { data, error };
    },

    // Delete calculation record
    delete: async (id) => {
      const { error } = await supabase
        .from('tax_calculator_history')
        .delete()
        .eq('id', id);

      return { error };
    }
  },

  // Storage API for file uploads
  storage: {
    // Upload file to storage
    upload: async (bucket, path, file) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      return { data, error };
    },

    // Get public URL for file
    getPublicUrl: async (bucket, path) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { data };
    },

    // Delete file from storage
    delete: async (bucket, path) => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      return { error };
    },

    // Upload article image
    uploadArticleImage: async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `article-images/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (error) return { data: null, error };

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      return { data: { publicUrl, path: filePath }, error: null };
    }
  },

  // Authentication API
  auth: {
    // Sign in with email and password
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    },

    // Sign out
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    // Get current session
    getCurrentSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    },

    // Get current user
    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    },

    // Listen to auth state changes
    onAuthStateChange: (callback) => {
      return supabase.auth.onAuthStateChange(callback);
    }
  },

  // Utility functions
  utils: {
    // Generate slug from title
    generateSlug: (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    },

    // Calculate reading time
    calculateReadTime: (content) => {
      const wordsPerMinute = 200;
      const wordCount = content.split(/\s+/).length;
      return Math.ceil(wordCount / wordsPerMinute);
    },

    // Format date
    formatDate: (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    // Validate email format
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Sanitize user input to prevent XSS
    sanitizeInput: (input) => {
      if (typeof input !== 'string') return '';
      
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
    },

    // Sanitize HTML content (for rich text)
    sanitizeHTML: (html) => {
      if (typeof html !== 'string') return '';
      
      // Basic HTML sanitization - allow only safe tags
      const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    },

    // Validate file upload
    validateFileUpload: (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
      if (!file) return { valid: false, error: 'No file provided' };
      
      if (file.size > maxSize) {
        return { valid: false, error: 'File size too large' };
      }
      
      const fileType = file.type ?? '';
      if (!allowedTypes.includes(fileType)) {
        return { valid: false, error: 'File type not allowed' };
      }
      
      return { valid: true };
    },

    // Handle API errors
    handleError: (error) => {
      console.error('API Error:', error);
      if (error?.message) {
        return error.message;
      }
      return 'An unexpected error occurred';
    },

    // Check if response is successful
    isSuccess: (response) => {
      return !response.error && response.data;
    }
  },

  // Site Content API
  siteContent: {
    // Get all site content
    getAll: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      return { data, error };
    },

    // Get content by key
    getByKey: async (key) => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', key)
        .single();

      return { data, error };
    },

    // Update content (upsert)
    update: async (key, content) => {
      let { data, error } = await supabase
        .from('site_content')
        .upsert({
          key,
          value: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
        .select()
        .single();

      if (error?.message?.toLowerCase().includes('column') && error.message.toLowerCase().includes('value')) {
        const fallback = await supabase
          .from('site_content')
          .upsert({
            key,
            content,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          })
          .select()
          .single();

        data = fallback.data;
        error = fallback.error;
      }

      return { data, error };
    },

    // Get content object (for public site)
    getContentMap: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) return { data: null, error };

      // Convert array to object keyed by key
      const contentMap = {};
      data?.forEach(item => {
        contentMap[item.key] = item.value ?? item.content ?? '';
      });

      return { data: contentMap, error: null };
    }
  },

  // Analytics - Web Vitals
  analytics: {
    // Post web vitals data
    postWebVitals: async (webVitalsData) => {
      try {
        // Validate required fields
        const { id, name, value, delta, url, timestamp } = webVitalsData;
        
        if (!id || !name || value === undefined || !url || !timestamp) {
          return {
            success: false,
            error: 'Missing required fields: id, name, value, url, timestamp',
            status: 400
          };
        }

        // Get additional context
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        const device = getDeviceType();
        const connection = getConnectionType();
        const memory = getMemoryInfo();

        // Prepare data for Supabase
        const webVitalsRecord = {
          id,
          name,
          value,
          delta,
          url,
          timestamp: new Date(timestamp).toISOString(),
          user_agent: userAgent,
          device,
          connection,
          memory,
          created_at: new Date().toISOString()
        };

        // Insert into Supabase
        const { data, error } = await supabase
          .from('web_vitals')
          .insert([webVitalsRecord])
          .select();

        if (error) {
          console.error('Error inserting web vitals:', error);
          return {
            success: false,
            error: 'Failed to store web vitals data',
            status: 500
          };
        }

        return {
          success: true,
          data: data[0],
          message: 'Web vitals recorded successfully'
        };

      } catch (error) {
        console.error('Web vitals API error:', error);
        return {
          success: false,
          error: 'Internal server error',
          status: 500
        };
      }
    },

    // Get web vitals analytics
    getWebVitals: async (filters = {}) => {
      try {
        const { url, name, limit = 100, offset = 0 } = filters;

        let query = supabase
          .from('web_vitals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
          .range(offset, offset + limit - 1);

        // Apply filters
        if (url) {
          query = query.eq('url', url);
        }
        if (name) {
          query = query.eq('name', name);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching web vitals:', error);
          return {
            success: false,
            error: 'Failed to fetch web vitals data',
            status: 500
          };
        }

        // Calculate statistics
        const stats = data.reduce((acc, record) => {
          if (!acc[record.name]) {
            acc[record.name] = {
              count: 0,
              avg: 0,
              min: Infinity,
              max: -Infinity,
              latest: 0
            };
          }
          
          const stat = acc[record.name];
          stat.count++;
          stat.avg = (stat.avg * (stat.count - 1) + record.value) / stat.count;
          stat.min = Math.min(stat.min, record.value);
          stat.max = Math.max(stat.max, record.value);
          
          if (record.timestamp > stat.latest) {
            stat.latest = record.value;
          }
          
          return acc;
        }, {});

        return {
          success: true,
          data,
          stats,
          total: data.length
        };

      } catch (error) {
        console.error('Web vitals GET error:', error);
        return {
          success: false,
          error: 'Internal server error',
          status: 500
        };
      }
    },

    // Delete web vitals data
    deleteWebVitals: async (filters = {}) => {
      try {
        const { olderThan, url } = filters;

        let query = supabase.from('web_vitals').delete();

        if (olderThan) {
          query = query.lt('created_at', olderThan);
        }
        if (url) {
          query = query.eq('url', url);
        }

        const { error } = await query;

        if (error) {
          console.error('Error deleting web vitals:', error);
          return {
            success: false,
            error: 'Failed to delete web vitals data',
            status: 500
          };
        }

        return {
          success: true,
          message: 'Web vitals data deleted successfully'
        };

      } catch (error) {
        console.error('Web vitals DELETE error:', error);
        return {
          success: false,
          error: 'Internal server error',
          status: 500
        };
      }
    }
  },

  // Health Check API
  health: {
    // Check API and service health
    check: async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Health check failed',
            status: response.status
          };
        }

        return {
          success: true,
          data: data
        };

      } catch (error) {
        console.error('Health check error:', error);
        return {
          success: false,
          error: 'Network error',
          message: error.message
        };
      }
    }
  },

  // Contact Form API
  contact: {
    // Submit contact form
    submit: async (formData) => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Contact form submission failed',
            message: data.message || 'Please try again later',
            status: response.status
          };
        }

        return {
          success: true,
          data: data,
          message: data.message || 'Contact form submitted successfully'
        };

      } catch (error) {
        console.error('Contact form error:', error);
        return {
          success: false,
          error: 'Network error',
          message: 'Failed to submit contact form. Please check your connection.'
        };
      }
    }
  },

  // Ping API
  ping: {
    // Simple ping test
    send: async (data = null) => {
      try {
        const response = await fetch('/api/ping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data || {})
        });

        const result = await response.json();
        
        if (!response.ok) {
          return {
            success: false,
            error: result.error || 'Ping failed',
            message: result.message || 'Please try again later',
            status: response.status
          };
        }

        return {
          success: true,
          data: result,
          message: result.message || 'Ping successful'
        };

      } catch (error) {
        console.error('Ping error:', error);
        return {
          success: false,
          error: 'Network error',
          message: 'Failed to ping server. Please check your connection.'
        };
      }
    },

    // Get ping info
    get: async () => {
      try {
        const response = await fetch('/api/ping');
        const result = await response.json();
        
        if (!response.ok) {
          return {
            success: false,
            error: result.error || 'Ping failed',
            status: response.status
          };
        }

        return {
          success: true,
          data: result
        };

      } catch (error) {
        console.error('Ping GET error:', error);
        return {
          success: false,
          error: 'Network error',
          message: 'Failed to connect to server'
        };
      }
    }
  }
};

// Utility functions for web vitals
const getDeviceType = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getConnectionType = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? connection.effectiveType : 'unknown';
  }
  return 'unknown';
};

const getMemoryInfo = () => {
  if (typeof navigator === 'undefined') return null;
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory * 1024 * 1024 * 1024; // Convert GB to bytes
  }
  return null;
};

// Export default for convenience
export default api;
