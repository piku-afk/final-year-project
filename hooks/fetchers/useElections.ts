import { Election, ElectionOption } from '@prisma/client';
import axios from 'axios';

// interface params {
//   url: string;
//   search: string;
// }

export const getAllElections = async (
  url: string,
  search: string = '',
  status = 'ALL'
) => {
  console.log('url', url);
  if (!url) throw new Error('Url not found');
  console.log(status !== 'ALL', status);

  const { data } = (await axios.get(url, {
    params: { search, ...(status !== 'ALL' && { status }) },
  })) as {
    data: Election[];
  };
  return data || [];
};

export const getElection = async (url: string) => {
  const { data } = (await axios.get(url)) as { data: Election };
  return data || [];
};

export const getQuestions = async (url: string) => {
  const { data } = (await axios.get(url)) as {
    data: ElectionOption[];
  };
  return data || [];
};
