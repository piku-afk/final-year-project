import { Status } from '@prisma/client';
import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res) => {
  const { query, session } = req;
  const {
    user: { id: userId },
  } = session || ({} as { user: { id: number } });
  const { search, status = undefined } = query as {
    search: string;
    status: Status;
  };
  const elections = await prisma.election.findMany({
    where: {
      userId,
      title: {
        contains: search || '',
        mode: 'insensitive',
      },
      status,
    },
    orderBy: { id: 'desc' },
  });
  res.json(elections);
});

export default withSessionRoute(handler);
