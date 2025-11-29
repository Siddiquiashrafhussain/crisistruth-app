/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://reijuueiauolboakjgmy.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f',
    NEXT_PUBLIC_NEYSA_API_KEY: 'psai__aAYQI9dI_mnwynSgFbMJhQYyqXBZWaSNdXND6AHtyhWALQx',
    NEXT_PUBLIC_NEYSA_API_ENDPOINT: 'https://api.pipeshift.ai/v1',
    NEXT_PUBLIC_NEYSA_MODEL: 'qwen3-vl-30b-a3b'
  }
}

export default nextConfig
