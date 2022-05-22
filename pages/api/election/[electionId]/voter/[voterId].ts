import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
import { isAuthenticated, zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);
handler.use(isAuthenticated);

handler.delete(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { electionId, voterId } = query;

  const savedElection = await prisma.election.findFirst({
    where: { id: +electionId },
    select: { id: true },
  });
  if (!savedElection) {
    return SendBadRequest(res, 'Invalid election id');
  }

  const savedVoter = await prisma.voter.findFirst({
    where: { id: +voterId },
    select: { id: true },
  });
  if (!savedVoter) {
    return SendBadRequest(res, 'Invalid voter id');
  }

  await prisma.voter.delete({ where: { id: +voterId } });
  res.json({ message: 'success', id: voterId });
});

const { description, makeOptionalString, title } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    email: makeOptionalString(description),
    name: makeOptionalString(title),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .put(async (req: ExtendedNextApiRequest, res) => {
    const { query, body } = req;
    const { electionId, voterId } = query;

    const savedElection = await prisma.election.findFirst({
      where: { id: +electionId },
      select: { id: true },
    });
    if (!savedElection) {
      return SendBadRequest(res, 'Invalid election id');
    }

    const savedVoter = await prisma.voter.findFirst({
      where: { id: +voterId },
      select: { id: true },
    });
    if (!savedVoter) {
      return SendBadRequest(res, 'Invalid voter id');
    }

    const { name, email } = body;
    await prisma.voter.update({
      where: { id: +voterId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json({ message: 'success', id: voterId });
  });

export default withSessionRoute(handler);
