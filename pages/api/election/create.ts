import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { zodValidate } from 'utils/middlewares';
import { z } from 'zod';

const handler = nc(ncOptions);

type ExtendedNextApiRequest = NextApiRequest & {
  body: {
    title: string;
    description?: string;
    start?: string;
    end?: string;
  };
  session: {
    user: { id: number };
  };
};

const { title, description, start, end, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    description: makeOptionalString(description),
    end: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    start: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    title,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id: userId } = req.session.user;
    // console.log(req.session.user);
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: { id: true },
      });
      if (user) {
        const { id: electionId } = await prisma.election.create({
          data: { ...req.body, createdBy: { connect: user } },
        });
        return res.json({ message: 'success', id: electionId });
      } else {
        throw Error(`No user found for the id ${userId}`);
      }
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      return res.json({ message: 'failure' });
    }
  });

export default withSessionRoute(handler);
