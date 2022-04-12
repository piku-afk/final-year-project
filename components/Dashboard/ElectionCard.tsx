import { Card, Center, Grid, Paper, Text } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import dayjs from 'dayjs';
import { useMediaQuery } from 'hooks';

interface ElectionCardProps {
  election: Election;
}

const formatDate = (date: Date | null) =>
  date ? dayjs(date).format('DD/MM/YYYY') : '';

export const ElectionCard: FC<ElectionCardProps> = (props) => {
  const { election } = props;
  const { title, description, start, end, status } = election;
  const { isExtraSmall } = useMediaQuery();

  return (
    <Card withBorder mb={16}>
      <Grid justify='space-between'>
        <Grid.Col xs={9}>
          <Text weight={600} size='lg'>
            {title}
          </Text>
          <Text size='sm' lineClamp={2}>
            {description}
          </Text>
        </Grid.Col>
        <Grid.Col xs={2} span={9}>
          {start ? (
            <>
              <Text weight={600} size='md'>
                Duration
              </Text>
              <Text>
                {formatDate(start)} {end && '-'} {formatDate(end)}
              </Text>
            </>
          ) : (
            <Center className='h-100'>
              <Text color='gray' weight={500} size='sm'>
                Duration not specified
              </Text>
            </Center>
          )}
        </Grid.Col>
        <Grid.Col
          xs={1}
          span={3}
          style={{ textAlign: 'right', marginTop: isExtraSmall ? 'auto' : 0 }}>
          <Text
            className='border'
            component='span'
            size='sm'
            weight={600}
            sx={(theme) => ({
              borderRadius: 8,
              backgroundColor: theme.colors.yellow[2],
              color: theme.colors.yellow[8],
              marginTop: 'auto',
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
