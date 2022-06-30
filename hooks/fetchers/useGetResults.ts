import axios from 'axios';

export const getResults = async (url: string) => {
  const { data } = (await axios.get(url)) as {
    data: {
      electionId: string;
      result: {
        [optionId: string]: number;
      };
    };
  };
  return data || [];
};
