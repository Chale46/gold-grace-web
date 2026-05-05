import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import useSiteContent from "@/hooks/useSiteContent";
import jadtraLogo from "@/assets/jadtra-logo.jpg";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { content } = useSiteContent();

  const navItems = [
    { name: content.nav_home || t("nav.home"), path: "/" },
    { name: content.nav_about || t("nav.about"), path: "/about" },
    { name: content.nav_services || t("nav.services"), path: "/services" },
    { name: content.nav_blog || "Blog", path: "/blog" },
    { name: content.nav_tax || t("taxCalculator"), path: "/tax-calculator" },
    { name: content.nav_contact || t("nav.contact"), path: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <img src={jadtraLogo} alt="JADTRA Consulting" className="h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm tracking-wide uppercase transition-colors duration-200 hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
            aria-label="Toggle language"
          >
            <Globe size={16} />
            {lang === "en" ? "ID" : "EN"}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1"
            aria-label="Toggle language"
          >
            <Globe size={14} />
            {lang === "en" ? "ID" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-6 py-6 flex flex-col gap-4 shadow-lg z-40">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm tracking-wide uppercase py-2 transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
