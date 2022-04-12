import { Card, Grid, Paper, Text } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import dayjs from 'dayjs';

interface ElectionCardProps {
  election: Election;
}

const formatDate = (date: Date | null) =>
  date ? dayjs(date).format('DD/MM/YYYY') : '';

export const ElectionCard: FC<ElectionCardProps> = (props) => {
  const { election } = props;
  const { title, description, start, end, status } = election;

  return (
    <Card component={Paper} withBorder mb={16}>
      <Grid>
        <Grid.Col xs={9}>
          <Text weight={600} size='md'>
            {title}
          </Text>
          <Text>{description}</Text>
        </Grid.Col>
        <Grid.Col xs={2}>
          <Text weight={600} size='md'>
            Duration
          </Text>
          <Text>
            {formatDate(start)} {end && '-'} {formatDate(end)}
          </Text>
        </Grid.Col>
        <Grid.Col xs={1} style={{ textAlign: 'right' }}>
          <Text
            className='border'
            component='span'
            size='sm'
            weight={600}
            sx={(theme) => ({
              borderRadius: 8,
              backgroundColor: theme.colors.yellow[2],
              color: theme.colors.yellow[8],
            })}
            px={8}
            py={4}>
            {status}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
