import { Post } from '@prisma/client';

import { Context } from '@/index';

interface CreatePostInputArgs {
  input: {
    title: string;
    content: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const Mutation = {
  createPost: async (
    _: any,
    { input: { title, content } }: CreatePostInputArgs,
    { prisma }: Context,
  ): Promise<PostPayloadType> => {
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'You must provide data',
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });
    return { userErrors: [], post };
  },
};
