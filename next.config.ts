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
});

export default withMDX(nextConfig);
