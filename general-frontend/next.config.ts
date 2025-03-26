import type { NextConfig } from "next";
const withTM = require("next-transpile-modules")([
  "rc-util",
  "rc-tree",
  "rc-table",
  "rc-pagination",
  "rc-picker",
]);


const nextConfig: NextConfig = withTM({
  /* config options here */
  reactStrictMode: true,
});

export default nextConfig;
