import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Status } from 'components/Election/Overview';
import { useElectionStore } from 'context/ElectionStore';
import { useMediaQuery } from 'hooks';
import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';
import { Copy } from 'tabler-icons-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Election } from '@prisma/client';
import useSWR from 'swr';
import { getResults } from 'hooks/fetchers';
import { ApiEndpoints } from 'utils/constants';
import { useGlobalStore } from 'context/GlobalStore';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const OverView: NextPageWithLayout = () => {
  const {
    state: { account },
  } = useGlobalStore();
  const {
    state: { election },
  } = useElectionStore();
  const {
    id: electionId,
    status,
    title,
    ElectionOption,
  } = election as Election & {
    ElectionOption: { id: number; title: string }[];
  };
  const clipboard = useClipboard({ timeout: 1500 });
  const { isExtraSmall } = useMediaQuery();
  const isNotLive = status !== 'ONGOING';
  const { data: electionResult, isValidating } = useSWR(
    `${ApiEndpoints.election}/${electionId}/getresult`,
    async (url) => {
      const { data } = (await axios.post(url, { address: account.number })) as {
        data: {
          electionId: string;
          result: {
            [optionId: string]: number;
          };
        };
      };
      return data || [];
    }
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${title} result`,
      },
    },
  };

  const labels = ElectionOption?.map((option) => option.title) || [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Till now',
        data:
          ElectionOption?.map((option) => electionResult?.result[option.id]) ||
          [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  console.log(
    ElectionOption?.map((option) => electionResult?.result[option.id])
  );

  return (
    <>
      <Status />
      <Card mt={24} withBorder>
        <Grid align='flex-end'>
          <Grid.Col xs={10.5} span={10}>
            <TextInput
              description='You will provided with an election url which you share with others once you launch the election.'
              disabled={isNotLive}
              label='Election Url'
              value={`http://localhost:3000/election/vote/${electionId}`}
            />
          </Grid.Col>
          <Grid.Col xs={1.5} span={2}>
            <Tooltip label='Copy Election URL' disabled={isNotLive}>
              {isExtraSmall ? (
                <ActionIcon size='lg' color='cyan' variant='light'>
                  <Copy size={18} />
                </ActionIcon>
              ) : (
                <Button
                  disabled={isNotLive}
                  color={clipboard.copied ? 'green' : 'cyan'}
                  variant='light'
                  onClick={() => clipboard.copy('hello')}
                  leftIcon={<Copy size={18} />}>
                  {clipboard.copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </Tooltip>
          </Grid.Col>
        </Grid>
      </Card>

      {!isNotLive && (
        <Card mt={24} withBorder>
          <Text size='lg' weight={600} align='center'>
            Result
          </Text>
          {isNotLive && <Text>Election is not live</Text>}
          {!account.number && (
            <Text>You have not connected your MetaMask Account.</Text>
          )}
          {account.number && !isNotLive && (
            <Bar options={options} data={data} />
          )}
        </Card>
      )}
    </>
  );
};

OverView.getLayout = withElectionLayout;

export default OverView;
