import { User as UserType } from '@prisma/client';

import { Context } from '@/index';

export const User = {
  posts: ({ id }: UserType, _: any, { prisma, userInfo }: Context) => {
    if (userInfo.userId === id) {
      return prisma.post.findMany({
        where: { authorId: id },
      });
    } else {
      return prisma.post.findMany({
        where: { authorId: id, published: true },
      });
    }
  },
};
