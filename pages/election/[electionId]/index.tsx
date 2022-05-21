import { Button, Card, Grid, Textarea } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Status } from 'components/Election/Overview';
import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';
import { Copy } from 'tabler-icons-react';

const OverView: NextPageWithLayout = () => {
  const clipboard = useClipboard({ timeout: 1500 });

  return (
    <>
      <Status />
      <Card mt={24} withBorder>
        <Grid align='flex-end'>
          <Grid.Col xs={10} span={7}>
            <Textarea
              description='You will provided with an election url which you share with others once you launch the election.'
              minRows={1}
              disabled
              label='Election Url'
              value='https://evotingdapp.vercel.app/'
            />
          </Grid.Col>
          <Grid.Col xs={2} span={5}>
            <Button
              color={clipboard.copied ? 'green' : 'cyan'}
              variant='light'
              onClick={() => clipboard.copy('hello')}
              leftIcon={<Copy size={18} />}>
              {clipboard.copied ? 'Copied' : 'Copy'}
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
};

OverView.getLayout = withElectionLayout;

export default OverView;
