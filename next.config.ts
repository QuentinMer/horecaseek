/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgnakwwwkgznbmrntdgq.supabase.co',
        pathname: '/storage/v1/object/public/spots-images/**',
      },
      {
        protocol: 'https',
        hostname: 'dgnakwwwkgznbmrntdgq.supabase.co',
        pathname: '/storage/v1/object/public/avatars/**',
      },
       {
        protocol: "https",
        hostname: "dgnakwwwkgznbmrntdgq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;