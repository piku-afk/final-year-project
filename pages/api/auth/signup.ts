import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { validate, Joi } from 'express-validation';
import { ncOptions } from 'server/configs';
import { JoiValidators } from 'server/utils';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { email: string; password: string; name: string };
}

const { email, name, password } = JoiValidators;
const validateBody = {
  body: Joi.object({
    email,
    name,
    password,
  }),
};

handler
  .use(validate(validateBody))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { email, password, name } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      res.statusCode = 400;
      return res.json({
        message: 'User already registered with the given email.',
      });
    }
    await prisma.user.create({
      data: { email, name, password },
    });

    return res.json({ message: 'Sign up successful' });
  });

export default handler;
