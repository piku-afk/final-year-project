import { Voter } from '@prisma/client';
import axios from 'axios';

export const getVoters = async (url: string) => {
  const { data } = (await axios.get(url)) as { data: Voter[] };
  return data || [];
};
