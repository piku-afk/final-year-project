import { Container, Skeleton, Tabs, Title } from '@mantine/core';
import { ElectionStore, useElectionStore } from 'context/ElectionStore';
import { withDefaultLayout } from 'layouts/Default';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, ReactElement, useMemo } from 'react';

const tabs = [
  { label: 'Overview', value: '' },
  { label: 'Edit', value: '/edit' },
  { label: 'Voters', value: '/voters' },
  { label: 'Results', value: '/result' },
  { label: 'Launch', value: '/launch' },
];

const Header = () => {
  const {
    state: {
      election: { id: electionId, title },
    },
    isInitializing,
  } = useElectionStore();
  const { push, asPath } = useRouter();

  const activeTab = useMemo(() => {
    const tabName = asPath.split('/').pop();
    if (!tabName) return 0;
    if (!isNaN(+tabName)) {
      return 0;
    }
    const value = tabs.findIndex((tab) => tab.value === `/${tabName}`);
    return value;
  }, [asPath]);

  return (
    <>
      <Head>
        <title>{title} | Overview</title>
      </Head>
      {isInitializing ? (
        <Skeleton width={250} height={40} visible={true} />
      ) : (
        <>
          <Title style={{ fontWeight: 600 }}>{title}</Title>

          <Tabs
            active={activeTab}
            onTabChange={(index, key) => {
              push(`/election/${electionId}/${key}`);
            }}
            color='cyan'
            my={24}
            variant='default'
            styles={{
              tabsList: {
                overflowX: 'auto',
                flexWrap: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              },
              tabLabel: { fontSize: 16 },
            }}>
            {tabs.map(({ label, value }) => (
              <Tabs.Tab key={label} label={label} tabKey={value} />
            ))}
          </Tabs>
        </>
      )}
    </>
  );
};

const ElectionDetailLayout: FC = (props) => {
  const { children } = props;
  const { asPath } = useRouter();
  const isLaunchPage = asPath.includes('launch');

  return (
    <ElectionStore>
      <Header />

      <Container px={0} size={isLaunchPage ? 'lg' : 'md'}>
        {children}
      </Container>
    </ElectionStore>
  );
};

export const withElectionLayout = (page: ReactElement) =>
  withDefaultLayout(<ElectionDetailLayout>{page}</ElectionDetailLayout>);
