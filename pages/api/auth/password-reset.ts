import bcrypt from 'bcrypt';
import { ExtendedNextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { HashPassword } from 'prisma/middlewares';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
import { isAuthenticated, zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

const { password } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    currentPassword: password,
    newPassword: password,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.session.user;
    const { currentPassword, newPassword } = req.body;
    const savedUser = await prisma.user.findFirst({ where: { id } });
    if (!savedUser) {
      return SendBadRequest(res, 'No user found with current id.');
    }
    const { password } = savedUser;
    const isValid = await bcrypt.compare(currentPassword, password);
    if (!isValid) {
      return SendBadRequest(res, 'Incorrect old password');
    }
    // attaching middleware for password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'success' });
  });

export default withSessionRoute(handler);
