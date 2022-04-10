import { Joi, validate } from 'express-validation';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ncOptions } from 'server/configs';
import { JoiValidators } from 'server/utils';
import passport from 'server/utils/strategies/localStrategy';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { email: string; password: string };
  user: any;
}

const { email, password } = JoiValidators;
const validateBody = {
  body: Joi.object({
    email,
    password,
  }),
};

handler
  .use(validate(validateBody))
  .use(passport.initialize())
  .use(passport.authenticate('local', { session: false }))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.user;
    const privateKey = process.env.TOKEN_SECRET || '';
    const token = jwt.sign({ sub: id }, privateKey);

    return res.json({ access_token: token, id });
  });

export default handler;
