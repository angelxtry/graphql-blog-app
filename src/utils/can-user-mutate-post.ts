import { Context } from '@/index';

export interface CanUserMutatePost {
  userId: number;
  postId: number;
  prisma: Context['prisma'];
}

export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: CanUserMutatePost): Promise<boolean> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  return post?.authorId === userId;
};
