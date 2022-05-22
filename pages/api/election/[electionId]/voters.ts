import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
import { isAuthenticated } from 'utils/middlewares';

const handler = nc(ncOptions);
handler.use(isAuthenticated);

handler.delete(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { electionId } = query;

  const savedElection = await prisma.election.findFirst({
    where: { id: +electionId },
    select: { id: true },
  });
  if (!savedElection) {
    SendBadRequest(res, `No election found for the id ${electionId}`);
  }

  await prisma.voter.deleteMany({ where: { electionId: +electionId } });
  res.json({ message: 'success' });
});

handler.get(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { electionId } = query;

  const savedElection = await prisma.election.findFirst({
    where: { id: +electionId },
    select: { id: true },
  });
  if (!savedElection) {
    SendBadRequest(res, `No election found for the id ${electionId}`);
  }

  const voters = await prisma.voter.findMany({
    where: { electionId: +electionId },
  });

  return res.json(voters);
});

export default withSessionRoute(handler);
