/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'openweathermap.org'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig
