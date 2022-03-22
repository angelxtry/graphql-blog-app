import JWT from 'jsonwebtoken';

import { JWT_SECRET } from '@/jwt-secret';

export interface UserFromToken {
  userId: number;
}

export const getUserFromToken = (token: string | undefined): UserFromToken | null => {
  try {
    if (!token) {
      return null;
    }
    return JWT.verify(token, JWT_SECRET) as UserFromToken;
  } catch (error) {
    return null;
  }
};
