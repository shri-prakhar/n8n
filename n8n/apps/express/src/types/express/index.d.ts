import { User } from '@prisma/client'; // or define your own shape

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
