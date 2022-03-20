import { Prisma, PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import { Query } from '@/resolvers';
import { typeDefs } from '@/schema';

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;
}

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
  },
  context: {
    prisma,
  },
});

server.listen({ port: 6001 }).then(({ url }) => {
  console.log('Server start: ', url);
});
