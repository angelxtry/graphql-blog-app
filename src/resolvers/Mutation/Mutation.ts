import { authResolvers } from '@/resolvers/Mutation/auth.resolvers';
import { postResolvers } from '@/resolvers/Mutation/post.resolvers';

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
