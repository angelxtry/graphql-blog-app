import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import validator from 'validator';

import { Context } from '@/index';
import { JWT_SECRET } from '@/jwt-secret';
import {
  SignInInputArgs,
  SignInPayloadType,
  SignInResultEnum,
  SignUpInputArgs,
  SignUpPayloadType,
  SignUpResultEnum,
} from '@/types/auth';

const saltRounds = 10;

export const authResolvers = {
  signUp: async (
    _: any,
    { input: { name, email, password, bio } }: SignUpInputArgs,
    { prisma }: Context,
  ): Promise<SignUpPayloadType> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        __typename: SignUpResultEnum.SignUpInvalidInputError,
        message: 'email error',
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        __typename: SignUpResultEnum.SignUpInvalidInputError,
        message: 'password error',
      };
    }

    if (!name && !password && !bio) {
      return {
        __typename: SignUpResultEnum.SignUpInvalidInputError,
        message: 'all input data error',
      };
    }

    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const hash = await bcrypt.hash(password, saltRounds);

    if (existedUser) {
      return {
        __typename: SignUpResultEnum.SignUpAlreadyExistError,
        message: 'user already exist error',
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    return {
      __typename: SignUpResultEnum.SignUpResultSuccess,
      success: true,
    };
  },

  signIn: async (
    _: any,
    { input: { email, password } }: SignInInputArgs,
    { prisma }: Context,
  ): Promise<SignInPayloadType> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        __typename: SignInResultEnum.SignInUserNotFoundError,
        message: 'not found user',
      };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        __typename: SignInResultEnum.SignInInvalidPasswordError,
        message: 'invalid password',
      };
    }

    const token = JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: 3600000 },
    );

    return {
      __typename: SignInResultEnum.SignInResultSuccess,
      token,
    };
  },
};
