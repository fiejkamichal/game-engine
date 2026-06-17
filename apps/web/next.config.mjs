import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@game-engine/engine",
    "@game-engine/tic-tac-toe",
    "@game-engine/checkers",
  ],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
