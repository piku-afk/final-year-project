import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ncOptions } from 'server/configs';
import passport from 'server/utils/strategies/jwtStrategy';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { email: string; password: string };
  user: any;
}

handler
  .use(passport.initialize())
  .use(passport.authenticate('jwt', { session: false }))
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    return res.json({ access_token: req.user });
  });

export default handler;
