import { ethers } from 'ethers';
import { ExtendedNextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
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
    select: {
      id: true,
      email: true,
      name: true,
      organization: true,
      accountAddress: true,
    },
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
    const { name, organization, accountAddress } = req.body as {
      name: string;
      organization: string;
      accountAddress: string;
    };
    if (typeof accountAddress === 'string' && accountAddress) {
      const isValidAddress = ethers.utils.isAddress(accountAddress);
      if (!isValidAddress)
        return SendBadRequest(
          res,
          'accountNumber is not a valid Ethereum address'
        );
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(organization && { organization }),
        ...(accountAddress && { accountAddress }),
      },
    });

    res.json(updateUser);
  });

export default withSessionRoute(handler);
