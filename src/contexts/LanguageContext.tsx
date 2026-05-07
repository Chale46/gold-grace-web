import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "id";

interface LanguageContextType {
  lang: Lang;
  language: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.about": { en: "About", id: "Tentang" },
  "nav.services": { en: "Services", id: "Layanan" },
  "nav.contact": { en: "Contact", id: "Kontak" },

  // Index - Hero
  "home.hero.title": { en: "Trusted Consulting Partner for Business Growth", id: "Mitra Konsultan Terpercaya untuk Pertumbuhan Bisnis" },
  "home.hero.desc": { en: "Professional consulting services in business, taxation, and digital systems — delivering certainty, growth, and sustainability.", id: "Layanan konsultasi profesional di bidang bisnis, perpajakan, dan sistem digital — memberikan kepastian, pertumbuhan, dan keberlanjutan." },
  "home.hero.cta": { en: "Consult Now", id: "Konsultasi Sekarang" },

  // Index - Intro
  "home.intro": { en: "JADTRA Consulting is a professional consulting firm under KKP Hakim Muhamad dan Rekan, providing strategic and reliable business solutions since 2010. We combine deep expertise with a commitment to educate and empower our clients.", id: "JADTRA Consulting adalah firma konsultan profesional di bawah KKP Hakim Muhamad dan Rekan, menyediakan solusi bisnis strategis dan andal sejak 2010. Kami menggabungkan keahlian mendalam dengan komitmen untuk mengedukasi dan memberdayakan klien." },

  // Index - Services
  "home.services.title": { en: "Our Services", id: "Layanan Kami" },
  "home.services.business.title": { en: "Business Consulting", id: "Konsultasi Bisnis" },
  "home.services.business.desc": { en: "Strategic guidance for sustainable business growth and operational excellence.", id: "Panduan strategis untuk pertumbuhan bisnis berkelanjutan dan keunggulan operasional." },
  "home.services.tax.title": { en: "Tax & Accounting Advisory", id: "Konsultasi Pajak & Akuntansi" },
  "home.services.tax.desc": { en: "Expert tax planning, compliance, and financial advisory services.", id: "Layanan perencanaan pajak, kepatuhan, dan penasihat keuangan profesional." },
  "home.services.digital.title": { en: "Digital Transformation", id: "Transformasi Digital" },
  "home.services.digital.desc": { en: "Modernize your business with cutting-edge digital solutions and processes.", id: "Modernisasi bisnis Anda dengan solusi dan proses digital terkini." },
  "home.services.system.title": { en: "System Development Planning", id: "Perencanaan Pengembangan Sistem" },
  "home.services.system.desc": { en: "Comprehensive planning for scalable and efficient system architectures.", id: "Perencanaan komprehensif untuk arsitektur sistem yang skalabel dan efisien." },

  // Index - How We Work
  "home.howWeWork.title": { en: "How We Work", id: "Cara Kami Bekerja" },
  "home.howWeWork.step1.title": { en: "Initial Consultation", id: "Konsultasi Awal" },
  "home.howWeWork.step1.desc": { en: "We understand your business needs and identify key challenges.", id: "Kami memahami kebutuhan bisnis Anda dan mengidentifikasi tantangan utama." },
  "home.howWeWork.step2.title": { en: "Analysis & Strategy", id: "Analisis & Strategi" },
  "home.howWeWork.step2.desc": { en: "We analyze your situation and design the most effective solution.", id: "Kami menganalisis situasi Anda dan merancang solusi paling efektif." },
  "home.howWeWork.step3.title": { en: "Implementation", id: "Implementasi" },
  "home.howWeWork.step3.desc": { en: "We execute the strategy with structured and professional approach.", id: "Kami menjalankan strategi dengan pendekatan terstruktur dan profesional." },
  "home.howWeWork.step4.title": { en: "Monitoring & Improvement", id: "Monitoring & Peningkatan" },
  "home.howWeWork.step4.desc": { en: "We continuously evaluate and refine for optimal results.", id: "Kami terus mengevaluasi dan menyempurnakan untuk hasil optimal." },

  // Index - Why Clients Trust Us
  "home.trust.title": { en: "Why Clients Trust Us", id: "Mengapa Klien Mempercayai Kami" },
  "home.trust.professional.title": { en: "Professional Approach", id: "Pendekatan Profesional" },
  "home.trust.professional.desc": { en: "We maintain high standards in every engagement.", id: "Kami menjaga standar tinggi dalam setiap keterlibatan." },
  "home.trust.confidential.title": { en: "Confidential & Secure", id: "Rahasia & Aman" },
  "home.trust.confidential.desc": { en: "Your data and business information are handled with strict confidentiality.", id: "Data dan informasi bisnis Anda ditangani dengan kerahasiaan ketat." },
  "home.trust.structured.title": { en: "Structured Process", id: "Proses Terstruktur" },
  "home.trust.structured.desc": { en: "We follow clear and measurable workflows.", id: "Kami mengikuti alur kerja yang jelas dan terukur." },
  "home.trust.partnership.title": { en: "Long-Term Partnership", id: "Kemitraan Jangka Panjang" },
  "home.trust.partnership.desc": { en: "We focus on sustainable business growth.", id: "Kami fokus pada pertumbuhan bisnis berkelanjutan." },

  // Index - Our Approach
  "home.approach.title": { en: "Our Approach", id: "Pendekatan Kami" },
  "home.approach.desc": { en: "We believe that every business requires a tailored strategy. Our approach combines analytical thinking, industry knowledge, and practical execution to deliver solutions that are not only effective but sustainable.", id: "Kami percaya bahwa setiap bisnis membutuhkan strategi yang disesuaikan. Pendekatan kami menggabungkan pemikiran analitis, pengetahuan industri, dan eksekusi praktis untuk memberikan solusi yang tidak hanya efektif tetapi juga berkelanjutan." },
  "home.approach.data": { en: "Data-driven decisions", id: "Keputusan berbasis data" },
  "home.approach.practical": { en: "Practical implementation", id: "Implementasi praktis" },
  "home.approach.scalable": { en: "Scalable solutions", id: "Solusi yang skalabel" },
  "home.approach.graphic.title": { en: "Tailored Strategy", id: "Strategi Disesuaikan" },
  "home.approach.graphic.sub": { en: "For every client", id: "Untuk setiap klien" },

  // Index - Why Choose Us
  "home.whyUs.title": { en: "Why Choose Us", id: "Mengapa Memilih Kami" },
  "home.whyUs.professional.title": { en: "Professional & Experienced", id: "Profesional & Berpengalaman" },
  "home.whyUs.professional.desc": { en: "More than a decade of expertise in taxation, accounting, and business advisory.", id: "Lebih dari satu dekade keahlian di bidang perpajakan, akuntansi, dan konsultasi bisnis." },
  "home.whyUs.trusted.title": { en: "Trusted & Reliable", id: "Terpercaya & Andal" },
  "home.whyUs.trusted.desc": { en: "Built on transparency, data confidentiality, and consistent results — the ProTEkSi culture.", id: "Dibangun di atas transparansi, kerahasiaan data, dan hasil konsisten — budaya ProTEkSi." },
  "home.whyUs.growth.title": { en: "Growth-Oriented Approach", id: "Pendekatan Berorientasi Pertumbuhan" },
  "home.whyUs.growth.desc": { en: "We are your strategic partner, not just a service provider — guiding sustainable business growth.", id: "Kami adalah mitra strategis Anda, bukan sekadar penyedia layanan — membimbing pertumbuhan bisnis berkelanjutan." },

  // Index - CTA
  "home.cta.title": { en: "Start Building a Strong Foundation for Your Business", id: "Mulai Bangun Fondasi Kuat untuk Bisnis Anda" },
  "home.cta.desc": { en: "Partner with a consulting team that understands your growth.", id: "Bermitra dengan tim konsultan yang memahami pertumbuhan Anda." },
  "home.cta.button": { en: "Schedule Consultation", id: "Jadwalkan Konsultasi" },

  // About
  "about.title": { en: "About Us", id: "Tentang Kami" },
  "about.overview.title": { en: "Company Overview", id: "Profil Perusahaan" },
  "about.overview.p1": { en: "Jadtra Consulting was born from a long journey and dedication in the world of taxation, accounting, training, and business legality since 2010 with the establishment of Elhakim and Partner. Elhakim and Partner transformed into Jadtra Consulting (KKP Hakim Muhamad dan Rekan).", id: "Jadtra Consulting lahir dari perjalanan panjang dan dedikasi di dunia perpajakan, akuntansi, pelatihan, dan legalitas usaha sejak tahun 2010 dengan berdirinya Elhakim and Partner. Elhakim and Partner bertransformasi menjadi Jadtra Consulting (KKP Hakim Muhamad dan Rekan)." },
  "about.overview.p2": { en: "More than a decade of experience has shaped strong technical expertise and fostered sensitivity to the needs of business practitioners, especially SMEs and beginner entrepreneurs who often face challenges in understanding and fulfilling administrative obligations.", id: "Pengalaman lebih dari satu dekade membentuk keahlian teknis yang kuat dan melahirkan kepekaan terhadap kebutuhan para pelaku usaha, khususnya UMKM dan pengusaha pemula yang sering kali menghadapi tantangan dalam memahami dan memenuhi kewajiban administratif." },
  "about.overview.p3": { en: 'The name "Jadtra Consulting" carries a philosophical meaning: symbolizing justice, wisdom, and the spirit of protecting clients in vital aspects of business management. Today, Jadtra Consulting stands as a professional entity oriented not only toward solving client problems but also growing as a platform for nurturing young, potential human resources.', id: 'Nama "Jadtra Consulting" sendiri membawa makna filosofis: melambangkan keadilan, kebijaksanaan, dan semangat melindungi klien dalam aspek-aspek vital pengelolaan usaha. Kini, Jadtra Consulting berdiri sebagai entitas profesional yang tidak hanya berorientasi pada penyelesaian masalah klien, tetapi juga tumbuh sebagai wadah pembinaan SDM muda yang potensial.' },

  // About - Vision & Mission
  "about.vision.title": { en: "Vision", id: "Visi" },
  "about.vision.text": { en: '"To become a Strategic Partner that provides certainty, growth, and business sustainability through Professional, Trusted, Educative, and Solution-Oriented services."', id: '"Menjadi Mitra Strategis yang memberikan kepastian, pertumbuhan, dan keberlanjutan usaha melalui layanan yang Profesional, Terpercaya, Edukatif, dan Solutif."' },
  "about.mission.title": { en: "Mission", id: "Misi" },
  "about.mission.1": { en: "Supporting the growth and sustainability of business entities through strategic insights and accurate data.", id: "Mendukung pertumbuhan dan keberlanjutan entitas bisnis melalui wawasan strategis dan data yang akurat." },
  "about.mission.2": { en: "Providing certainty and security in fulfilling tax, accounting, and legal obligations.", id: "Memberikan kepastian dan rasa aman dalam penyelesaian kewajiban pajak, akuntansi, dan hukum." },
  "about.mission.3": { en: "Nurturing human resources to become experts with ethics in tax, accounting, and law.", id: "Membina SDM menjadi ahli dan beretika di bidang pajak, akuntansi, dan hukum." },

  // About - Core Values
  "about.values.title": { en: "Budaya ProTEkSi", id: "Budaya ProTEkSi" },
  "about.values.subtitle": { en: "Our Core Values", id: "Nilai-Nilai Inti Kami" },
  "about.values.professional.title": { en: "Profesional (Professional)", id: "Profesional" },
  "about.values.professional.desc": { en: "Working with high standards, thoroughness, and professional ethics. Every staff member masters the fundamentals of taxation, accounting, and law, and continuously updates their knowledge.", id: "Bekerja dengan standar tinggi, teliti, dan sesuai etika profesi. Setiap staf menguasai dasar ilmu perpajakan, akuntansi, maupun hukum, serta terus memperbarui pengetahuan." },
  "about.values.trusted.title": { en: "Terpercaya (Trusted)", id: "Terpercaya" },
  "about.values.trusted.desc": { en: "Trust is the foundation of our relationship with clients and team members. Maintaining data confidentiality, consistently delivering accurate information, and meeting promises and deadlines.", id: "Kepercayaan adalah pondasi hubungan dengan klien dan sesama tim. Menjaga kerahasiaan data, konsisten menyampaikan informasi yang benar, serta menepati janji dan target waktu." },
  "about.values.educative.title": { en: "Edukatif (Educative)", id: "Edukatif" },
  "about.values.educative.desc": { en: "Every report, calculation, or legal opinion is accompanied by simple explanations for easy client understanding. Internally, we share knowledge, mentoring, and cultivate a continuous learning culture.", id: "Setiap laporan, perhitungan, atau opini hukum disertai penjelasan sederhana agar mudah dipahami klien. Di internal, saling berbagi ilmu, mentoring, dan budaya belajar berkelanjutan." },
  "about.values.solutif.title": { en: "Solutif (Solution-Oriented)", id: "Solutif" },
  "about.values.solutif.desc": { en: "Focused on problem-solving, not just formality. In both ideal and emergency situations, we are oriented toward appropriate, legal, and long-term beneficial solutions.", id: "Fokus pada pemecahan masalah, bukan hanya formalitas. Dalam situasi ideal maupun darurat, berorientasi pada solusi yang tepat, legal, dan bermanfaat jangka panjang." },

  // Services
  "services.title": { en: "Our Services", id: "Layanan Kami" },
  "services.business.title": { en: "Business Consulting", id: "Konsultasi Bisnis" },
  "services.business.desc": { en: "We provide end-to-end business advisory services—from market entry strategy and operational optimization to risk management and organizational restructuring. Our consultants work closely with your leadership team to identify opportunities and drive sustainable competitive advantage.", id: "Kami menyediakan layanan konsultasi bisnis menyeluruh—dari strategi masuk pasar dan optimasi operasional hingga manajemen risiko dan restrukturisasi organisasi. Konsultan kami bekerja erat dengan tim kepemimpinan Anda untuk mengidentifikasi peluang dan mendorong keunggulan kompetitif berkelanjutan." },
  "services.tax.title": { en: "Tax & Accounting Advisory", id: "Konsultasi Pajak & Akuntansi" },
  "services.tax.desc": { en: "Navigate Indonesia's complex tax landscape with confidence. Our services include corporate tax planning, individual tax compliance, transfer pricing documentation, tax dispute resolution, and comprehensive accounting and bookkeeping support.", id: "Navigasi lanskap pajak Indonesia yang kompleks dengan percaya diri. Layanan kami mencakup perencanaan pajak perusahaan, kepatuhan pajak individu, dokumentasi transfer pricing, penyelesaian sengketa pajak, serta dukungan akuntansi dan pembukuan komprehensif." },
  "services.digital.title": { en: "Digital Transformation", id: "Transformasi Digital" },
  "services.digital.desc": { en: "Accelerate your business through technology. We help organizations adopt modern digital tools, automate workflows, implement cloud-based systems, and develop data-driven strategies that enhance efficiency and customer experience.", id: "Percepat bisnis Anda melalui teknologi. Kami membantu organisasi mengadopsi alat digital modern, mengotomatisasi alur kerja, mengimplementasikan sistem berbasis cloud, dan mengembangkan strategi berbasis data yang meningkatkan efisiensi dan pengalaman pelanggan." },
  "services.system.title": { en: "System Development Planning", id: "Perencanaan Pengembangan Sistem" },
  "services.system.desc": { en: "From requirements analysis to architecture design, we guide your team through the entire system development lifecycle. Our planning services ensure your technology investments are scalable, secure, and aligned with your long-term business objectives.", id: "Dari analisis kebutuhan hingga desain arsitektur, kami memandu tim Anda melalui seluruh siklus pengembangan sistem. Layanan perencanaan kami memastikan investasi teknologi Anda skalabel, aman, dan selaras dengan tujuan bisnis jangka panjang." },

  // Contact
  "contact.title": { en: "Contact Us", id: "Hubungi Kami" },
  "contact.form.title": { en: "Send Us a Message", id: "Kirim Pesan" },
  "contact.form.name": { en: "Name", id: "Nama" },
  "contact.form.email": { en: "Email", id: "Email" },
  "contact.form.message": { en: "Message", id: "Pesan" },
  "contact.form.phone": { en: "Phone", id: "Telepon" },
  "contact.form.company": { en: "Company", id: "Perusahaan" },
  "contact.form.attachments": { en: "Attachments", id: "Lampiran" },
  "contact.form.submit": { en: "Send Message", id: "Kirim Pesan" },
  "contact.form.success": { en: "Thank you for your message. We will get back to you soon.", id: "Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda." },
  "contact.office.title": { en: "Office Information", id: "Informasi Kantor" },
  "contact.office.email": { en: "Email", id: "Email" },
  "contact.office.phone": { en: "Phone", id: "Telepon" },
  "contact.office.address": { en: "Address", id: "Alamat" },
  "contact.office.map": { en: "Map Placeholder", id: "Placeholder Peta" },

  // Footer
  "footer.navigation": { en: "Navigation", id: "Navigasi" },
  "footer.contact": { en: "Contact", id: "Kontak" },
  "footer.rights": { en: "All rights reserved.", id: "Hak cipta dilindungi." },

  // Internal System
  "internal.title": { en: "JADTRA Internal System", id: "Sistem Internal JADTRA" },
  "internal.staffOnly": { en: "Staff access only", id: "Akses khusus staf" },
  "internal.login": { en: "Login", id: "Masuk" },
  "internal.logout": { en: "Logout", id: "Keluar" },
  "internal.dashboard": { en: "Dashboard", id: "Dasbor" },
  "internal.clients": { en: "Clients", id: "Klien" },
  "internal.projects": { en: "Projects", id: "Proyek" },
  "internal.documents": { en: "Documents", id: "Dokumen" },
  "internal.totalClients": { en: "Total Clients", id: "Total Klien" },
  "internal.activeProjects": { en: "Active Projects", id: "Proyek Aktif" },
  "internal.recentClients": { en: "Recent Clients", id: "Klien Terbaru" },
  "internal.clientName": { en: "Client Name", id: "Nama Klien" },
  "internal.project": { en: "Project", id: "Proyek" },
  "internal.status": { en: "Status", id: "Status" },
  "internal.phaseNote": { en: "Internal system will be developed in the next phase.", id: "Sistem internal akan dikembangkan pada fase berikutnya." },
  "internal.password": { en: "Password", id: "Kata Sandi" },

  // Tax Calculator
  "taxCalculator": { en: "Tax Calculator", id: "Kalkulator Pajak" },
  "taxCalculatorTitle": { en: "PPh 21 Tax Calculator", id: "Kalkulator PPh 21" },
  "taxCalculatorDescription": { en: "Calculate PPh 21 for permanent employees with our free online calculator from JADTRA Consulting. Easy to use, accurate, and compliant with latest tax regulations.", id: "Hitung PPh 21 pegawai tetap dengan kalkulator online gratis dari JADTRA Consulting. Mudah digunakan, akurat, dan sesuai regulasi pajak terbaru." },
  "taxCalculatorIntro": { en: "Free online calculator to calculate PPh 21 for permanent employees according to the latest Indonesian tax regulations. Easy to use, accurate, and transparent.", id: "Kalkulator online gratis untuk menghitung PPh 21 pegawai tetap sesuai regulasi perpajakan Indonesia terbaru. Mudah digunakan, akurat, dan transparan." },
  "aboutTaxCalculator": { en: "About PPh 21 Calculator", id: "Tentang Kalkulator PPh 21" },
  "taxCalculatorAboutText": { en: "The PPh 21 calculator from JADTRA Consulting is designed to help you calculate estimated PPh 21 that must be paid by permanent employees. The calculation is based on applicable Indonesian tax regulations.", id: "Kalkulator PPh 21 dari JADTRA Consulting dirancang untuk membantu Anda menghitung estimasi PPh 21 yang harus dibayar oleh pegawai tetap. Perhitungan didasarkan pada peraturan perpajakan Indonesia yang berlaku." },
  "calculatorFeatures": { en: "Calculator Features", id: "Fitur Kalkulator" },
  "feature1": { en: "PPh 21 calculation for permanent employees", id: "Perhitungan PPh 21 untuk pegawai tetap" },
  "feature2": { en: "Supports various PTKP statuses (TK, K, KI with 0-3 dependents)", id: "Mendukung berbagai status PTKP (TK, K, KI dengan tanggungan 0-3)" },
  "feature3": { en: "Annual and monthly calculation results", id: "Hasil perhitungan tahunan dan bulanan" },
  "feature4": { en: "Effective tax rate", id: "Tarif efektif pajak" },
  "feature5": { en: "Taxable income and net income", id: "Penghasilan kena pajak dan penghasilan bersih" },
  "howToUse": { en: "How to Use", id: "Cara Menggunakan" },
  "step1": { en: "Enter gross monthly income", id: "Masukkan penghasilan bruto per bulan" },
  "step2": { en: "Select appropriate PTKP status", id: "Pilih status PTKP yang sesuai" },
  "step3": { en: "Click 'Calculate Tax' button", id: "Klik tombol 'Hitung Pajak'" },
  "step4": { en: "View complete calculation results", id: "Lihat hasil perhitungan lengkap" },
  "disclaimer": { en: "Disclaimer", id: "Disclaimer" },
  "taxCalculatorDisclaimer": { en: "This calculator is for estimation and information purposes only. Calculation results may differ from actual conditions depending on specific income components, allowances, and company policies. For accurate and comprehensive calculations, consult with tax professionals from JADTRA Consulting.", id: "Kalkulator ini disediakan untuk estimasi dan informasi saja. Hasil perhitungan dapat berbeda dengan kondisi aktual bergantung pada komponen penghasilan, tunjangan, dan kebijakan perusahaan. Untuk perhitungan yang akurat dan komprehensif, konsultasikan dengan profesional pajak dari JADTRA Consulting." },
  "taxCalculatorAlert": { en: "This calculator is for PPh 21 estimation for permanent employees. Calculation results may differ depending on specific conditions and company policies.", id: "Kalkulator ini untuk estimasi PPh 21 pegawai tetap. Hasil perhitungan dapat berbeda tergantung kondisi spesifik dan kebijakan perusahaan." },
  "consultation": { en: "Consultation", id: "Konsultasi" },
  "consultation.title": { en: "Hubungi Kami", id: "Hubungi Kami" },
  "consultationPhone": { en: "Call Us", id: "Hubungi Kami" },
  "consultationPhoneDesc": { en: "Direct consultation", id: "Konsultasi langsung" },
  "consultationWhatsapp": { en: "WhatsApp", id: "WhatsApp" },
  "consultationWhatsappDesc": { en: "Chat with our experts", id: "Chat dengan ahli kami" },
  "consultationStart": { en: "Start", id: "Mulai" },
  "grossIncomeLabel": { en: "Gross Income per Month (Rp)", id: "Penghasilan Bruto per Bulan (Rp)" },
  "incomePlaceholder": { en: "Example: 10000000", id: "Contoh: 10000000" },
  "ptkpStatusLabel": { en: "PTKP Status", id: "Status PTKP" },
  "ptkpPlaceholder": { en: "Select PTKP status", id: "Pilih status PTKP" },
  "ptkpExplanation": { en: "PTKP Status Explanation", id: "Keterangan Status PTKP" },
  "tkExplanation": { en: "Unmarried", id: "Tk-Kawin" },
  "kExplanation": { en: "Married", id: "Kawin" },
  "kiExplanation": { en: "Married (Wife)", id: "Kawin-Istri" },
  "dependentsExplanation": { en: "Number of dependents", id: "Jumlah tanggungan" },
  "calculateTaxButton": { en: "Calculate Tax", id: "Hitung Pajak" },
  "resetButton": { en: "Reset", id: "Reset" },
  "invalidIncome": { en: "Please enter a valid income", id: "Masukkan penghasilan yang valid" },
  "calculationResults": { en: "Calculation Results", id: "Hasil Perhitungan" },
  "grossIncomeMonthly": { en: "Gross Income (Monthly)", id: "Penghasilan Bruto (Bulanan)" },
  "taxableIncomeAnnual": { en: "Taxable Income (Annual)", id: "Penghasilan Kena Pajak (Tahunan)" },
  "pph21Annual": { en: "PPh 21 (Annual)", id: "PPh 21 (Tahunan)" },
  "pph21Monthly": { en: "PPh 21 (Monthly)", id: "PPh 21 (Bulanan)" },
  "netIncomeMonthly": { en: "Net Income (Monthly)", id: "Penghasilan Bersih (Bulanan)" },
  "effectiveRate": { en: "Effective Rate", id: "Tarif Efektif" },
  "summary": { en: "Summary", id: "Ringkasan" },
  "summaryText1": { en: "From gross income {{grossIncome}} per month, you pay PPh 21 of {{monthlyTax}} per month or {{annualTax}} per year.", id: "Dari penghasilan bruto {{grossIncome}} per bulan, Anda membayar PPh 21 sebesar {{monthlyTax}} per bulan atau {{annualTax}} per tahun." },
  "summaryText2": { en: "Your net income is {{netIncome}} per month with an effective rate of {{effectiveRate}}%.", id: "Penghasilan bersih yang Anda terima adalah {{netIncome}} per bulan dengan tarif efektif {{effectiveRate}}%." },
  "taxStructure": { en: "PPh 21 Tax Structure", id: "Struktur Tarif PPh 21" },
  "taxBracket1": { en: "0 - Rp60 million: 5%", id: "0 - Rp60 juta: 5%" },
  "taxBracket2": { en: "Rp60 million - Rp250 million: 15%", id: "Rp60 juta - Rp250 juta: 15%" },
  "taxBracket3": { en: "Rp250 million - Rp500 million: 25%", id: "Rp250 juta - Rp500 juta: 25%" },
  "taxBracket4": { en: "Rp500 million - Rp5 billion: 30%", id: "Rp500 juta - Rp5 miliar: 30%" },
  "taxBracket5": { en: "Above Rp5 billion: 35%", id: "Diatas Rp5 miliar: 35%" },

  // NotFound
  "notfound.title": { en: "Oops! Page not found", id: "Halaman tidak ditemukan" },
  "notfound.back": { en: "Return to Home", id: "Kembali ke Beranda" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("jadtra-lang");
    return (saved === "id" || saved === "en") ? saved : "en";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("jadtra-lang", l);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[key]?.[lang] ?? key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, language: lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
