import { Box, Card, Paper, Skeleton } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import { ElectionCard } from './ElectionCard';

interface CardContainerProps {
  elections: Election[];
  loading: boolean;
}

export const CardContainer: FC<CardContainerProps> = (props) => {
  const { elections = [], loading } = props;

  return (
    <Box mt={32}>
      {loading ? (
        <>
          <Skeleton visible={true} height={80} mb={16} />
          <Skeleton visible={true} height={80} mb={16} />
          <Skeleton visible={true} height={80} mb={16} />
          <Skeleton visible={true} height={80} mb={16} />
        </>
      ) : (
        elections.map((item) => <ElectionCard key={item.id} election={item} />)
      )}
    </Box>
  );
};
