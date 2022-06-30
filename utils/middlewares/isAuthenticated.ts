import { ExtendedNextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export const isAuthenticated = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const { user } = req.session;
  if (!user || !user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const isAuthenticatedVoter = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const { voter } = req.session;
  console.log(voter);
  if (!voter || !voter.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
