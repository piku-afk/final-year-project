import { Election } from '@prisma/client';
import axios from 'axios';

export const useElections = async (url: string) => {
  const { data } = (await axios({
    url,
  })) as { data: Election[] };
  return data || [];
};
