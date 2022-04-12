import { NextApiRequest, NextApiResponse } from 'next';
import { Options } from 'next-connect';
import { ZodError } from 'zod';

export const ncOptions: Options<NextApiRequest, NextApiResponse> = {
  onError: (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof ZodError) {
      // for Join validation errors
      res.statusCode = 400;
      return res.json(err);
    }
    res.statusCode = 500;
    return res.end('Server error');
  },
  onNoMatch: (req, res) => {
    res.statusCode = 404;
    return res.end('Page is not found');
  },
};
