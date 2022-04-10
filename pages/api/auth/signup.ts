import { validate, Joi } from 'express-validation';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions } from 'utils/configs';
import { JoiValidators } from 'server/utils';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { email: string; password: string; name: string };
}

const { email, name, password } = JoiValidators.user;
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
    try {
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
    } catch (error) {
      console.log(error);
      return res.json({ message: 'Failure' });
    }
  });

export default handler;
