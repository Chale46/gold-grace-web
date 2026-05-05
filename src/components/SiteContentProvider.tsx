// ========================================
// SITE CONTENT PROVIDER
// ========================================
// Fetch and provide site content to all components

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteContentData {
  header_html?: string;
  homepage_content?: string;
  footer_html?: string;
  site_title?: string;
}

interface SiteContentContextType {
  content: SiteContentData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return context;
};

interface SiteContentProviderProps {
  children: ReactNode;
}

export const SiteContentProvider: React.FC<SiteContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<SiteContentData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        console.error('Error loading site content:', error);
        setError('Failed to load site content');
        return;
      }

      // Map data to object using the exact specified logic
      const contentMap: SiteContentData = {};
      data?.forEach((item) => {
        contentMap[item.key] = item.value;
      });

      setContent(contentMap);
    } catch (err) {
      console.error('Error loading site content:', err);
      setError('Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadContent();
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export default SiteContentProvider;
