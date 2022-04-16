import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';

const ElectionLaunch: NextPageWithLayout = () => {
  return (
    <>
      <h1>Election Launch</h1>
    </>
  );
};

ElectionLaunch.getLayout = withElectionLayout;

export default ElectionLaunch;
