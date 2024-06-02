/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'utfs.io',
      'brew-master-dev.s3.us-east-2.amazonaws.com' // Adicione este domínio
    ]
  }
};

module.exports = nextConfig;
