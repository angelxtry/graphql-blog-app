import { authResolvers } from '@/resolvers/Mutation/authResolvers';
import { postResolvers } from '@/resolvers/Mutation/postResolvers';

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
