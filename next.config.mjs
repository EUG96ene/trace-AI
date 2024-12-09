/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // Ensure the environment variable name is correct
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGIN || "*" }, // Replace with your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/portal/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  basePath: "/portal",
   webpack: (config) => {
     config.resolve.alias.canvas = false;
    
      return config;
    },
    
};

export default nextConfig;
