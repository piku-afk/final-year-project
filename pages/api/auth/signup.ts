import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { HashPassword } from 'prisma/middlewares';
import { ZodValidators } from 'utils';
import { ncOptions } from 'utils/configs';
import { zodValidate } from 'utils/middlewares';
import { ZodError, z } from 'zod';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { email: string; password: string; name: string };
}

const { email, name, password } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    email,
    name,
    password,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const { email, password, name } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        res.statusCode = 400;
        const userError: Partial<ZodError> = {
          issues: [
            {
              message: 'User already registered with the given email',
              code: 'custom',
              path: [],
            },
          ],
        };
        return res.json(userError);
      }
      // attaching middleware
      prisma.$use(HashPassword);
      await prisma.user.create({
        data: { email, name, password },
      });

      return res.json({ message: 'Sign up successful' });
    } catch (error) {
      return res.json({ message: 'Failure' });
    }
  });

export default handler;
