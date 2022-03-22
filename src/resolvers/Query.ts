import { Post, Profile, User } from '@prisma/client';

import { Context } from '@/index';

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
