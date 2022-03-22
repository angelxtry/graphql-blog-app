import { Profile as ProfileType, User } from '@prisma/client';

import { Context } from '@/index';

export const Profile = {
  user: async (
    { userId }: ProfileType,
    __: any,
    { prisma }: Context,
  ): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
};
