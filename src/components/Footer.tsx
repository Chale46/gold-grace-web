import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { createSafeHTML } from "@/utils/xsProtection";
import jadtraLogo from "@/assets/jadtra-logo.jpg";

interface SiteContent {
  hero_title?: string;
  hero_subtitle?: string;
  footer_company?: string;
  footer_email?: string;
  footer_phone?: string;
  footer_address?: string;
  nav_home?: string;
  nav_about?: string;
  nav_services?: string;
  nav_contact?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_linkedin?: string;
  social_facebook?: string;
  social_instagram?: string;
  company_name?: string;
  company_tagline?: string;
  company_description?: string;
}

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [content, setContent] = useState<SiteContent>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*')

      const map: SiteContent = {}
      data.forEach(item => {
        map[item.key as keyof SiteContent] = item.value
      })

      setContent(map)
    }

    load()
  }, [])

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.services"), path: "/services" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  return (
    <footer className="bg-background text-foreground transition-colors duration-300">
      <div className="container-narrow py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img 
              src={jadtraLogo} 
              alt="JADTRA Consulting" 
              className="h-16 w-auto mb-4" 
            />
            <p className="text-sm text-muted-foreground">
              KKP Hakim Muhamad dan Rekan
            </p>
            <div className="gold-divider mt-4" />
          </div>
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-primary mb-4">
              {t("footer.navigation")}
            </h4>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-primary mb-4">
              {t("footer.contact")}
            </h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>info@jadtraconsulting.com</p>
              <p>+62 21 0000 0000</p>
              <p>Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-xs border-border text-muted-foreground">
          © {new Date().getFullYear()} {content.footer_company || 'JADTRA Consulting'}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
