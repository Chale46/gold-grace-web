# Gold Grace Web - JADTRA Consulting

Modern business consulting website with tax calculator and blog functionality.

## **Project Overview**

JADTRA Consulting is a professional business consulting and tax advisory firm under KKP Hakim Muhamad dan Rekan. This website provides comprehensive information about our services, interactive tax calculator, and educational blog content.

## **Features**

### **Core Features**
- **Sticky Consultation Button**: Expandable contact options (Phone & WhatsApp)
- **Modern Blog**: 2026 articles with hero section and category badges
- **Interactive Tax Calculator**: PPh 21 calculator with ultra modern UI
- **Responsive Design**: Mobile-first approach with dark mode support
- **PWA Support**: Progressive Web App capabilities

### **Technical Features**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for state management
- **Vite** for build tooling
- **Vercel** for deployment

## **Project Structure**

```
src/
  components/          # Reusable UI components
    StickyConsultationButton.tsx
    Footer.tsx
    Header.tsx
    SEO.tsx
  contexts/           # React contexts
    LanguageContext.tsx
    ThemeContext.tsx
  pages/              # Page components
    Index.tsx
    Blog.tsx
    TaxCalculator.tsx
    Contact.tsx
    About.tsx
    Services.tsx
  utils/              # Utility functions
    advancedCaching.ts
    taxServiceSchema.ts
    articleGenerator.ts
    webVitalsOptimization.ts
api/                  # Vercel serverless functions
  analytics/
    web-vitals.ts
public/               # Static assets
```

## **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/8serayu8-commits/gold-grace-web.git
cd gold-grace-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Variables**
Create `.env.local` file:
```env
VITE_API_URL=http://localhost:3001/api
```

## **Build & Deploy**

### **Development**
```bash
npm run dev          # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### **Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Build and deploy
npm run build
vercel --prod
```

## **Key Components**

### **StickyConsultationButton**
- Appears after scrolling 200px
- Expandable options for phone and WhatsApp
- Non-intrusive design with backdrop
- Smooth animations and transitions

### **TaxCalculator Page**
- Ultra modern interactive boxes
- Gradient backgrounds with glass morphism
- 3D animations and micro-interactions
- Responsive design with dark mode

### **Blog Page**
- 2026-focused articles
- Hero section with category badges
- Search and filtering functionality
- SEO optimized with structured data

## **Performance Optimizations**

### **Web Vitals**
- Core Web Vitals monitoring
- Performance analytics
- Resource optimization
- Lazy loading strategies

### **Caching**
- Advanced multi-layer caching
- Service worker implementation
- Browser caching strategies
- CDN optimization

## **SEO & Analytics**

### **SEO Features**
- Structured data (JSON-LD)
- Meta tags optimization
- Open Graph support
- Sitemap generation

### **Analytics**
- Google Analytics integration
- Performance monitoring
- User behavior tracking
- Conversion optimization

## **Internationalization**

### **Supported Languages**
- English (en)
- Indonesian (id)

### **Translation System**
- React Context-based
- Dynamic language switching
- SEO-friendly URLs
- Localized content

## **Theme System**

### **Dark Mode**
- System preference detection
- Manual toggle option
- Persistent settings
- Smooth transitions

### **Color Scheme**
- Primary: Gold (#d4af37)
- Secondary: Blue tones
- Neutral: Gray scale
- Semantic: Success/Warning/Error

## **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## **License**

This project is proprietary and belongs to JADTRA Consulting.

## **Contact**

- **Website**: https://jadtraconsulting.com
- **Email**: info@jadtraconsulting.com
- **Phone**: +62 21 0000 0000
- **WhatsApp**: https://wa.me/6281234567890

## **Technology Stack**

| **Category** | **Technology** | **Version** |
|--------------|----------------|-------------|
| **Framework** | React | 18.2+ |
| **Language** | TypeScript | 5.0+ |
| **Styling** | Tailwind CSS | 3.3+ |
| **Animations** | Framer Motion | 10.0+ |
| **Routing** | React Router | 6.8+ |
| **State** | React Query | 4.0+ |
| **Build** | Vite | 4.4+ |
| **Deploy** | Vercel | Latest |

---

**© 2026 JADTRA Consulting. All rights reserved.**
