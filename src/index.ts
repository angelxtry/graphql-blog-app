import { ApolloServer } from 'apollo-server';

import { Query } from '@/resolvers';
import { typeDefs } from '@/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
  },
});

server.listen({ port: 6001 }).then(({ url }) => {
  console.log('Server start: ', url);
});
