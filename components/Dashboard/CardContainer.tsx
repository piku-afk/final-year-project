import { Box } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import { KeyedMutator } from 'swr';
import { ElectionCard, ElectionCardSkeleton } from './ElectionCard';

interface CardContainerProps {
  mutate: KeyedMutator<Election[]>;
  elections: Election[];
  loading: boolean;
}

const numOfSkeletons = 5;

export const CardContainer: FC<CardContainerProps> = (props) => {
  const { elections = [], loading, mutate } = props;

  return (
    <Box mt={32}>
      {loading ? (
        <>
          {Array.from(Array(numOfSkeletons).keys()).map((item) => (
            <ElectionCardSkeleton key={item} />
          ))}
        </>
      ) : (
        elections.map((item) => (
          <ElectionCard key={item.id} election={item} mutate={mutate} />
        ))
      )}
    </Box>
  );
};
