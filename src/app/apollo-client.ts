import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/api/graphql", // Proxied graphql endpoint
});

const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage or state
  const token = localStorage.getItem("token");

  // Return the headers with the authorization token
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

client.cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        attributes: {
          merge(existing = [], incoming) {
            const merged = [...existing];

            incoming.forEach((newAttr) => {
              const existingIndex = merged.findIndex(
                (attr) => attr.name === newAttr.name
              );
              if (existingIndex > -1) {
                merged[existingIndex] = newAttr;
              } else {
                merged.push(newAttr);
              }
            });
            return merged;
          },
        },
      },
    },
  },
});

export default client;
