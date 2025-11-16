import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stable features for production reliability
  experimental: {
    typedRoutes: true, // Type-safe routing for better DX
    serverActions: true, // For secure form handling
    serverComponentsExternalPackages: ['@supabase/supabase-js', 'stripe'],
  },
  
  // Security headers implementation
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'strict-dynamic' 'nonce-{{CSP_NONCE}}' https://js.stripe.com https://www.google-analytics.com",
            "style-src 'self' 'nonce-{{CSP_NONCE}}' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https://images.unsplash.com https://*.supabase.co blob:",
            "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co https://ipapi.co",
            "frame-src https://js.stripe.com https://hooks.stripe.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "report-to default",
          ].join('; ')
        },
        {
          key: 'Report-To',
          value: JSON.stringify({
            group: 'default',
            max_age: 86400,
            endpoints: [{ url: '/api/csp-report' }],
          })
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options', 
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=self'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        }
      ]
    }
  ],
  
  // Image optimization with latency considerations  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'habitatlobby.com',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // 7 days for dynamic content
    dangerouslyAllowSVG: false, // Security: no SVG allowing
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/supabase-js': '@supabase/supabase-js/dist/module/index.js',
      };
    }
    
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          admin: {
            test: /[\\/](admin|dashboard)[\\/]/,
            name: 'admin',
            chunks: 'all',
            priority: 20,
          },
          stripe: {
            test: /[\\/]node_modules[\\/]@stripe[\\/]/,
            name: 'stripe',
            chunks: 'all',
            priority: 30,
          },
        },
      },
    };
    
    return config;
  },
  
  // Environment configuration
  env: {
    SITE_URL: process.env.SITE_URL || 'https://habitatlobby.com',
  },
  
  // Enable static optimization for applicable pages
  output: 'standalone',
  
  // Performance monitoring
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
