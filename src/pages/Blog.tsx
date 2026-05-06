import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, FileText } from 'lucide-react'
import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'
import SEO from '@/components/SEO'

type Article = {
  id: string
  title: string
  excerpt?: string
  content: string
  featured_image_url?: string
  created_at: string
  published_at?: string
  read_time?: number
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
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (!error && data) setArticles(data as Article[])
      setLoading(false)
    }
    load()
  }, [])

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

  if (!articles.length) {
    return (
      <Layout>
        <SEO 
          title="Blog - JADTRA Consulting"
          description="Business insights, tax tips, and consulting expertise from JADTRA Consulting team"
        />
        <div className="section-padding">
          <div className="container-narrow">
            <FadeIn>
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">No Articles Yet</h2>
                <p className="text-muted-foreground">Check back soon for insights from our consulting team.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO 
        title="Blog - JADTRA Consulting"
        description="Business insights, tax tips, and consulting expertise from JADTRA Consulting team"
      />
      
      {/* Blog Header - Refined Compact Hero */}
      <section className="py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-blue-500/3 to-amber-500/3" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/15 via-primary/8 to-primary/3 blur-2xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="container-narrow relative">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Insights & Articles</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Blog
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Expert insights on business consulting, tax advisory, and digital transformation from our experienced team.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <FadeIn key={article.id} delay={index * 0.1}>
                <Link
                  to={`/blog/${article.slug || article.id}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    {/* Featured Image */}
                    {article.featured_image_url ? (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-56 bg-gradient-to-br from-primary/10 via-blue-500/10 to-amber-500/10 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary/30" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {article.excerpt || article.content.slice(0, 150) + '...'}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {article.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
