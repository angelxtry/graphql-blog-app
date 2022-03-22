import { Post, User } from '@prisma/client';

import { Context } from '@/index';

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
};
