/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['assets3.thrillist.com', 'lh3.googleusercontent.com'],
    },
};

module.exports = nextConfig;
