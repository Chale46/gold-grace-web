import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, ArrowLeft, User, Tag } from 'lucide-react'
import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'
import SEO from '@/components/SEO'

export default function BlogDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      
      // SAFE UUID CHECK
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)

      let query = supabase
        .from('articles')
        .select('*')

      if (isUUID) {
        query = query.eq('id', slug)
      } else {
        query = query.eq('slug', slug)
      }

      const { data, error } = await query.single()

      setArticle(data)
      setLoading(false)
    }

    load()
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow">
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!article) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow">
            <div className="text-center py-20">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Article Not Found</h2>
              <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title={article.title}
        description={article.excerpt || article.content.slice(0, 160)}
      />
      
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {article.featured_image_url ? (
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            
            {/* Back Button */}
            <div className="absolute top-8 left-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container-narrow">
                <FadeIn>
                  <div className="max-w-4xl">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                      {article.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {article.read_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {article.read_time} min read
                        </div>
                      )}
                      {article.author && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        ) : (
          <div className="section-padding bg-secondary">
            <div className="container-narrow">
              <div className="mb-8">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-primary rounded-xl hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
              
              <FadeIn>
                <div className="text-center max-w-4xl mx-auto">
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground mb-12">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {article.read_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {article.read_time} min read
                      </div>
                    )}
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              {/* Excerpt */}
              {article.excerpt && (
                <div className="mb-12">
                  <div className="bg-secondary p-8 rounded-2xl border-l-4 border-primary">
                    <p className="text-lg text-muted-foreground italic leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed space-y-6">
                  {article.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-base md:text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Back to Blog */}
              <div className="mt-16 pt-8 border-t border-border">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  )
}
