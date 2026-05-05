import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import FadeIn from "@/components/FadeIn"
import SEO from "@/components/SEO"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading articles:', error)
        } else {
          setArticles(data || [])
        }
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    </Layout>
  )

  return (
    <>
      <SEO 
        title="Blog"
        description="Latest insights and articles from our team"
        keywords="blog, articles, insights, JADTRA Consulting"
      />
      <Layout>
        <section className="section-padding">
          <div className="container-narrow">
            <FadeIn>
              <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
                <div className="gold-divider mx-auto" />
                <p className="text-lg text-muted-foreground mt-6">
                  Latest insights and articles from our team
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {articles.length === 0 && (
          <section className="section-padding">
            <div className="container-narrow">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No articles yet</p>
              </div>
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="section-padding">
            <div className="container-narrow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <FadeIn key={article.id} delay={0.1}>
                    <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                      {article.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={article.featured_image_url} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                          <span className="mx-2">·</span>
                          <span>{article.read_time || 5} min read</span>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {article.title}
                        </h2>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt || article.content?.substring(0, 150) + '...'}
                        </p>
                        
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status}
                          </span>
                          
                          <a 
                            href={`/blog/${article.slug}`}
                            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
                          >
                            Read more
                          </a>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  )
}
