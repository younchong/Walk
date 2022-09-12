/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withPWA = require('next-pwa')({
  dest: 'public'
});

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = withPWA(nextConfig)
