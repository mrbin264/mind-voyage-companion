const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  webpack: (config, { isServer, dev, nextRuntime }) => {
    // Exclude problematic modules from edge runtime
    if (nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        crypto: false,
        'node:net': false,
        'node:fs': false,
        'node:dns': false,
        'node:tls': false,
        'node:crypto': false,
        'mongodb-memory-server': false,
        'mongodb-memory-server-core': false,
        mongodb: false,
        mongoose: false,
      }
    }

    if (!isServer) {
      // Exclude server-only modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        crypto: false,
        'mongodb-memory-server': false,
        'mongodb-memory-server-core': false,
      }

      // Ignore server-only modules in client build
      config.externals = config.externals || []
      config.externals.push({
        'mongodb-memory-server': 'commonjs mongodb-memory-server',
        'mongodb-memory-server-core': 'commonjs mongodb-memory-server-core',
      })
    }

    // Handle MongoDB optional dependencies for all environments
    config.externals = config.externals || []

    // Add externals differently for edge vs server runtime
    if (nextRuntime === 'edge') {
      // For edge runtime, completely ignore these modules
      config.externals.push({
        'mongodb-memory-server': 'commonjs2 mongodb-memory-server',
        'mongodb-memory-server-core': 'commonjs2 mongodb-memory-server-core',
        kerberos: 'commonjs2 kerberos',
        'mongodb-client-encryption': 'commonjs2 mongodb-client-encryption',
        '@mongodb-js/zstd': 'commonjs2 @mongodb-js/zstd',
        '@aws-sdk/credential-providers':
          'commonjs2 @aws-sdk/credential-providers',
        'gcp-metadata': 'commonjs2 gcp-metadata',
        snappy: 'commonjs2 snappy',
        socks: 'commonjs2 socks',
        aws4: 'commonjs2 aws4',
        mongodb: 'commonjs2 mongodb',
        mongoose: 'commonjs2 mongoose',
      })
    } else {
      // For server runtime, use normal externals
      config.externals.push({
        kerberos: 'commonjs kerberos',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        '@aws-sdk/credential-providers':
          'commonjs @aws-sdk/credential-providers',
        'gcp-metadata': 'commonjs gcp-metadata',
        snappy: 'commonjs snappy',
        socks: 'commonjs socks',
        aws4: 'commonjs aws4',
      })
    }

    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
