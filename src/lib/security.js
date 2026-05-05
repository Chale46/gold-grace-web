// ========================================
// API SECURITY CONFIGURATION
// ========================================
// Enhanced security for production deployment

// Rate limiting configuration
export const rateLimits = {
  // API endpoints rate limits
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Authentication endpoints stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  },
  
  // Contact form limits
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 contact submissions per hour
    message: 'Too many contact submissions, please try again later.',
  }
};

// Input validation schemas
export const validationSchemas = {
  // Contact form validation
  contact: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 100,
      required: true,
      sanitize: true
    },
    email: {
      type: 'email',
      required: true,
      sanitize: true
    },
    phone: {
      type: 'string',
      maxLength: 20,
      optional: true,
      sanitize: true
    },
    company: {
      type: 'string',
      maxLength: 100,
      optional: true,
      sanitize: true
    },
    message: {
      type: 'string',
      minLength: 10,
      maxLength: 2000,
      required: true,
      sanitize: true
    }
  },
  
  // Article validation
  article: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 200,
      required: true,
      sanitize: true
    },
    content: {
      type: 'string',
      minLength: 50,
      maxLength: 50000,
      required: true,
      sanitizeHTML: true
    },
    excerpt: {
      type: 'string',
      maxLength: 500,
      optional: true,
      sanitize: true
    },
    status: {
      type: 'enum',
      values: ['draft', 'published', 'archived'],
      required: true
    }
  }
};

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://yjzkkhbjtguwxgkyzmqo.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
};

// Input sanitization functions
export const sanitize = {
  // Basic text sanitization
  text: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  },
  
  // Email sanitization
  email: (input) => {
    if (typeof input !== 'string') return '';
    return input.toLowerCase().trim();
  },
  
  // HTML sanitization (basic)
  html: (input) => {
    if (typeof input !== 'string') return '';
    
    // Remove dangerous tags and attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<\s*\/?\s*script[^>]*>/gi, '')
      .replace(/<\s*\/?\s*iframe[^>]*>/gi, '');
  },
  
  // Phone number sanitization
  phone: (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[^\d+\-\s()]/g, '').trim();
  },
  
  // URL sanitization
  url: (input) => {
    if (typeof input !== 'string') return '';
    try {
      const url = new URL(input.trim());
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString();
    } catch {
      return '';
    }
  }
};

// Validation functions
export const validate = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Required field validation
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  // Length validation
  length: (value, min, max) => {
    const str = value.toString();
    return str.length >= min && str.length <= max;
  },
  
  // Enum validation
  enum: (value, allowedValues) => {
    return allowedValues.includes(value);
  }
};

// Error handling for security
export const securityErrors = {
  rateLimit: (res) => {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later',
      retryAfter: '15 minutes'
    });
  },
  
  validation: (field, message) => {
    return {
      error: 'Validation failed',
      field,
      message
    };
  },
  
  unauthorized: () => {
    return {
      error: 'Unauthorized',
      message: 'Authentication required'
    };
  },
  
  forbidden: () => {
    return {
      error: 'Forbidden',
      message: 'Insufficient permissions'
    };
  }
};

// Middleware for API security (example usage)
export const securityMiddleware = {
  // Rate limiting middleware
  rateLimit: (config) => {
    // This would be implemented with a rate limiting library
    // For now, it's a placeholder for the concept
    return (req, res, next) => {
      // Rate limiting logic here
      next();
    };
  },
  
  // Input validation middleware
  validateInput: (schema) => {
    return (req, res, next) => {
      // Validation logic here
      next();
    };
  },
  
  // Security headers middleware
  securityHeaders: (req, res, next) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  }
};

export default {
  rateLimits,
  validationSchemas,
  securityHeaders,
  sanitize,
  validate,
  securityErrors,
  securityMiddleware
};
