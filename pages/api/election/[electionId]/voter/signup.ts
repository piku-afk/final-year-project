import { ExtendedNextApiRequest } from 'next';
import nc from 'next-connect';
import { HashPassword } from 'prisma/middlewares';
import { prisma } from 'prisma/prisma';
import { ZodValidators } from 'utils';
import { ncOptions, withSessionRoute } from 'utils/configs';
import { SendBadRequest } from 'utils/errorHandlers';
import { zodValidate } from 'utils/middlewares';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const handler = nc(ncOptions);

const { email, password } = ZodValidators;
const dataSchema = z.object({
  body: z.object({
    email,
    password,
    confirmPassword: password,
  }),
});

handler
  .use(zodValidate(dataSchema))
  .post(async (req: ExtendedNextApiRequest, res) => {
    const { query, body } = req;
    const { electionId } = query;
    const { email, password } = body;

    const savedElection = await prisma.election.findFirst({
      where: { id: +electionId },
      select: { id: true },
    });
    if (!savedElection) {
      return SendBadRequest(res, 'Invalid election id');
    }

    const savedVoter = await prisma.voter.findFirst({
      where: { electionId: +electionId, email },
      select: { id: true, password: true },
    });
    if (savedVoter && !savedVoter?.password) {
      // attaching middleware for password hashing
      // prisma.$use(HashPassword);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedVoter = await prisma.voter.update({
        where: { id: savedVoter.id },
        data: { password: hashedPassword },
      });

      return res.json({ status: 'success', id: updatedVoter.id });
    } else if (savedVoter?.password) {
      return res.status(400).json({
        status: 'failure',
        errorMessage:
          'You have already signed up for this election. Consider signing in.',
      });
    }
    res.status(400).json({ status: 'failure', errorMessage: 'Invalid email' });
  });

export default withSessionRoute(handler);
