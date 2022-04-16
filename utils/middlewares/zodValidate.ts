import { ExtendedNextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { AnyZodObject } from 'zod';

export const zodValidate =
  (schema: AnyZodObject) =>
  async (
    req: ExtendedNextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    try {
      await schema.parseAsync({ body: req.body });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
