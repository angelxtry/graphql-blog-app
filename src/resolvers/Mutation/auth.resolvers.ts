import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import validator from 'validator';

import { Context } from '@/index';
import { JWT_SECRET } from '@/jwt-secret';

interface SignupInputArgs {
  input: {
    name: string;
    email: string;
    password: string;
    bio: string;
  };
}

interface SignInInputArgs {
  input: {
    email: string;
    password: string;
  };
}

interface SignUpPayloadType {
  userErrors: {
    message: string;
  }[];
  success: boolean;
}

interface SignInPayloadType {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

const saltRounds = 10;

export const authResolvers = {
  signUp: async (
    _: any,
    { input: { name, email, password, bio } }: SignupInputArgs,
    { prisma }: Context,
  ): Promise<SignUpPayloadType> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [{ message: 'Invalid email' }],
        success: false,
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        userErrors: [{ message: 'Password too short' }],
        success: false,
      };
    }

    if (!name && !password && !bio) {
      return {
        userErrors: [{ message: 'You must provide data' }],
        success: false,
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
        userErrors: [{ message: 'Already exist' }],
        success: false,
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
      userErrors: [],
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
        userErrors: [{ message: 'User not found' }],
        token: null,
      };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        userErrors: [{ message: 'SignIn fail' }],
        token: null,
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
      userErrors: [],
      token,
    };
  },
};
