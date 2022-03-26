import { ErrorType } from '@/types/common';

export interface SignUpInputArgs {
  input: {
    name: string;
    email: string;
    password: string;
    bio: string;
  };
}

export enum SignUpResultEnum {
  SignUpResultSuccess = 'SignUpResultSuccess',
  SignUpInvalidInputError = 'SignUpInvalidInputError',
  SignUpAlreadyExistError = 'SignUpAlreadyExistError',
}

interface SignUpResultSuccess {
  __typename: string;
  success: boolean;
}

type SignUpInvalidInputError = ErrorType;

type SignUpAlreadyExistError = ErrorType;

export type SignUpPayloadType =
  | SignUpResultSuccess
  | SignUpInvalidInputError
  | SignUpAlreadyExistError;

export interface SignInInputArgs {
  input: {
    email: string;
    password: string;
  };
}

export enum SignInResultEnum {
  SignInResultSuccess = 'SignInResultSuccess',
  SignInUserNotFoundError = 'SignInUserNotFoundError',
  SignInInvalidPasswordError = 'SignInInvalidPasswordError',
}

interface SignInResultSuccess {
  __typename: SignInResultEnum.SignInResultSuccess;
  token: string;
}

type SignInUserNotFoundError = ErrorType;
type SignInInvalidPasswordError = ErrorType;

export type SignInPayloadType =
  | SignInResultSuccess
  | SignInUserNotFoundError
  | SignInInvalidPasswordError;
