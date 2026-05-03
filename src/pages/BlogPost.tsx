import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, Clock, User, ArrowLeft, Share2, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { articleSchema, breadcrumbSchema } from "@/utils/structuredData";

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
}

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const { t } = useLanguage();

  // Mock blog posts data - in production, this would come from API
  const blogPosts: Record<string, BlogPostData> = {
    "pajak-penghasilan-2024": {
      id: "pajak-penghasilan-2024",
      title: "Panduan Lengkap Pajak Penghasilan 2024: Perubahan Terbaru dan Tips Optimasi",
      content: `
        <h2>Pengenalan Pajak Penghasilan 2024</h2>
        <p>Pajak Penghasilan (PPh) merupakan salah satu jenis pajak yang paling signifikan dalam sistem perpajakan Indonesia. Tahun 2024 membawa beberapa perubahan penting yang perlu dipahami oleh wajib pajak.</p>
        
        <h3>Perubahan Tarif PPh 21 Terbaru</h3>
        <p>Tarif PPh 21 untuk tahun 2024 mengalami penyesuaian sebagai berikut:</p>
        <ul>
          <li>Penghasilan hingga Rp60 juta: 5%</li>
          <li>Penghasilan Rp60-250 juta: 15%</li>
          <li>Penghasilan Rp250-500 juta: 25%</li>
          <li>Penghasilan Rp500-5 miliar: 30%</li>
          <li>Penghasilan di atas Rp5 miliar: 35%</li>
        </ul>
        
        <h3>Tips Optimasi Pajak</h3>
        <p>Untuk mengoptimalkan pajak Anda, pertimbangkan strategi berikut:</p>
        <ol>
          <li>Manfaatkan semua deductible expenses</li>
          <li>Persiapkan dokumen dengan baik</li>
          <li>Gunakan fasilitas tax deduction yang tersedia</li>
          <li>Konsultasikan dengan profesional pajak</li>
        </ol>
        
        <h3>Kesimpulan</h3>
        <p>Memahami perubahan tarif PPh 2024 dan menerapkan strategi optimasi yang tepat akan membantu individu dan bisnis mengelola kewajiban pajak secara lebih efektif.</p>
      `,
      author: "Tim JADTRA Consulting",
      publishDate: "2024-04-01",
      readTime: "5 menit",
      category: "Pajak Penghasilan",
      tags: ["PPh 21", "Tarif Pajak", "Optimasi Pajak"]
    },
    "pajak-umkm-digital": {
      id: "pajak-umkm-digital",
      title: "Strategi Pajak untuk UMKM di Era Digital: Peluang dan Tantangan",
      content: `
        <h2>UMKM Digital dan Perpajakan</h2>
        <p>Transformasi digital membawa peluang baru bagi UMKM, namun juga menciptakan tantangan perpajakan yang perlu dipahami.</p>
        
        <h3>Fasilitas Pajak untuk UMKM</h3>
        <p>Pemerintah menyediakan beberapa fasilitas pajak khusus untuk UMKM:</p>
        <ul>
          <li>PPh Final 0.5% untuk omzet hingga Rp4.8 miliar</li>
          <li>Pembebasan PPN untuk UMKM tertentu</li>
          <li>Insentif fiskal untuk sektor prioritas</li>
        </ul>
        
        <h3>Tantangan yang Dihadapi</h3>
        <p>UMKM digital menghadapi tantangan dalam:</p>
        <ol>
          <li>Pencatatan transaksi digital</li>
          <li>Kepatuhan perpajakan online</li>
          <li>Pemahaman regulasi e-commerce</li>
          <li>Integrasi sistem pembayaran</li>
        </ol>
        
        <h3>Rekomendasi</h3>
        <p>UMKM digital sebaiknya:</p>
        <ul>
          <li>Menggunakan software akuntansi digital</li>
          <li>Melakukan konsultasi pajak reguler</li>
          <li>Memanfaatkan fasilitas yang tersedia</li>
          <li>Membangun sistem pencatatan yang baik</li>
        </ul>
      `,
      author: "Tim JADTRA Consulting",
      publishDate: "2024-03-28",
      readTime: "4 menit",
      category: "UMKM",
      tags: ["UMKM", "Digital", "Pajak Online"]
    },
    "transfer-pricing-guide": {
      id: "transfer-pricing-guide",
      title: "Transfer Pricing 101: Panduan Dasar untuk Transaksi Antar Perusahaan",
      content: `
        <h2>Apa itu Transfer Pricing?</h2>
        <p>Transfer pricing adalah penetapan harga untuk transaksi antar perusahaan dalam grup multinasional yang terkait. Tujuannya adalah untuk memastikan harga yang ditetapkan wajar dan sesuai dengan prinsip arm's length.</p>
        
        <h3>Metode Transfer Pricing</h3>
        <p>Terdapat beberapa metode yang dapat digunakan:</p>
        <ul>
          <li>Comparable Uncontrolled Price (CUP)</li>
          <li>Cost Plus Method</li>
          <li>Resale Price Method</li>
          <li>Profit Split Method</li>
          <li>Transactional Net Margin Method (TNMM)</li>
        </ul>
        
        <h3>Dokumentasi Transfer Pricing</h3>
        <p>Dokumentasi yang diperlukan meliputi:</p>
        <ol>
          <li>Master file</li>
          <li>Local file</li>
          <li>Country-by-country report</li>
          <li>Dokumentasi transaksi spesifik</li>
        </ol>
        
        <h3>Best Practices</h3>
        <p>Untuk implementasi transfer pricing yang efektif:</p>
        <ul>
          <li>Lakukan analisis comparability</li>
          <li>Pilih metode yang paling appropriate</li>
          <li>Dokumentasikan dengan baik</li>
          <li>Review secara berkala</li>
        </ul>
      `,
      author: "Tim JADTRA Consulting",
      publishDate: "2024-03-25",
      readTime: "6 menit",
      category: "Transfer Pricing",
      tags: ["Transfer Pricing", "Multinasional", "Dokumentasi"]
    },
    "pajak-internasional": {
      id: "pajak-internasional",
      title: "Pajak Internasional: Panduan untuk Ekspansi Bisnis ke Luar Negeri",
      content: `
        <h2>Pengenalan Pajak Internasional</h2>
        <p>Ketika bisnis berekspansi ke luar negeri, perusahaan akan menghadapi kompleksitas pajak internasional yang perlu dipahami dengan baik.</p>
        
        <h3>Double Taxation Agreement (DTA)</h3>
        <p>Indonesia memiliki DTA dengan banyak negara untuk menghindari pengenaan pajak ganda. Manfaatkan DTA untuk:</p>
        <ul>
          <li>Mengurangi tarif pajak di negara sumber</li>
          <li>Menghindari pengenaan pajak ganda</li>
          <li>Meningkatkan kepastian hukum</li>
          <li>Mengurangi biaya pajak</li>
        </ul>
        
        <h3>Struktur Perpajakan Internasional</h3>
        <p>Pertimbangkan struktur berikut:</p>
        <ol>
          <li>Permanent Establishment (PE)</li>
          <li>Controlled Foreign Company (CFC)</li>
          <li>Treaty Shopping</li>
          <li>Thin Capitalization</li>
        </ol>
        
        <h3>Strategi Ekspansi</h3>
        <p>Untuk ekspansi yang efisien secara pajak:</p>
        <ul>
          <li>Analisis DTA yang tersedia</li>
          <li>Pilih struktur investasi optimal</li>
          <li>Perhatikan aturan CFC</li>
          <li>Optimalkan struktur pembiayaan</li>
        </ul>
      `,
      author: "Tim JADTRA Consulting",
      publishDate: "2024-03-22",
      readTime: "7 menit",
      category: "Pajak Internasional",
      tags: ["Internasional", "DTA", "Ekspansi"]
    },
    "tax-compliance-tips": {
      id: "tax-compliance-tips",
      title: "10 Tips Jitu untuk Kepatuhan Pajak yang Optimal",
      content: `
        <h2>Importansi Kepatuhan Pajak</h2>
        <p>Kepatuhan pajak bukan hanya kewajiban hukum, tetapi juga investasi dalam keberlanjutan bisnis. Berikut 10 tips untuk memastikan kepatuhan optimal.</p>
        
        <h3>Tips Kepatuhan Pajak</h3>
        <ol>
          <li><strong>Maintain accurate records</strong> - Simpan semua dokumen dengan rapi</li>
          <li><strong>Understand deadlines</strong> - Catat semua tanggal jatuh tempo pembayaran</li>
          <li><strong>Use technology</strong> - Manfaatkan software akuntansi dan pajak</li>
          <li><strong>Regular reviews</strong> - Lakukan review berkala untuk identifikasi masalah</li>
          <li><strong>Professional consultation</strong> - Konsultasikan dengan ahli pajak</li>
          <li><strong>Stay updated</strong> - Ikuti perkembangan regulasi terbaru</li>
          <li><strong>Internal controls</strong> - Implementasikan sistem kontrol internal</li>
          <li><strong>Training staff</strong> - Latih tim tentang prosedur pajak</li>
          <li><strong>Document everything</strong> - Dokumentasikan semua keputusan pajak</li>
          <li><strong>Plan ahead</strong> - Buat perencanaan pajak jangka panjang</li>
        </ol>
        
        <h3>Common Mistakes to Avoid</h3>
        <p>Hindari kesalahan umum seperti:</p>
        <ul>
          <li>Terlambat pembayaran pajak</li>
          <li>Kesalahan perhitungan</li>
          <li>Dokumentasi tidak lengkap</li>
          <li>Tidak mengikuti update regulasi</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Kepatuhan pajak yang baik akan membantu bisnis Anda beroperasi secara lancar dan menghindari masalah dengan otoritas pajak.</p>
      `,
      author: "Tim JADTRA Consulting",
      publishDate: "2024-03-20",
      readTime: "5 menit",
      category: "Kepatuhan Pajak",
      tags: ["Compliance", "Best Practices", "Risk Management"]
    }
  };

  const post = blogPosts[postId || ""];

  if (!post) {
    return (
      <Layout>
        <div className="container-narrow py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">Maaf, artikel yang Anda cari tidak tersedia.</p>
          <Link to="/blog" className="text-primary hover:underline">
            Kembali ke Blog
          </Link>
        </div>
      </Layout>
    );
  }

  const structuredData = articleSchema(
    post.title,
    post.content.replace(/<[^>]*>/g, '').substring(0, 200),
    post.publishDate,
    post.author
  );

  const breadcrumbs = [
    { name: 'Home', url: 'https://jadtraconsulting.com' },
    { name: 'Blog', url: 'https://jadtraconsulting.com/blog' },
    { name: post.title, url: `https://jadtraconsulting.com/blog/${post.id}` },
  ];

  const shareUrl = `https://jadtraconsulting.com/blog/${post.id}`;

  return (
    <>
      <SEO 
        title={post.title}
        description={post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        keywords={post.tags.join(', ')}
        canonical={shareUrl}
        structuredData={structuredData}
      />
      <Layout>
        <section className="section-padding">
          <div className="container-narrow">
            <FadeIn>
              <Breadcrumb items={breadcrumbs} className="mb-6" />
              
              <div className="mb-8">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Blog
                </Link>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          url: shareUrl,
                        });
                      } else {
                        navigator.clipboard.writeText(shareUrl);
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Bagikan
                  </button>
                </div>
              </div>
              
              <div 
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Butuh Konsultasi Pajak?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tim JADTRA Consulting siap membantu Anda dengan solusi pajak yang komprehensif dan disesuaikan dengan kebutuhan bisnis Anda.
                  </p>
                  <Link 
                    to="/contact"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-all duration-300"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BlogPost;
