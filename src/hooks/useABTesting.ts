import { useState, useEffect, useCallback, useMemo } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // 0-1, percentage of traffic to include
  startDate?: string;
  endDate?: string;
  targetAudience?: {
    device?: string[];
    location?: string[];
    newUsersOnly?: boolean;
  };
}

interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: number;
  conversion?: boolean;
  revenue?: number;
  engagementTime?: number;
}

const useABTesting = () => {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [userVariants, setUserVariants] = useState<Record<string, string>>({});

  // Define A/B tests
  const abTests = useMemo<ABTest[]>(() => [
    {
      id: 'homepage_hero_cta',
      name: 'Homepage Hero CTA Button',
      trafficAllocation: 1.0,
      variants: [
        {
          id: 'control',
          name: 'Current CTA',
          weight: 0.5,
          config: {
            text: 'Get Started',
            color: 'primary',
            size: 'default',
          },
        },
        {
          id: 'variant_a',
          name: 'Urgent CTA',
          weight: 0.25,
          config: {
            text: 'Start Free Consultation',
            color: 'secondary',
            size: 'large',
          },
        },
        {
          id: 'variant_b',
          name: 'Benefit-focused CTA',
          weight: 0.25,
          config: {
            text: 'Save 30% on Taxes',
            color: 'accent',
            size: 'default',
          },
        },
      ],
    },
    {
      id: 'contact_form_layout',
      name: 'Contact Form Layout',
      trafficAllocation: 0.5, // Only 50% of traffic
      variants: [
        {
          id: 'control',
          name: 'Current Layout',
          weight: 0.5,
          config: {
            layout: 'single_column',
            fields: ['name', 'email', 'phone', 'message'],
            validation: 'standard',
          },
        },
        {
          id: 'variant_a',
          name: 'Multi-step Form',
          weight: 0.5,
          config: {
            layout: 'multi_step',
            fields: ['name', 'email', 'phone', 'company', 'service', 'message'],
            validation: 'enhanced',
          },
        },
      ],
    },
    {
      id: 'pricing_display',
      name: 'Service Pricing Display',
      trafficAllocation: 0.3, // Only 30% of traffic
      variants: [
        {
          id: 'control',
          name: 'No Pricing',
          weight: 0.5,
          config: {
            showPricing: false,
            cta: 'Contact for Quote',
          },
        },
        {
          id: 'variant_a',
          name: 'Range Pricing',
          weight: 0.5,
          config: {
            showPricing: true,
            pricingType: 'range',
            cta: 'Get Custom Quote',
          },
        },
      ],
    },
  ], []);

  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('ab_testing_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab_testing_user_id', userId);
    }
    return userId;
  }, []);

  const shouldIncludeInTest = (test: ABTest): boolean => {
    // Check traffic allocation
    const random = Math.random();
    if (random > test.trafficAllocation) {
      return false;
    }

    // Check date range
    if (test.startDate && new Date(test.startDate) > new Date()) {
      return false;
    }
    if (test.endDate && new Date(test.endDate) < new Date()) {
      return false;
    }

    // Check target audience
    if (test.targetAudience) {
      const { device, location, newUsersOnly } = test.targetAudience;
      
      const deviceStr = device ?? '';
      if (device && !deviceStr.includes(getDeviceType())) {
        return false;
      }
      
      if (newUsersOnly && !isNewUser()) {
        return false;
      }
    }

    return true;
  };

  const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  const isNewUser = (): boolean => {
    const firstVisit = localStorage.getItem('first_visit');
    if (!firstVisit) {
      localStorage.setItem('first_visit', Date.now().toString());
      return true;
    }
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return parseInt(firstVisit) > thirtyDaysAgo;
  };

  const assignVariant = (test: ABTest, userId: string): string => {
    // Use consistent hash to assign the same variant to the same user
    const hash = hashCode(`${test.id}_${userId}`);
    const random = (hash % 100) / 100;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variant.id;
      }
    }
    
    return test.variants[0].id; // Fallback to first variant
  };

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const trackTestParticipation = useCallback((testId: string, variantId: string) => {
    const result: ABTestResult = {
      testId,
      variantId,
      userId: getUserId(),
      timestamp: Date.now(),
    };

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'ab_test_participation', {
        event_category: 'AB Testing',
        event_label: `${testId}_${variantId}`,
        non_interaction: true,
      });
    }

    // Send to custom analytics API
    fetch('/api/analytics/ab-testing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    }).catch(error => {
      console.warn('Failed to track A/B test participation:', error);
    });
  }, [getUserId]);

  const initializeABTesting = useCallback(() => {
    // Load active tests from API or use local config
    setActiveTests(abTests);

    // Assign user to variants for each test
    const variants: Record<string, string> = {};
    const userId = getUserId();

    abTests.forEach(test => {
      if (shouldIncludeInTest(test)) {
        variants[test.id] = assignVariant(test, userId);
      }
    });

    setUserVariants(variants);

    // Track test participation
    Object.entries(variants).forEach(([testId, variantId]) => {
      trackTestParticipation(testId, variantId);
    });
  }, [abTests, getUserId, trackTestParticipation]);

  // Initialize A/B testing
  useEffect(() => {
    initializeABTesting();
  }, [initializeABTesting]);

  const trackConversion = useCallback((testId: string, conversionType: string, value?: number) => {
    const variantId = userVariants[testId];
    if (!variantId) return;

    const result: ABTestResult = {
      testId,
      variantId,
      userId: getUserId(),
      timestamp: Date.now(),
      conversion: true,
      revenue: value,
    };

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        event_category: 'AB Testing',
        event_label: `${testId}_${variantId}_${conversionType}`,
        value: value || 1,
      });
    }

    // Send to custom analytics API
    fetch('/api/analytics/ab-testing/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    }).catch(error => {
      console.warn('Failed to track A/B test conversion:', error);
    });
  }, [userVariants]);

  const getVariant = useCallback((testId: string): ABTestVariant | null => {
    const test = activeTests.find(t => t.id === testId);
    const variantId = userVariants[testId];
    
    if (!test || !variantId) return null;
    
    return test.variants.find(v => v.id === variantId) || null;
  }, [activeTests, userVariants]);

  const getVariantConfig = useCallback((testId: string): Record<string, any> => {
    const variant = getVariant(testId);
    return variant?.config || {};
  }, [getVariant]);

  const forceVariant = useCallback((testId: string, variantId: string) => {
    setUserVariants(prev => ({
      ...prev,
      [testId]: variantId,
    }));
    
    // Track forced variant assignment
    trackTestParticipation(testId, variantId);
  }, [trackTestParticipation]);

  const getTestResults = useCallback(async (testId: string) => {
    try {
      const response = await fetch(`/api/analytics/ab-testing/results/${testId}`);
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch A/B test results:', error);
      return null;
    }
  }, []);

  return {
    activeTests,
    userVariants,
    getVariant,
    getVariantConfig,
    trackConversion,
    forceVariant,
    getTestResults,
  };
};

export default useABTesting;
