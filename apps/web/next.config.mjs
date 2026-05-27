/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@game-engine/engine",
    "@game-engine/tic-tac-toe",
    "@game-engine/checkers",
  ],
};

export default nextConfig;
