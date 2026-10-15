import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The site moved from okata-miracle.site to okata.space. Both domains are
  // attached to this project, so without this the old one keeps serving a
  // full 200 copy of every page — two identical sites in Google's eyes,
  // splitting whatever ranking either has earned. A permanent redirect moves
  // the signals across and keeps every old link (portal links already sent
  // to clients included) working.
  //
  // /api/* is deliberately left alone. Third parties call those URLs
  // server-to-server — Paystack's webhook in particular is registered
  // against a fixed URL — and webhooks generally don't follow redirects, so
  // redirecting them would silently stop purchases from being fulfilled.
  async redirects() {
    return [
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "(www\\.)?okata-miracle\\.site" }],
        destination: "https://www.okata.space/:path",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // @libsql/client pulls in native bindings (via hrana-client) that
  // Turbopack's bundler misparses when inlined (it tries to parse the
  // package's LICENSE file as JS) — excluding it from bundling and letting
  // Node require() it directly at runtime is the standard fix for DB
  // clients with native dependencies.
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/core",
    "@libsql/hrana-client",
    "@libsql/isomorphic-ws",
    "@libsql/win32-x64-msvc",
  ],
};

export default nextConfig;
