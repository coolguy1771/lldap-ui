/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/api/graphql`, // Your GraphQL server
      },
      {
        source: "/auth/simple/login",
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/auth/simple/login`, // Your GraphQL server
      },
      {
        source: "/auth/refresh",
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/auth/refresh`, // Your GraphQL server
      },
    ];
  },
};

export default nextConfig;
