const API = process.env.URL_API ?? "http://127.0.0.1:3101";

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/api/:ruta*", destination: `${API}/api/:ruta*` }];
  },
};
