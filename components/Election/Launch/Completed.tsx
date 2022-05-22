import { Card, Container, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const Completed = () => {
  const [time, setTime] = useState(5);
  const { push, query } = useRouter();

  useEffect(() => {
    const timerId = setInterval(
      () => setTime((prev) => (prev === 0 ? 0 : prev - 1)),
      1000
    );
    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (time === 0) {
      const { electionId } = query;
      push(`/election/${electionId}`);
    }
  }, [time, query, push]);

  return (
    <Card component={Container} size='xs' className='text-center'>
      <Text size='xl'>Your Election is now live!</Text>
      <Text>
        You will be redirected in{' '}
        <Text component='span' color='cyan' weight={600}>
          {time}
        </Text>{' '}
        seconds.
      </Text>
    </Card>
  );
};
