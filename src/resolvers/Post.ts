import { Post as PostType } from '@prisma/client';

import { Context } from '@/index';
import { userLoader } from '@/loaders/user.loader';

export const Post = {
  author: ({ authorId }: PostType, __: any, { prisma }: Context) => {
    // return prisma.user.findUnique({
    //   where: { id: authorId },
    // });
    return userLoader.load(authorId);
  },
};
