import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function BlogDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single()

      setArticle(data)
    }

    load()
  }, [slug])

  if (!article) return <div style={{ padding: 24 }}>Loading...</div>

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: 'auto' }}>
      {article.featured_image_url && (
        <img
          src={article.featured_image_url}
          alt={article.title}
          style={{ width: '100%', borderRadius: 12, marginBottom: 16 }}
        />
      )}

      <h1>{article.title}</h1>
      <p style={{ color: '#777' }}>
        {new Date(article.created_at).toLocaleDateString()}
      </p>

      <div
        style={{ marginTop: 16 }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  )
}
