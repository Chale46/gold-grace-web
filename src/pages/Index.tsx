import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Briefcase, Calculator, Monitor, Settings, Award, ShieldCheck, TrendingUp,
  MessageSquare, Search, Rocket, BarChart3, Lock, Workflow, Handshake,
  CheckCircle2, BarChart, Zap, Target
} from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { createSafeHTML } from "@/utils/xsProtection";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/utils/structuredData";

interface SiteContent {
  // 🔝 HEADER / NAVIGATION
  site_title?: string;
  nav_home?: string;
  nav_about?: string;
  nav_services?: string;
  nav_blog?: string;
  nav_tax?: string;
  nav_contact?: string;

  // 🏠 HERO SECTION
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  cta_primary?: string;
  cta_secondary?: string;

  // 📊 STATISTICS
  stat_exp?: string;
  stat_clients?: string;
  stat_satisfaction?: string;
  stat_support?: string;

  // 🏢 ABOUT SECTION
  about_text?: string;

  // 🧩 SERVICES SECTION
  services_title?: string;
  service_1_title?: string;
  service_1_desc?: string;
  service_2_title?: string;
  service_2_desc?: string;
  service_3_title?: string;
  service_3_desc?: string;
  service_4_title?: string;
  service_4_desc?: string;

  // 🦶 FOOTER SECTION
  footer_company?: string;
  footer_email?: string;
  footer_phone?: string;
  footer_location?: string;
  footer_copyright?: string;
}

const Index = () => {
  const { t, lang } = useLanguage();
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

  const services = [
    { icon: Briefcase, title: t("home.services.business.title"), desc: t("home.services.business.desc") },
    { icon: Calculator, title: t("home.services.tax.title"), desc: t("home.services.tax.desc") },
    { icon: Monitor, title: t("home.services.digital.title"), desc: t("home.services.digital.desc") },
    { icon: Settings, title: t("home.services.system.title"), desc: t("home.services.system.desc") },
  ];

  const whyUs = [
    { icon: Award, title: t("home.whyUs.professional.title"), desc: t("home.whyUs.professional.desc") },
    { icon: ShieldCheck, title: t("home.whyUs.trusted.title"), desc: t("home.whyUs.trusted.desc") },
    { icon: TrendingUp, title: t("home.whyUs.growth.title"), desc: t("home.whyUs.growth.desc") },
  ];

  const steps = [
    { icon: MessageSquare, num: "01", title: t("home.howWeWork.step1.title"), desc: t("home.howWeWork.step1.desc") },
    { icon: Search, num: "02", title: t("home.howWeWork.step2.title"), desc: t("home.howWeWork.step2.desc") },
    { icon: Rocket, num: "03", title: t("home.howWeWork.step3.title"), desc: t("home.howWeWork.step3.desc") },
    { icon: BarChart3, num: "04", title: t("home.howWeWork.step4.title"), desc: t("home.howWeWork.step4.desc") },
  ];

  const trustReasons = [
    { icon: Award, title: t("home.trust.professional.title"), desc: t("home.trust.professional.desc") },
    { icon: Lock, title: t("home.trust.confidential.title"), desc: t("home.trust.confidential.desc") },
    { icon: Workflow, title: t("home.trust.structured.title"), desc: t("home.trust.structured.desc") },
    { icon: Handshake, title: t("home.trust.partnership.title"), desc: t("home.trust.partnership.desc") },
  ];

  const structuredData = {
    ...organizationSchema,
    ...localBusinessSchema,
    ...websiteSchema,
  };

  return (
    <>
      <SEO 
        title={t("home.hero.title")}
        description={t("home.hero.desc")}
        keywords="business consulting, tax advisory, digital transformation, KKP Hakim Muhamad dan Rekan, JADTRA Consulting"
        structuredData={structuredData}
      />
      <Layout>
      {/* Hero - Enhanced Client Experience */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-amber-500/5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-transparent blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-500/8 via-amber-500/4 to-transparent blur-xl translate-x-1/4 translate-y-1/4 pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />
        <div className="container-narrow relative">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                {content.hero_badge || 'Trusted by 500+ Companies'}
              </p>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-foreground mb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-lg">
                {content.hero_title || 'Trusted Consulting Partner for Business Growth'}
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                {content.hero_subtitle || 'Professional consulting services in business, taxation, and digital systems delivering certainty, growth, and sustainability.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  {content.cta_primary || 'Consult Now'}
                </Link>
                <Link
                  to="/tax-calculator"
                  className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors duration-200"
                >
                  {content.cta_secondary || 'Tax Calculator'}
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Clients Served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-secondary section-padding">
        <div className="container-narrow">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <div className="gold-divider mx-auto mb-8" />
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t("home.intro")}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-blue-500/3" />
        <div className="container-narrow relative">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Our Services</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">{t("home.services.title")}</h2>
              <div className="gold-divider mx-auto" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 mx-auto border border-white/30">
                      <s.icon className="text-primary" size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base mb-6">{s.desc}</p>
                    <div className="pt-6 border-t border-white/20">
                      <Link 
                        to="/services" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300"
                      >
                        Learn more
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="bg-secondary section-padding">
        <div className="container-narrow">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">{t("home.howWeWork.title")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.howWeWork.subtitle")}</p>
              <div className="gold-divider mx-auto mt-8" />
            </div>
          </FadeIn>
          <div className="relative">
            <div className="hidden md:block absolute top-20 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[2px] bg-primary/30" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {steps.map((step, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="relative text-center group">
                    {i < steps.length - 1 && (
                      <div className="md:hidden absolute left-1/2 top-[80px] w-[2px] h-[calc(100%+3rem)] bg-primary/20 -translate-x-1/2" />
                    )}
                    <div className="relative z-10 w-16 h-16 mx-auto rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-lg">
                      <step.icon size={24} strokeWidth={1.5} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <span className="text-xs font-medium text-primary tracking-widest uppercase mb-3 block">{step.num}</span>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Clients Trust Us */}
      <section className="section-padding">
        <div className="container-narrow">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">{t("home.trust.title")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.trust.subtitle")}</p>
              <div className="gold-divider mx-auto mt-8" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustReasons.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group text-center p-8 rounded-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background border border-border/50 hover:border-primary/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="text-primary" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-secondary section-padding">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div className="text-center lg:text-left">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">{t("home.approach.title")}</h2>
                <div className="gold-divider mx-auto lg:mx-0 mt-4 mb-10" />
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("home.approach.desc")}
                </p>
                <div className="space-y-6">
                  {[
                    { icon: BarChart, label: t("home.approach.data"), desc: "Data-driven insights for informed decisions" },
                    { icon: Zap, label: t("home.approach.practical"), desc: "Practical solutions for real-world challenges" },
                    { icon: Target, label: t("home.approach.scalable"), desc: "Scalable strategies that grow with your business" },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="text-primary" size={20} strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-foreground mb-1">{item.label}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="aspect-square relative">
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-sm rotate-3" />
                  <div className="absolute inset-4 border-2 border-primary/30 rounded-sm -rotate-2" />
                  <div className="absolute inset-8 bg-primary/5 rounded-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Target className="text-primary" size={32} strokeWidth={1.5} />
                      </div>
                      <p className="font-heading text-lg font-semibold text-foreground">{t("home.approach.graphic.title")}</p>
                      <p className="text-muted-foreground text-sm mt-1">{t("home.approach.graphic.sub")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-narrow">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{t("home.whyUs.title")}</h2>
              <div className="gold-divider mx-auto mt-4" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {whyUs.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group p-6 rounded-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="text-primary" size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-narrow text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t("home.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              {t("home.cta.desc")}
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] transition-all duration-300"
            >
              {t("home.cta.button")}
            </Link>
          </FadeIn>
        </div>
      </section>
      </Layout>
    </>
  );
};

export default Index;
