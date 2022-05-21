import { Button, Group, Stepper, Text, Title } from '@mantine/core';
import { ConfirmDetails } from 'components/Election/Launch';
import { CheckBallot } from 'components/Election/Launch/CheckBallot';
import { useMediaQuery } from 'hooks';
import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';
import { useState } from 'react';

const steps = [
  { label: 'Confirm Details', Children: ConfirmDetails },
  { label: 'Check Ballot', Children: CheckBallot },
  { label: 'Terms', Children: ConfirmDetails },
  { label: 'Checkout', Children: ConfirmDetails },
];

const ElectionLaunch: NextPageWithLayout = () => {
  const { isExtraSmall } = useMediaQuery();
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((prev) => (prev < 4 ? prev + 1 : prev));
  const prevStep = () => setActive((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <>
      <Text size='xl' weight={600} mb={24}>
        Launch Election
      </Text>
      <Stepper
        color='cyan'
        active={active}
        onStepClick={setActive}
        size='sm'
        // breakpoint='sm'
      >
        {steps.map((step, index) => {
          const { Children, label } = step;
          return (
            <Stepper.Step
              key={label}
              label={!isExtraSmall && label}
              allowStepSelect={active > index}>
              <Children step={active} nextStep={nextStep} prevStep={prevStep} />
            </Stepper.Step>
          );
        })}
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </>
  );
};

ElectionLaunch.getLayout = withElectionLayout;

export default ElectionLaunch;
