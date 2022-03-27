import { Post as PostType } from '@prisma/client';

import { userLoader } from '@/loaders/user.loader';

export const Post = {
  author: ({ authorId }: PostType) => {
    return userLoader.load(authorId);
  },
};
