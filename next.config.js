/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "sr", "es", "pseudo"],
    defaultLocale: "en",
  },
}

module.exports = nextConfig
