import { Box, Image, Text, Title } from '@mantine/core';
import { VotingAuthLayout } from 'layouts/Voting/Auth';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import VotingSuccessSVG from 'public/images/voting success.svg';
import { useEffect, useState } from 'react';

const VotingSuccess: NextPage = () => {
  const [count, setCount] = useState(5);
  const { push } = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      push('/');
    }
  }, [count, push]);

  return (
    <VotingAuthLayout>
      <Head>
        <title>Vote Success</title>
      </Head>
      <Box style={{ textAlign: 'center' }}>
        <Title mb={16}>Success !</Title>
        <Image
          src={VotingSuccessSVG.src}
          alt='Construction Image'
          width={200}
          mb={6}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-block',
          }}
        />
        <Text size='lg'>Your vote has been successfully casted</Text>
        <Text size='sm' mt={4}>
          You will navigated to home page in {count} seconds
        </Text>
      </Box>
    </VotingAuthLayout>
  );
};

export default VotingSuccess;
