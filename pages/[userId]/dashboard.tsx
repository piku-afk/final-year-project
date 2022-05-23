import { ActionIcon, Button, Group, Title, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Filter, NewElection } from 'components/Dashboard';
import { CardContainer } from 'components/Dashboard/CardContainer';
import { useMediaQuery } from 'hooks';
import { getAllElections } from 'hooks/fetchers';
import { withDefaultLayout } from 'layouts';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPageWithLayout,
} from 'next';
import Head from 'next/head';
import { prisma } from 'prisma/prisma';
import { useState } from 'react';
import useSWR from 'swr';
import { Plus } from 'tabler-icons-react';
import { withSessionSsr } from 'utils/configs';
import { ApiEndpoints } from 'utils/constants';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context: GetServerSidePropsContext) => {
    const { req } = context;
    // @ts-ignore
    const { user } = req.session as { user: { id: number } };
    const redirectToLogin = {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

    if (!user || !user.id) {
      return redirectToLogin;
    }

    if (user) {
      const { id } = user;
      const savedUser = await prisma.user.findFirst({ where: { id } });
      if (!savedUser) {
        return redirectToLogin;
      }
    }
    return {
      props: {},
    };
  }
);

const DashBoard: NextPageWithLayout = () => {
  const { isExtraSmall } = useMediaQuery();
  const [newElection, setNewElection] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const {
    data: elections = [],
    isValidating,
    mutate,
  } = useSWR(
    [ApiEndpoints.election, debouncedSearch, status],
    getAllElections,
    {
      focusThrottleInterval: 60 * 1000,
    }
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Group mb={32} className='justify-content-between'>
        <Title style={{ fontWeight: 600 }}>Dashboard</Title>
        {isExtraSmall ? (
          <Tooltip label='Create new election' position='top'>
            <ActionIcon
              color='cyan'
              variant='light'
              onClick={() => setNewElection(true)}
              size='lg'>
              <Plus size={20} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Button
            color='cyan'
            variant='light'
            onClick={() => setNewElection(true)}>
            Create New Election
          </Button>
        )}
      </Group>
      <Filter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        loading={isValidating}
      />
      <CardContainer
        elections={elections}
        loading={isValidating}
        mutate={mutate}
      />
      <NewElection
        open={newElection}
        onClose={() => setNewElection(false)}
        mutate={mutate}
      />
    </>
  );
};

DashBoard.getLayout = withDefaultLayout;

export default DashBoard;
