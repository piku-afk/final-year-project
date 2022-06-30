import { Box, Button, Image, Text, Title } from '@mantine/core';
import { useElectionStore } from 'context/ElectionStore';
import { getElection } from 'hooks/fetchers';
import { VotingAuthLayout } from 'layouts/Voting/Auth';
import { NextPageWithLayout } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WelcomeSVG from 'public/images/welcoming.svg';
import useSWR from 'swr';
import { ChevronRight } from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

const VotingAuthPage: NextPageWithLayout = () => {
  const {
    query: { electionId },
  } = useRouter();

  const { data, isValidating } = useSWR(
    `${ApiEndpoints.election}/${electionId}`,
    getElection
  );

  const { title = '' } = data || {};
  const signupUrl = `/election/vote/${electionId}/auth/signup`;

  return (
    <VotingAuthLayout>
      <Head>
        <title>{title} | Election</title>
      </Head>
      <Title order={2} style={{ fontWeight: 600 }}>
        Welcome Voter,
      </Title>
      <Box
        style={{
          width: 200,
          margin: `30px auto 30px`,
        }}>
        <Image src={WelcomeSVG.src} alt='Voting Image' />
      </Box>
      <Text>
        You have been invited to vote for the election:{' '}
        <Text component='span' weight={600} transform='capitalize'>
          {title}
        </Text>
      </Text>
      <Link href={signupUrl} passHref>
        <Button
          component='a'
          mt={16}
          color='cyan'
          variant='light'
          styles={(theme) => ({
            label: { color: theme.colors.cyan[5] },
            rightIcon: { color: theme.colors.cyan[5] },
          })}
          rightIcon={<ChevronRight size={18} />}>
          Continue to Sign Up
        </Button>
      </Link>
    </VotingAuthLayout>
  );
};

export default VotingAuthPage;
