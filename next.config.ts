import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "127.0.0.1", port: "8080", pathname: "/images/**" },
            { protocol: "http", hostname: "localhost",  port: "8080", pathname: "/images/**" },
            { protocol: 'http', hostname: 'artgallery-server', port: '8080', pathname: '/images/**' },
        ],
    },
};

export default nextConfig;
