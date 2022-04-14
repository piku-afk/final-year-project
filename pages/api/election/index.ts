import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res) => {
  // isAuthenticated(req, res);
  const elections = await prisma.election.findMany();
  res.json(elections);
});

export default withSessionRoute(handler);
