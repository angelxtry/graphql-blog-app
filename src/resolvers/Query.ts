import { Post } from '@prisma/client';

import { Context } from '@/index';

export const Query = {
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
