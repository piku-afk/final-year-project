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

  const { electionId, optionId } = query;

  const savedElection = await prisma.election.findFirst({
    where: { id: +electionId },
    select: { id: true },
  });
  if (!savedElection) {
    return SendBadRequest(res, 'Invalid election id');
  }

  const savedOption = await prisma.electionOption.findFirst({
    where: { id: +optionId },
    select: { id: true },
  });
  if (!savedOption) {
    return SendBadRequest(res, 'Invalid option id');
  }

  await prisma.electionOption.delete({ where: { id: +optionId } });
  res.json({ message: 'success', id: optionId });
});

const { description, makeOptionalString, title } = ZodValidators;

const dataSchema = z.object({
  body: z.object({
    description: makeOptionalString(description),
    title: makeOptionalString(title),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .put(async (req: ExtendedNextApiRequest, res) => {
    const { query, body } = req;
    const { electionId, optionId } = query;

    const savedElection = await prisma.election.findFirst({
      where: { id: +electionId },
      select: { id: true },
    });
    if (!savedElection) {
      return SendBadRequest(res, 'Invalid election id');
    }

    const savedOption = await prisma.electionOption.findFirst({
      where: { id: +optionId },
      select: { id: true },
    });
    if (!savedOption) {
      return SendBadRequest(res, 'Invalid option id');
    }

    const { title, description } = body;
    await prisma.electionOption.update({
      where: { id: +optionId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
      },
    });

    res.json({ message: 'success', id: optionId });
  });

export default withSessionRoute(handler);
