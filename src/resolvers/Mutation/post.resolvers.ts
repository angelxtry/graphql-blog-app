import { Context } from '@/index';
import {
  CreatePostInputArgs,
  CreatePostPayloadType,
  PostIdInputArgs,
  PostMutationResultEnum,
  PostPayloadType,
  UpdatePostInputArgs,
} from '@/types/post';
import { canUserMutatePost } from '@/utils/can-user-mutate-post';

export const postResolvers = {
  createPost: async (
    _: any,
    { input: { title, content } }: CreatePostInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<CreatePostPayloadType> => {
    if (!userInfo.userId) {
      return {
        __typename: PostMutationResultEnum.NotAuthorizedError,
        message: 'not authorized',
      };
    }

    if (!title || !content) {
      return {
        __typename: PostMutationResultEnum.InvalidInputError,
        message: 'no required data',
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });
    return {
      __typename: PostMutationResultEnum.PostMutationResultSuccess,
      post,
    };
  },

  updatePost: async (
    _: any,
    { id, input }: UpdatePostInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<PostPayloadType> => {
    if (!userInfo.userId) {
      return {
        __typename: PostMutationResultEnum.NotAuthorizedError,
        message: 'not authorized',
      };
    }

    const { title, content } = input;
    if (!title && !content) {
      return {
        __typename: PostMutationResultEnum.InvalidInputError,
        message: 'no required data',
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return {
        __typename: PostMutationResultEnum.NotFoundPostError,
        message: 'not found post',
      };
    }

    const canUpdate = await canUserMutatePost({
      userId: userInfo.userId,
      postId: existingPost.id,
      prisma,
    });

    if (!canUpdate) {
      return {
        __typename: PostMutationResultEnum.NotOwnPostError,
        message: 'not own post',
      };
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { ...input },
    });

    return {
      __typename: PostMutationResultEnum.PostMutationResultSuccess,
      post,
    };
  },

  deletePost: async (
    _: any,
    { postId }: PostIdInputArgs,
    { prisma, userInfo }: Context,
  ): Promise<PostPayloadType> => {
    if (!userInfo.userId) {
      return {
        __typename: PostMutationResultEnum.NotAuthorizedError,
        message: 'not authorized',
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        __typename: PostMutationResultEnum.NotFoundPostError,
        message: 'not found post',
      };
    }

    const canDelete = await canUserMutatePost({
      userId: userInfo.userId,
      postId: post.id,
      prisma,
    });

    if (!canDelete) {
      return {
        __typename: PostMutationResultEnum.NotOwnPostError,
        message: 'not own post',
      };
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      __typename: PostMutationResultEnum.PostMutationResultSuccess,
      post: deletedPost,
    };
  },

  publishPost: async (
    _: any,
    { postId }: PostIdInputArgs,
    { prisma, userInfo: { userId } }: Context,
  ): Promise<PostPayloadType> => {
    if (!userId) {
      return {
        __typename: PostMutationResultEnum.NotAuthorizedError,
        message: 'not authorized',
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        __typename: PostMutationResultEnum.NotFoundPostError,
        message: 'not found post',
      };
    }

    const canPublish = canUserMutatePost({
      userId,
      postId: post.id,
      prisma,
    });

    if (!canPublish) {
      return {
        __typename: PostMutationResultEnum.NotOwnPostError,
        message: 'not own post',
      };
    }

    const publishedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        published: true,
      },
    });

    return {
      __typename: PostMutationResultEnum.PostMutationResultSuccess,
      post: publishedPost,
    };
  },

  unPublishPost: async (
    _: any,
    { postId }: PostIdInputArgs,
    { prisma, userInfo: { userId } }: Context,
  ): Promise<PostPayloadType> => {
    if (!userId) {
      return {
        __typename: PostMutationResultEnum.NotAuthorizedError,
        message: 'not authorized',
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        __typename: PostMutationResultEnum.NotFoundPostError,
        message: 'not found post',
      };
    }

    const canPublish = canUserMutatePost({
      userId,
      postId: post.id,
      prisma,
    });

    if (!canPublish) {
      return {
        __typename: PostMutationResultEnum.NotOwnPostError,
        message: 'not own post',
      };
    }

    const unPublishedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        published: false,
      },
    });

    return {
      __typename: PostMutationResultEnum.PostMutationResultSuccess,
      post: unPublishedPost,
    };
  },
};
