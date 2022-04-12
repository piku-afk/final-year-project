import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { LocalPassword, zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);

type ExtendedNextApiRequest = NextApiRequest & {
  session: {
    user: {
      id: number;
    };
  };
  user: { id: number };
};

const { email, password } = ZodValidators;

const dataSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .use(LocalPassword.initialize())
  .use(LocalPassword.authenticate('local', { session: false }))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.user;

    req.session.user = { id: id };
    await req.session.save();

    return res.json({ message: 'success', userId: id });
  });

export default withSessionRoute(handler);
