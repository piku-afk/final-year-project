import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { search } = query as { search: string };
  const elections = await prisma.election.findMany({
    where: {
      title: {
        contains: search || '',
        mode: 'insensitive',
      },
    },
    orderBy: { id: 'desc' },
  });
  res.json(elections);
});

export default withSessionRoute(handler);
