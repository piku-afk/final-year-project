import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export const HashPassword: Prisma.Middleware = async (
  params: Prisma.MiddlewareParams,
  next
) => {
  if (
    params.action === 'create' &&
    params.model === 'User'
    // ||
    // (params.action === 'update' && params.model === 'Voter')
  ) {
    const user = params.args.data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  return next(params);
};
