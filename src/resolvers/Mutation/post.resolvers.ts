import { Post } from '@prisma/client';

import { Context } from '@/index';
import { canUserMutatePost } from '@/utils/can-user-mutate-post';

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

interface DeletePostInputArgs {
  postId: string;
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const postResolvers = {
  createPost: async (
    _: any,
    { input: { title, content } }: CreatePostInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<PostPayloadType> => {
    if (!userInfo.userId) {
      return {
        userErrors: [{ message: 'Not authorize' }],
        post: null,
      };
    }

    if (!title || !content) {
      return {
        userErrors: [{ message: 'You must provide data' }],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });
    return { userErrors: [], post };
  },

  updatePost: async (
    _: any,
    { id, input }: UpdatePostInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<PostPayloadType> => {
    if (!userInfo.userId) {
      return {
        userErrors: [{ message: 'Not authorize' }],
        post: null,
      };
    }

    const { title, content } = input;
    if (!title && !content) {
      return {
        userErrors: [{ message: 'You must provide data' }],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return {
        userErrors: [{ message: 'Post not found' }],
        post: null,
      };
    }

    const canUpdate = await canUserMutatePost({
      userId: userInfo.userId,
      postId: existingPost.id,
      prisma,
    });

    if (!canUpdate) {
      return {
        userErrors: [{ message: 'Not authorize' }],
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

  deletePost: async (
    _: any,
    { postId }: DeletePostInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<PostPayloadType> => {
    if (!userInfo.userId) {
      return {
        userErrors: [{ message: 'Not authorize' }],
        post: null,
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        userErrors: [{ message: 'Post not found' }],
        post: null,
      };
    }

    const canDelete = await canUserMutatePost({
      userId: userInfo.userId,
      postId: post.id,
      prisma,
    });

    if (!canDelete) {
      return {
        userErrors: [{ message: 'Not authorize' }],
        post: null,
      };
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post: deletedPost,
    };
  },
};
