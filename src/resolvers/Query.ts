import { Post, Profile, User } from '@prisma/client';

import { Context } from '@/index';
import { PostIdInputArgs } from '@/types/post';

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

  post: (
    _: any,
    { postId }: PostIdInputArgs,
    { prisma }: Context,
  ): Promise<Post | null> => {
    return prisma.post.findUnique({
      where: { id: Number(postId) },
    });
  },

  posts: (_: any, __: any, { prisma }: Context): Promise<Post[]> => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
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
