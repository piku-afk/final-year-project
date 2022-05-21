import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { electionId } = query as { electionId: string };

  const questions = await prisma.electionOption.findMany({
    where: { electionId: +electionId },
  });
  res.json(questions);
});

export default withSessionRoute(handler);
