import { Status } from '@prisma/client';
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

handler.get(async (req: ExtendedNextApiRequest, res) => {
  const {
    query,
    session: {
      user: { id },
    },
  } = req;
  const { electionId } = query as { electionId: string };

  const election = await prisma.election.findFirst({
    where: { id: +electionId, userId: id },
    include: { _count: { select: { ElectionOption: true } } },
  });
  if (!election) return SendBadRequest(res, 'No election found');

  res.json(election);
});

handler.delete(async (req: ExtendedNextApiRequest, res) => {
  const { query } = req;
  const { electionId } = query as { electionId: string };
  if (!electionId) return SendBadRequest(res, 'No election id was found');
  const election = await prisma.election.delete({ where: { id: +electionId } });
  res.json({ message: 'success', id: election.id });
});

const { title, description, status, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    description: makeOptionalString(description),
    status: status.optional(),
    title: makeOptionalString(title),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .put(async (req: ExtendedNextApiRequest, res) => {
    const { query, body } = req;
    const { electionId } = query as { electionId: string };
    const { title, description, status } = body as {
      title: string;
      description: string;
      status: Status;
    };

    if (!electionId) return SendBadRequest(res, 'No election found.');
    const election = await prisma.election.update({
      where: { id: +electionId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    res.json(election);
  });

export default withSessionRoute(handler);
