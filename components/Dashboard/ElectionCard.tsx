import { Card, Center, Grid, Paper, Skeleton, Text } from '@mantine/core';
import { Election } from '@prisma/client';
import { FC } from 'react';
import dayjs from 'dayjs';
import { useMediaQuery } from 'hooks';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

interface ElectionCardProps {
  election: Election;
}

const formatDate2 = (date: Date | null) => {
  return date ? dayjs(date).format('LL') : '';
};

export const ElectionCard: FC<ElectionCardProps> = (props) => {
  const { election } = props;
  const { title, description, start, end, status } = election;
  const { isExtraSmall } = useMediaQuery();

  return (
    <Card
      // component={NextLink}
      // href='/'
      style={{ color: 'initial' }}
      withBorder
      mb={16}>
      <Grid justify='space-between'>
        <Grid.Col lg={8.5} sm={7} xs={6}>
          <Text weight={600} size='lg'>
            {title}
          </Text>
          <Text size='sm' lineClamp={2}>
            {description}
          </Text>
        </Grid.Col>
        <Grid.Col lg={2.5} sm={3.5} xs={4.5} span={9}>
          {start ? (
            <>
              <Text weight={600} size='md'>
                Duration
              </Text>
              <Text>
                {!end
                  ? `Starts from ${formatDate2(start)}`
                  : formatDate2(start)}{' '}
                {end && '-'} {formatDate2(end)}
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
          lg={1}
          sm={1.5}
          xs={1.5}
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

export const ElectionCardSkeleton = () => {
  return (
    <Card withBorder mb={16}>
      <Grid justify='space-between'>
        <Grid.Col xs={9}>
          <Skeleton height={14} visible={true} width={200} mb={8} />
          <Skeleton height={12} visible={true} />
        </Grid.Col>
        <Grid.Col xs={2} span={9}>
          <Skeleton height={12} visible={true} width={100} mb={8} />
          <Skeleton height={12} visible={true} />
        </Grid.Col>
        <Grid.Col xs={1} span={3}>
          <Skeleton height={12} visible={true} width={50} mb={8} ml='auto' />
        </Grid.Col>
      </Grid>
    </Card>
  );
};
