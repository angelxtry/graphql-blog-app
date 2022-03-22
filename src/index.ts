import { Prisma, PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import { Mutation, Profile, Query } from '@/resolvers';
import { typeDefs } from '@/schema';
import { getUserFromToken, UserFromToken } from '@/utils/get-user-from-token';

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;
  userInfo: UserFromToken;
}

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
  },
  context: ({ req }) => {
    const userInfo = getUserFromToken(req.headers.authorization);
    return { prisma, userInfo };
  },
});

server.listen({ port: 6001 }).then(({ url }) => {
  console.log('Server start: ', url);
});
