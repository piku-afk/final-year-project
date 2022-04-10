import { Joi, validate } from 'express-validation';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { prisma } from 'prisma/prisma';
import { ncOptions } from 'utils/configs';
import { JoiValidators } from 'server/utils';

const handler = nc(ncOptions);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    title: string;
    description?: string;
    start?: string;
    end?: string;
  };
  user: any;
}

const { title, description, start, end } = JoiValidators.election;
const validateBody = {
  body: Joi.object({
    description,
    end,
    start,
    title,
  }),
};

handler
  .use(validate(validateBody))
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id: userId } = req.user;
    try {
      const { id: electionId } = await prisma.election.create({
        data: { ...req.body, createdBy: userId },
      });

      return res.json({ message: 'success', id: electionId });
      // res.send({ name: 'hello' })/;
    } catch (error) {
      // console.log(error);
      return res.json({ message: 'failure' });
    }
  });

export default handler;
