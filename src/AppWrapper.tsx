import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import StickyConsultationButton from '@/components/StickyConsultationButton';
import useAnalytics from '@/hooks/useAnalytics';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const location = useLocation();
  const { trackPageView, trackUserProperties } = useAnalytics();
  const { getCurrentMetrics } = usePerformanceMonitoring();

  // Register service worker (DISABLED FOR NOW - causing routing issues)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Skip SW registration on admin subdomain to prevent caching issues
      if (location.hostname !== 'localhost' && !location.hostname.includes('admin1')) {
        // disable for now - routing issues with admin subdomain
        console.log('[SW] Registration disabled temporarily');
        // navigator.serviceWorker
        //   .register('/sw.js')
        //   .then((registration) => {
        //     console.log('Service Worker registered successfully:', registration);
        //   })
        //   .catch((error) => {
        //     console.log('Service Worker registration failed:', error);
        //   });
      }
    }
  }, []);

  // Track page views
  useEffect(() => {
    const title = document.title;
    trackPageView({
      page: location.pathname,
      title: title,
      location: window.location.href,
    });
  }, [location, trackPageView]);

  // Track user properties
  useEffect(() => {
    const userId = localStorage.getItem('ab_testing_user_id');
    const language = localStorage.getItem('language') || 'en';
    const theme = localStorage.getItem('theme') || 'light';
    
    trackUserProperties({
      userId,
      language,
      theme,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    });
  }, [trackUserProperties]);

  // Performance monitoring
  useEffect(() => {
    // Monitor performance periodically
    const interval = setInterval(() => {
      const metrics = getCurrentMetrics();
      console.log('Performance metrics:', metrics);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [getCurrentMetrics]);

  return (
    <>
      {children}
      <PWAInstallPrompt />
      <StickyConsultationButton />
    </>
  );
};

export default AppWrapper;
