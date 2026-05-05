import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'

type Article = {
  id: string
  title: string
  excerpt?: string
  content: string
  featured_image_url?: string
  created_at: string
  published_at?: string
  read_time?: string
  status?: string
  tags?: string[]
  slug?: string
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setArticles(data as Article[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading articles...</div>

  if (!articles.length) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No articles yet</h2>
        <p>Create your first article from admin.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Blog</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20
      }}>
        {articles.map(a => (
          <Link
            key={a.id}
            to={`/blog/${a.slug || a.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <article style={{
              border: '1px solid #eee',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
              transition: '0.2s',
              cursor: 'pointer'
            }}>
              {/* Cover */}
              {a.featured_image_url && (
                <img
                  src={a.featured_image_url}
                  alt={a.title}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover'
                  }}
                />
              )}

              <div style={{ padding: 16 }}>
                <small style={{ color: '#777' }}>
                  {new Date(a.created_at).toLocaleDateString()}
                </small>

                <h3 style={{ margin: '8px 0' }}>{a.title}</h3>

                <p style={{ color: '#555' }}>
                  {a.excerpt || a.content.slice(0, 120) + '...'}
                </p>

                <span style={{
                  display: 'inline-block',
                  marginTop: 10,
                  fontWeight: 600
                }}>
                  Read more →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
