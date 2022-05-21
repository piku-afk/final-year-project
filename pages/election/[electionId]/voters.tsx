import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';

const Voters: NextPageWithLayout = () => {
  return (
    <>
      <p>hello voters</p>
    </>
  );
};

Voters.getLayout = withElectionLayout;

export default Voters;
