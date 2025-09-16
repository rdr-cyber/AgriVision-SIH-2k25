import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Webpack configuration to handle server-only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide fallbacks for server-only modules in client bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false,
        dgram: false,
        async_hooks: false,
        buffer: false,
        https: false,
        http: false,
      };
      
      // Completely ignore these modules in client bundles
      config.externals = [
        ...(config.externals || []),
        '@genkit-ai/googleai',
        'genkit',
        '@genkit-ai/core',
        '@google/generative-ai',
        '@grpc/grpc-js',
        '@opentelemetry',
        'jaeger-client',
        'node-fetch',
      ];
    }
    return config;
  },
};

export default nextConfig;