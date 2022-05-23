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

const { address } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    address,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const { body, query } = req;
    const { address } = body as { address: string };
    const { electionId } = query;

    const savedElection = await prisma.election.findFirst({
      where: { id: +electionId },
      select: { id: true },
    });
    if (!savedElection) {
      return SendBadRequest(res, 'Invalid election id');
    }

    const { id } = await prisma.election.update({
      where: { id: +electionId },
      data: { status: 'ONGOING', address },
      select: { id: true },
    });

    res.json({ message: 'success', id });
  });

export default withSessionRoute(handler);
