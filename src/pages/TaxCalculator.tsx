import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import PPh21Calculator from "@/components/PPh21Calculator";
import { Calculator } from "lucide-react";
import { articleSchema, breadcrumbSchema } from "@/utils/structuredData";
import { useLanguage } from "@/contexts/LanguageContext";

const TaxCalculator = () => {
  const { t, language } = useLanguage();
  
  const breadcrumbs = [
    { name: t('home'), url: 'https://jadtraconsulting.com' },
    { name: t('taxCalculator'), url: 'https://jadtraconsulting.com/tax-calculator' },
  ];

  const structuredData = articleSchema(
    t('taxCalculatorTitle'),
    t('taxCalculatorDescription'),
    "2024-04-10",
    "Tim JADTRA Consulting"
  );

  return (
    <>
      <SEO 
        title={t('taxCalculatorTitle') + " - Gratis & Akurat 2026"}
        description={t('taxCalculatorDescription')}
        keywords="kalkulator PPh 21 2026, hitung PPh 21, PPh 21 online, kalkulator pajak, pajak penghasilan, tax calculator Indonesia"
        canonical="https://jadtraconsulting.com/tax-calculator"
        structuredData={structuredData}
      />
      <Layout>
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="container-narrow relative">
            <FadeIn>
              <Breadcrumb items={breadcrumbs} className="mb-6" />
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                    {t('taxCalculatorTitle')}
                  </h1>
                </div>
                <div className="gold-divider mx-auto mb-8" />
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                  {t('taxCalculatorIntro')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Gratis
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Akurat
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Update 2026
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary section-padding">
          <div className="container-narrow">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Perhitungan Instan</h3>
                  <p className="text-sm text-muted-foreground">Hasil perhitungan PPh 21 langsung tampil</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Tarif Terbaru 2026</h3>
                  <p className="text-sm text-muted-foreground">Menggunakan tarif PPh 21 terbaru</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Aman & Privasi</h3>
                  <p className="text-sm text-muted-foreground">Data Anda tidak disimpan di server</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="section-padding">
          <div className="container-narrow max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Kalkulator PPh 21
                </h2>
                <p className="text-lg text-muted-foreground">
                  Masukkan data penghasilan Anda untuk menghitung PPh 21 yang harus dibayar
                </p>
              </div>
              <div className="bg-background border border-border rounded-xl shadow-lg p-8">
                <PPh21Calculator />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-secondary section-padding">
          <div className="container-narrow">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Tips Optimasi Pajak
                </h2>
                <p className="text-lg text-muted-foreground">
                  Cara mengoptimalkan penghasilan bersih Anda dengan strategi pajak yang tepat
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-background border border-border rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-3">Deductible Expenses</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Biaya transportasi ke kantor</li>
                    <li>Biaya makan dan representasi</li>
                    <li>Biaya komunikasi dan internet</li>
                    <li>Biaya pengembangan diri</li>
                  </ul>
                </div>
                <div className="bg-background border border-border rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-3">Investasi Tax-Efficient</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Dana pensiun (DPPK)</li>
                    <li>Asuransi jiwa</li>
                    <li>Investasi saham</li>
                    <li>Reksadana</li>
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* About Calculator Section - Ultra Modern Interactive */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/3 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="container-narrow relative">
            <FadeIn>
              <div className="text-center mb-20">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
                  {t('aboutTaxCalculator')}
                </h2>
                <div className="gold-divider mx-auto mb-10" />
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  {t('taxCalculatorAboutText')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Features Ultra Interactive Box */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-3xl transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-background/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                        <Calculator className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{t('calculatorFeatures')}</h3>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {[
                        t('feature1'),
                        t('feature2'),
                        t('feature3'),
                        t('feature4'),
                        t('feature5')
                      ].map((feature, index) => (
                        <div key={index} className="flex items-start gap-4 group/item opacity-0 animate-in slide-in-from-left-2 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-300 shadow-md">
                            <div className="w-3 h-3 bg-white rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                          </div>
                          <div className="flex-1">
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 text-base leading-relaxed">{feature}</span>
                            <div className="h-px bg-gradient-to-r from-primary/20 to-transparent mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* How to Use Ultra Interactive Box */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-500/5 rounded-3xl transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-background/80 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-500/50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{t('howToUse')}</h3>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-500/50 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {[
                        t('step1'),
                        t('step2'),
                        t('step3'),
                        t('step4')
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-6 group/item opacity-0 animate-in slide-in-from-right-2 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-500/50 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-300">
                              {index + 1}
                            </div>
                            <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-sm" />
                          </div>
                          <div className="flex-1">
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 text-base leading-relaxed">{step}</span>
                            <div className="h-px bg-gradient-to-r from-blue-500/20 to-transparent mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer Ultra Interactive Box */}
              <div className="group relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-amber-500/5 rounded-3xl transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/80 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-500/50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{t('disclaimer')}</h3>
                      <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-500/50 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-8 group-hover:from-amber-500/15 group-hover:to-amber-500/10 transition-all duration-500">
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300 text-base">
                      {t('taxCalculatorDisclaimer')}
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-amber-500/20 group-hover:border-amber-500/30 transition-colors duration-500">
                    <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl group-hover:from-primary/10 group-hover:to-blue-500/10 transition-all duration-500">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/50 rounded-xl flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-foreground mb-2">Need professional help?</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">Consult with our tax experts for accurate calculations and comprehensive tax planning. Get personalized advice tailored to your specific situation.</p>
                        <div className="mt-4 flex gap-3">
                          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors duration-300">
                            Get Consultation
                          </button>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors duration-300">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default TaxCalculator;
