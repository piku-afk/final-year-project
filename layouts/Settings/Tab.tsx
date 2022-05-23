import { Card, Center, Grid } from '@mantine/core';
import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import Image, { ImageProps } from 'next/image';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { withSettingsLayout } from '.';

const SettingsTab: FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const {
    state: {
      currentUser: { id },
    },
  } = useGlobalStore();
  const { isExtraSmall, isSmall } = useMediaQuery();

  return (
    <>
      <Grid align='stretch'>
        <Grid.Col>{/* <Card>{children}</Card> */}</Grid.Col>
      </Grid>
    </>
  );
};

export const withSettingsTabLayout = (page: ReactElement) =>
  withSettingsLayout(<SettingsTab>{page}</SettingsTab>);
