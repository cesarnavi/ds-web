/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    API_BASE_URL: process.env.API_BASE_URL || "http://127.0.0.1:5000/v1"
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/biblioteca',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/v1/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '**',
        },
    ],
},
};

export default nextConfig;
