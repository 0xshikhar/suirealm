/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**/**',
            },
        ],
    },
}

module.exports = nextConfig
