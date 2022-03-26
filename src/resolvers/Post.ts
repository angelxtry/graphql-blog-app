import { Post as PostType } from '@prisma/client';

import { Context } from '@/index';
export const Post = {
  user: ({ authorId }: PostType, __: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: { id: authorId },
    });
  },
};
