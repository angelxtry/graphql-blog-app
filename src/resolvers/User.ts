import { User as UserType } from '@prisma/client';

import { Context } from '@/index';
import { PaginationInput } from '@/types/common';
import { PostConnection } from '@/types/post';

export const User = {
  posts: async (
    { id }: UserType,
    { pagination: { limit, page } }: PaginationInput,
    { prisma, userInfo }: Context,
  ): Promise<PostConnection> => {
    const pagination = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const where =
      userInfo.userId === id ? { authorId: id } : { authorId: id, published: true };

    const posts = await prisma.post.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
    });

    const totalCount = await prisma.post.count({ where });
    const edges = posts.map((post) => ({ node: post }));

    return {
      totalCount,
      edges,
    };
  },
};
