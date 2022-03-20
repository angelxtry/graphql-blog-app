import { Post } from '@prisma/client';

import { Context } from '@/index';

interface CreatePostInputArgs {
  input: {
    title: string;
    content: string;
  };
}

interface UpdatePostInputArgs {
  id: string;
  input: {
    title?: string;
    content?: string;
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

  updatePost: async (
    _: any,
    { id, input }: UpdatePostInputArgs,
    { prisma }: Context,
  ): Promise<PostPayloadType> => {
    const { title, content } = input;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'You must provide data',
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post not found',
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { ...input },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
