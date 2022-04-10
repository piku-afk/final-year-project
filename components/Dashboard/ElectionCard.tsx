import { Card, Grid, Paper, Text } from '@mantine/core';
import { FC } from 'react';

export const ElectionCard: FC = () => {
  return (
    <Card component={Paper} withBorder mb={16}>
      <Grid>
        <Grid.Col xs={9}>
          <Text weight={600} size='md'>
            Election Name
          </Text>
          <Text>Lorem ipsum dolor sit amet.</Text>
        </Grid.Col>
        <Grid.Col xs={2}>
          <Text weight={600} size='md'>
            Duration
          </Text>
          <Text>09/04/2022 - 10/04/2022</Text>
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
            Draft
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
