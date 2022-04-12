import { Box, Card, Paper, Skeleton } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import { ElectionCard, ElectionCardSkeleton } from './ElectionCard';

interface CardContainerProps {
  elections: Election[];
  loading: boolean;
}

const numOfSkeletons = 5;

export const CardContainer: FC<CardContainerProps> = (props) => {
  const { elections = [], loading } = props;

  return (
    <Box mt={32}>
      {loading ? (
        <>
          {Array.from(Array(numOfSkeletons).keys()).map((item) => (
            <ElectionCardSkeleton key={item} />
          ))}
        </>
      ) : (
        elections.map((item) => <ElectionCard key={item.id} election={item} />)
      )}
    </Box>
  );
};
