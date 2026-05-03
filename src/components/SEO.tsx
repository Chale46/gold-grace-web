import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { generateTaxServiceSchema, generateLocalBusinessSchema, generateFinancialServiceSchema } from '@/utils/taxServiceSchema';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

const defaultSEO = {
  title: 'JADTRA Consulting - Trusted Business & Tax Advisory',
  description: 'Professional business consulting, tax advisory, and digital transformation services under KKP Hakim Muhamad dan Rekan. Providing certainty, growth, and sustainability for your business.',
  keywords: 'business consulting, tax advisory, digital transformation, KKP Hakim Muhamad dan Rekan, JADTRA Consulting, Indonesia tax services',
  ogImage: 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/27ee335d-e45f-465d-b122-0fb4ca2e947c/id-preview-2d02893c--864d16f7-0da0-4f86-a83a-c047de2d1618.lovable.app-1775713207017.png',
  ogType: 'website' as const,
};

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  ogType = 'website',
  noIndex = false,
  structuredData 
}: SEOProps) => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  
  const finalTitle = title ? `${title} | JADTRA Consulting` : defaultSEO.title;
  const finalDescription = description || defaultSEO.description;
  const finalKeywords = keywords || defaultSEO.keywords;
  const finalOgImage = ogImage || defaultSEO.ogImage;
  const finalCanonical = canonical || `https://jadtraconsulting.com${window.location.pathname}`;

  const jsonLd = structuredData ? JSON.stringify(structuredData) : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="JADTRA Consulting" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language and Localization */}
      <html lang={lang} />
      <meta name="language" content={lang === 'id' ? 'Indonesian' : 'English'} />
      <meta name="geo.region" content="ID-JK" />
      <meta name="geo.placename" content="Jakarta, Indonesia" />
      <meta name="geo.position" content="-6.2088;106.8456" />
      <meta name="ICBM" content="-6.2088,106.8456" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="JADTRA Consulting - Professional Business & Tax Advisory" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="JADTRA Consulting" />
      <meta property="og:locale" content={lang === 'id' ? 'id_ID' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content="JADTRA Consulting - Professional Business & Tax Advisory" />
      <meta name="twitter:site" content="@jadtraconsulting" />
      <meta name="twitter:creator" content="@jadtraconsulting" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content={theme === 'dark' ? '#000000' : '#ffffff'} />
      <meta name="msapplication-TileColor" content={theme === 'dark' ? '#000000' : '#ffffff'} />
      <meta name="application-name" content="JADTRA Consulting" />
      <meta name="apple-mobile-web-app-title" content="JADTRA Consulting" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {jsonLd}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
