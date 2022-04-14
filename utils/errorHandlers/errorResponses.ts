import { NextApiResponse } from 'next';

export const SendBadRequest = (res: NextApiResponse, message: string) => {
  console.log('404:', message);
  res.status(400).json({ errorMessage: message || 'Bad data sent' });
};
