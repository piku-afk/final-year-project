import { NextApiResponse } from 'next';

export const SendBadRequest = (res: NextApiResponse, message: string) => {
  res.status(400).json({ errorMessage: message || 'Bad data sent' });
};
