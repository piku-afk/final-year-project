import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ncOptions } from 'utils/configs';
import { withSessionRoute } from 'utils/configs/ironSession';

const handler = nc(ncOptions);

type ExtendedNextApiRequest = NextApiRequest & {
  session: {
    user: {
      id: number;
    };
  };
};

export default withSessionRoute(
  handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    return res.json({ ...req.session.user });
  })
);

// export default handler;
