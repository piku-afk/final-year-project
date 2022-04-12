import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ncOptions } from 'utils/configs';
import { withSessionRoute } from 'utils/configs/ironSession';
import { isAuthenticated } from 'utils/middlewares/isAuthenticated';

const handler = nc(ncOptions);

declare global {
  type ExtendedNextApiRequest = NextApiRequest & {
    session: {
      user: {
        id: number;
      };
    };
  };
}

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  res.json({ id: 'hello' });
});

export default withSessionRoute(handler);
