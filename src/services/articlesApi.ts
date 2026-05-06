import { supabase } from '@/lib/supabase'

export interface Article {
  id: string
  title: string
  excerpt?: string
  content: string
  featured_image_url?: string
  slug: string
  created_at: string
}

export const articlesApi = {
  // CREATE
  create: async (article: Omit<Article, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single()
    
    return { data, error }
  },

  // READ ALL
  getAll: async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // READ BY ID/SLUG
  getById: async (idOrSlug: string) => {
    // SAFE UUID CHECK
const isUUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug)

let query = supabase
  .from('articles')
  .select('*')

if (isUUID) {
  query = query.eq('id', idOrSlug)
} else {
  query = query.eq('slug', idOrSlug)
}

const { data, error } = await query.single()
    
    return { data, error }
  },

  // UPDATE
  update: async (id: string, article: Partial<Article>) => {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // DELETE
  delete: async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    return { error }
  }
}
