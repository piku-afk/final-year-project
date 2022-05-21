import { Election, ElectionOption } from '@prisma/client';
import axios from 'axios';

// interface params {
//   url: string;
//   search: string;
// }

export const getAllElections = async (url: string, search: string = '') => {
  console.log('url', url);
  if (!url) throw new Error('Url not found');
  const { data } = (await axios.get(url, {
    params: { search },
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
