import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
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
