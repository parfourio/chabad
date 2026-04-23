/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w2.chabad.org',
        pathname: '/media/images/**',
      },
    ],
  },
}
export default nextConfig
