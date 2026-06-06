import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      {
        // SEO: consolidate duplicate leasing pages (keyword cannibalization).
        // /compare/leasing-vs-buying-comparison merged into the richer vehicles TCO calculator.
        source: "/compare/leasing-vs-buying-comparison",
        destination: "/vehicles/leasing-vs-buying",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // remark-gfm enables GitHub-Flavored Markdown — tables, strikethrough,
    // task lists, autolinks. Without it, pipe-tables in .mdx render as raw text.
    // NOTE: Next 16 uses Turbopack, which can't serialize imported plugin
    // functions — the plugin MUST be passed as a string (package name).
    remarkPlugins: [["remark-gfm"]],
  },
});

export default withMDX(nextConfig);
