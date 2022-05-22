import {
  ImportVoters,
  VoterListSkeleton,
  VotersList,
} from 'components/Election/Voters';
import { getVoters } from 'hooks/fetchers';
import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { ApiEndpoints } from 'utils/constants';

const Voters: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { electionId } = query;
  const { isValidating, data } = useSWR(
    `${ApiEndpoints.election}/${electionId}/voters`,
    getVoters
  );

  return isValidating ? (
    <VoterListSkeleton />
  ) : data && data.length > 0 ? (
    <VotersList data={data || []} />
  ) : (
    <ImportVoters />
  );
};

Voters.getLayout = withElectionLayout;

export default Voters;
