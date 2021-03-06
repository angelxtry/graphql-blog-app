import { Post } from '@prisma/client';

import { ErrorType } from '@/types/common';

interface PostEdge {
  node: Post;
}

export interface PostConnection {
  totalCount: number;
  edges: PostEdge[];
}

export interface PostIdInputArgs {
  postId: string;
}

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
