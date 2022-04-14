import { ExtendedNextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { isAuthenticated, zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);

handler.use(isAuthenticated);

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const {
    user: { id },
  } = req.session;

  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, email: true, name: true, organization: true },
  });

  res.json(user);
});

const { name, organization, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    name: makeOptionalString(name),
    organization: makeOptionalString(organization),
  }),
});

handler
  .use(zodValidate(dataSchema))
  .put(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.session.user;
    const { name, organization } = req.body as {
      name: string;
      organization: string;
    };

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(organization && { organization }),
      },
    });

    res.json(updateUser);
  });

export default withSessionRoute(handler);
