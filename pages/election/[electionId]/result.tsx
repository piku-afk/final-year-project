import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';

const ElectionResult: NextPageWithLayout = () => {
  return (
    <>
      <h1>Election Result</h1>
    </>
  );
};

ElectionResult.getLayout = withElectionLayout;

export default ElectionResult;
