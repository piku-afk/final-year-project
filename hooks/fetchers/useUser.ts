import { User } from '@prisma/client';
import axios from 'axios';

export const useUser = async (url: string) => {
  const { data } = await axios.get('/api/auth/user');
  return (data as User) || {};
};
