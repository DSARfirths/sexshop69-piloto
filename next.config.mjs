/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/nsfw-assets/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noimageindex" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};
export default nextConfig;
