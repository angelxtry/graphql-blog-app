import { Post, Profile, User } from '@prisma/client';

import { Context } from '@/index';
import { PaginationInput } from '@/types/common';
import { PostConnection, PostIdInputArgs } from '@/types/post';

interface UserIdInputArgs {
  userId: string;
}

export const Query = {
  me: async (
    _: any,
    __: any,
    { prisma, userInfo: { userId } }: Context,
  ): Promise<User | null> => {
    if (!userId) {
      return null;
    }
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  user: async (_: any, { userId }: UserIdInputArgs, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: { id: Number(userId) },
    });
  },

  post: (
    _: any,
    { postId }: PostIdInputArgs,
    { prisma }: Context,
  ): Promise<Post | null> => {
    return prisma.post.findUnique({
      where: { id: Number(postId) },
    });
  },

  posts: async (
    _: any,
    { pagination: { limit, page } }: PaginationInput,
    { prisma }: Context,
  ): Promise<PostConnection> => {
    const pagination = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const totalCount = await prisma.post.count();
    const posts = await prisma.post.findMany({
      skip: pagination.skip,
      take: pagination.take,
    });
    const edges = posts.map((post) => ({ node: post }));

    return {
      totalCount,
      edges,
    };
  },

  profile: async (
    _: any,
    { userId }: UserIdInputArgs,
    { prisma }: Context,
  ): Promise<Profile | null> => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },
};
