import { Joi, validate } from 'express-validation';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ncOptions } from 'utils/configs';
import { LocalPassword } from 'utils/middlewares';
import { JoiValidators } from 'server/utils';
import { withSessionRoute } from 'utils/configs/ironSession';

const handler = nc(ncOptions);

type ExtendedNextApiRequest = NextApiRequest & {
  session: {
    user: {
      id: number;
    };
  };
  user: { id: number };
};

const { email, password } = JoiValidators.user;
const validateBody = {
  body: Joi.object({
    email,
    password,
  }),
};

handler
  .use(validate(validateBody))
  .use(LocalPassword.initialize())
  .use(LocalPassword.authenticate('local', { session: false }))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.user;

    req.session.user = { id: id };
    await req.session.save();

    return res.json({ message: 'success', userId: id });
  });

export default withSessionRoute(handler);
