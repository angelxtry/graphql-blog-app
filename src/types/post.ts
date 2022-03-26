import { Post } from '@prisma/client';

import { ErrorType } from '@/types/common';

export interface CreatePostInputArgs {
  input: {
    title: string;
    content: string;
  };
}

export enum PostMutationResultEnum {
  PostMutationResultSuccess = 'PostMutationResultSuccess',
  NotAuthorizedError = 'NotAuthorizedError',
  InvalidInputError = 'InvalidInputError',
  NotFoundPostError = 'NotFoundPostError',
  NotOwnPostError = 'NotOwnPostError',
}

interface PostMutationResultSuccess {
  __typename: PostMutationResultEnum.PostMutationResultSuccess;
  post: Post;
}

type NotAuthorizedError = ErrorType;
type InvalidInputError = ErrorType;
type NotFoundPostError = ErrorType;
type NotOwnPostError = ErrorType;

export type CreatePostPayloadType =
  | PostMutationResultSuccess
  | NotAuthorizedError
  | InvalidInputError;

export type PostPayloadType =
  | PostMutationResultSuccess
  | NotAuthorizedError
  | InvalidInputError
  | NotFoundPostError
  | NotOwnPostError;

export interface UpdatePostInputArgs {
  id: string;
  input: {
    title?: string;
    content?: string;
  };
}

export interface PostIdInputArgs {
  postId: string;
}
