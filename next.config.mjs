// Content-Security-Policy sources, kept in one place so they're easy to extend
// when a new third-party integration is added.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline'/'unsafe-eval' are pragmatic here — Next.js dev (fast refresh)
  // needs eval, and the app renders plenty of inline `style={{}}` attributes.
  // A stricter nonce-based CSP is a follow-up, not a blocker for this pass.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.posthog.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.basemaps.cartocdn.com https://*.posthog.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.posthog.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'leaflet']
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ]
  },
}

export default nextConfig
