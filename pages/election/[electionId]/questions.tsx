import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';

const ElectionQuestions: NextPageWithLayout = () => {
  return (
    <>
      <h1>Election Questions</h1>
    </>
  );
};

ElectionQuestions.getLayout = withElectionLayout;

export default ElectionQuestions;
