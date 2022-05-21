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

const { title, description, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    description: makeOptionalString(description),
    title, //required
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const { query, body } = req;
    const { electionId } = query as { electionId: string };
    const { title, description } = body as {
      title: string;
      description: string;
    };

    const savedElection = await prisma.election.findFirst({
      where: { id: +electionId },
      select: { id: true },
    });

    if (!savedElection) {
      return SendBadRequest(res, `No election found for the id ${electionId}`);
    }
    const { id } = await prisma.electionOption.create({
      data: { title, description, election: { connect: savedElection } },
    });

    return res.json({ message: 'success', id });
  });

export default withSessionRoute(handler);
