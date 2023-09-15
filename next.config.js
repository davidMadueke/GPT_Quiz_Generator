/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["1h3.googleusercontent.com"]
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
