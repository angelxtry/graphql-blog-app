import { ApolloServer } from 'apollo-server';

import { Mutation, Query } from '@/resolvers';
import { typeDefs } from '@/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
});

server.listen({ port: 6001 }).then(({ url }) => {
  console.log('Server start: ', url);
});
