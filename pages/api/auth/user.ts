import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const {
    user: { id },
  } = req.session;

  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, email: true, name: true },
  });

  res.json(user);
});

export default withSessionRoute(handler);
