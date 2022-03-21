import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { Context } from '@/index';

interface SignupInputArgs {
  input: {
    name: string;
    email: string;
    password: string;
  };
}

interface AuthPayloadType {
  userErrors: {
    message: string;
  }[];
  user: User | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { input: { name, email, password } }: SignupInputArgs,
    { prisma }: Context,
  ): Promise<AuthPayloadType> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [{ message: 'Invalid email' }],
        user: null,
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        userErrors: [{ message: 'Password too short' }],
        user: null,
      };
    }

    if (!name && !password) {
      return {
        userErrors: [{ message: 'You must provide data' }],
        user: null,
      };
    }

    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    if (existedUser) {
      return {
        userErrors: [{ message: 'Already exist' }],
        user: null,
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    return {
      userErrors: [],
      user,
    };
  },
};
