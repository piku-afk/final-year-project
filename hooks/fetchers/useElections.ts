import { Election } from '@prisma/client';
import axios from 'axios';

interface params {
  url: string;
  search: string;
}

export const useElections = async (params: params) => {
  const { url, search } = params;
  const { data } = (await axios({
    url,
    params: { search },
  })) as { data: Election[] };
  return data || [];
};
