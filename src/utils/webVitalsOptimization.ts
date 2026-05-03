// Web Vitals optimization utilities
export interface WebVitalsOptimization {
  // FCP Optimizations
  optimizeFCP: () => void;
  
  // LCP Optimizations  
  optimizeLCP: () => void;
  
  // CLS Optimizations
  optimizeCLS: () => void;
  
  // General optimizations
  preloadCriticalResources: () => void;
  optimizeImages: () => void;
  optimizeFonts: () => void;
}

// FCP (First Contentful Paint) Optimizations
export const optimizeFCP = () => {
  // 1. Minimize render-blocking resources
  const optimizeRenderBlocking = () => {
    // Add preload for critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.href = '/assets/index.css';
    criticalCSS.as = 'style';
    criticalCSS.onload = function(this: HTMLLinkElement) {
      this.onload = null;
      this.rel = 'stylesheet';
    };
    document.head.appendChild(criticalCSS);

    // Add preload for critical JavaScript
    const criticalJS = document.createElement('link');
    criticalJS.rel = 'preload';
    criticalJS.href = '/assets/index.js';
    criticalJS.as = 'script';
    document.head.appendChild(criticalJS);
  };

  // 2. Optimize server response time
  const optimizeServerResponse = () => {
    // Add connection hints for faster DNS resolution
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://jadtraconsulting.com';
    document.head.appendChild(dnsPrefetch);

    // Add preconnect for critical domains
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://jadtraconsulting.com';
    document.head.appendChild(preconnect);
  };

  // 3. Minimize critical resource size
  const minimizeCriticalResources = () => {
    // Add resource hints for images
    const images = document.querySelectorAll('img[data-src]');
    if (images && typeof images.forEach === 'function') {
      images.forEach(img => {
        const imgPreload = document.createElement('link');
        imgPreload.rel = 'preload';
        imgPreload.href = (img as HTMLElement).dataset.src!;
        imgPreload.as = 'image';
        document.head.appendChild(imgPreload);
      });
    }
  };

  optimizeRenderBlocking();
  optimizeServerResponse();
  minimizeCriticalResources();
};

// LCP (Largest Contentful Paint) Optimizations
export const optimizeLCP = () => {
  // 1. Optimize images
  const optimizeImages = () => {
    const images = document.querySelectorAll('img');
    if (images && typeof images.forEach === 'function') {
      images.forEach(img => {
        // Add loading="lazy" to below-the-fold images
        if (!img.hasAttribute('loading') && !isInViewport(img)) {
          img.setAttribute('loading', 'lazy');
        }

        // Add proper dimensions to prevent layout shift
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          const rect = img.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            img.setAttribute('width', Math.round(rect.width).toString());
            img.setAttribute('height', Math.round(rect.height).toString());
          }
        }

        // Optimize image formats
        if (img.src && img.src.includes('.jpg') || img.src.includes('.jpeg')) {
          // Consider WebP format for better compression
          const webpSrc = img.src.replace(/\.(jpg|jpeg)$/i, '.webp');
          if (supportsWebP()) {
            img.src = webpSrc;
          }
        }
      });
    }
  };

  // 2. Optimize text rendering
  const optimizeTextRendering = () => {
    // Add font-display: swap for custom fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Playfair Display';
        font-display: swap;
        src: url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
      }
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      }
    `;
    document.head.appendChild(style);
  };

  // 3. Remove render-blocking JavaScript
  const optimizeJavaScript = () => {
    // Add defer to non-critical scripts
    const scripts = document.querySelectorAll('script:not([defer]):not([async])');
    if (scripts && typeof scripts.forEach === 'function') {
      scripts.forEach(script => {
        const s = script as HTMLScriptElement;
        if (!s.src.includes('critical') && !s.textContent?.includes('critical')) {
          s.defer = true;
        }
      });
    }
  };

  optimizeImages();
  optimizeTextRendering();
  optimizeJavaScript();
};

// CLS (Cumulative Layout Shift) Optimizations
export const optimizeCLS = () => {
  // 1. Set dimensions for images and videos
  const setDimensions = () => {
    const mediaElements = document.querySelectorAll('img, video, iframe');
    if (mediaElements && typeof mediaElements.forEach === 'function') {
      mediaElements.forEach(element => {
        if (!element.hasAttribute('width') || !element.hasAttribute('height')) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            element.setAttribute('width', Math.round(rect.width).toString());
            element.setAttribute('height', Math.round(rect.height).toString());
          }
        }
      });
    }
  };

  // 2. Reserve space for dynamic content
  const reserveSpaceForDynamic = () => {
    // Add skeleton loaders for dynamic content
    const dynamicContainers = document.querySelectorAll('[data-dynamic]');
    if (dynamicContainers && typeof dynamicContainers.forEach === 'function') {
      dynamicContainers.forEach(container => {
        if (!container.hasAttribute('data-skeleton')) {
          const skeleton = document.createElement('div');
          skeleton.className = 'animate-pulse bg-muted rounded';
          (skeleton as HTMLElement).style.height = container.getAttribute('data-height') || '200px';
          skeleton.setAttribute('data-skeleton', 'true');
          container.appendChild(skeleton);
        }
      });
    }
  };

  // 3. Avoid inserting content above existing content
  const avoidContentInsertion = () => {
    // Use transform instead of changing top/left properties
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements && typeof animatedElements.forEach === 'function') {
      animatedElements.forEach(element => {
        (element as HTMLElement).style.transform = 'translateY(0)';
        (element as HTMLElement).style.transition = 'transform 0.3s ease';
      });
    }
  };

  setDimensions();
  reserveSpaceForDynamic();
  avoidContentInsertion();
};

// Utility functions
const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreload1 = document.createElement('link');
  fontPreload1.rel = 'preload';
  fontPreload1.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
  fontPreload1.as = 'style';
  fontPreload1.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload1);

  const fontPreload2 = document.createElement('link');
  fontPreload2.rel = 'preload';
  fontPreload2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';
  fontPreload2.as = 'style';
  fontPreload2.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload2);

  // Preload critical images
  const criticalImages = [
    '/jadtra-logo.jpg',
    '/hero-image.jpg'
  ];

  if (criticalImages && typeof criticalImages.forEach === 'function') {
    criticalImages.forEach(src => {
      const imgPreload = document.createElement('link');
      imgPreload.rel = 'preload';
      imgPreload.href = src;
      imgPreload.as = 'image';
      document.head.appendChild(imgPreload);
    });
  }
};

// Main optimization function
export const optimizeWebVitals = () => {
  // Run optimizations in order of impact
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeFCP();
      optimizeLCP();
      optimizeCLS();
      preloadCriticalResources();
    });
  } else {
    // DOM already loaded
    optimizeFCP();
    optimizeLCP();
    optimizeCLS();
    preloadCriticalResources();
  }

  // Monitor performance
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      if (list && list.getEntries && typeof list.getEntries().forEach === 'function') {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          } else if (entry.entryType === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              console.log('CLS:', (entry as any).value);
            }
          }
        });
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint', 'layout-shift'] });
  }
};

export default {
  optimizeFCP,
  optimizeLCP,
  optimizeCLS,
  preloadCriticalResources,
  optimizeWebVitals
};
