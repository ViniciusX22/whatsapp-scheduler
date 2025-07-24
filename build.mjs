import esbuild from "esbuild";

const buildOptions = {
  entryPoints: ["index.ts", "trigger/scheduled-message.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outdir: "dist",
  external: [
    "@trigger.dev/sdk",
    "axios",
    "express",
    "dotenv",
    "chrono-node",
    // Node.js built-ins
    "crypto",
    "fs",
    "path",
    "url",
    "util",
    "events",
    "stream",
    "buffer",
    "os",
    "http",
    "https",
    "net",
    "tls",
    "zlib",
  ],
  minify: true,
  treeShaking: true,
  // Keep arktype bundled for consistent validation
  splitting: false,
  sourcemap: false,
  legalComments: "none",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

try {
  await esbuild.build(buildOptions);
  console.log("✅ Build completed successfully!");

  // Copy built files to expected locations for Vercel
  const fs = await import("fs");
  const path = await import("path");

  // Show file sizes
  console.log("\n📊 Bundle Sizes:");
  const stats = [
    { name: "index.js", path: "dist/index.js" },
    {
      name: "trigger/scheduled-message.js",
      path: "dist/trigger/scheduled-message.js",
    },
  ];

  stats.forEach(({ name, path }) => {
    if (fs.existsSync(path)) {
      const size = fs.statSync(path).size;
      console.log(`  ${name}: ${(size / 1024).toFixed(1)}KB`);
    }
  });

  console.log("\n📁 Vercel will build api/index.ts directly during deployment");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
