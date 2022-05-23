import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, ReactElement, ReactNode, useMemo, PropsWithChildren } from 'react';
import { ChevronLeft, Settings, ShieldLock, Wallet } from 'tabler-icons-react';
import { withDefaultLayout } from '../Default';

interface SideButton {
  leftIcon: ReactNode;
  label: String;
}

const SideButton: FC<SideButton> = (props) => {
  const { leftIcon, label } = props;
  const {
    state: {
      currentUser: { id },
    },
  } = useGlobalStore();
  const { pathname } = useRouter();
  const { isExtraSmall } = useMediaQuery();

  const selected = useMemo(() => {
    const paths = pathname.split('/') || [''];
    // const tab = 'general';
    const tab = paths[paths.length - 1];
    if (!tab) return false;

    if (paths.length === 4) {
      return tab.toLowerCase() === label.toLowerCase();
    } else if (paths.length === 3) {
      return label.toLowerCase() === 'general';
    }
    return false;
  }, [label, pathname]);

  const extraSmallProps = isExtraSmall
    ? {
        radius: 0,
        className: 'border-bottom',
        color: 'dark',
        variant: 'subtle',
      }
    : {
        variant: selected ? 'outline' : 'light',
        color: selected ? 'cyan' : 'gray',
      };
  return (
    // @ts-ignore
    <Button
      component={NextLink}
      href={`/${id}/settings/${label.toLowerCase()}`}
      px={16}
      my={2}
      size={isExtraSmall ? 'xl' : 'sm'}
      fullWidth
      {...extraSmallProps}
      styles={{
        root: {
          textAlign: 'left',
          '&:active': { transform: 'translateY(0) !important' },
          fontSize: 16,
          alignItems: 'center',
          // border: '1px solid red',
          '&:hover': { color: selected ? '#15AABF' : '#868E96' },
        },
        inner: {
          justifyContent: 'flex-start',
        },
      }}
      leftIcon={leftIcon}>
      {label}
    </Button>
  );
};

export const SideNavigation = () => {
  return (
    <Stack spacing={0}>
      <SideButton leftIcon={<Settings size={20} />} label='General' />
      <SideButton leftIcon={<Wallet size={20} />} label='MetaMask' />
      <SideButton leftIcon={<ShieldLock size={20} />} label='Security' />
    </Stack>
  );
};

const SettingsLayout: FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const {
    state: {
      currentUser: { id, name },
    },
  } = useGlobalStore();
  const { isExtraSmall } = useMediaQuery();
  const { pathname } = useRouter();

  const showBackButton = useMemo(() => {
    if (!isExtraSmall) return false;
    const paths = pathname.split('/') || [];
    const notSettings = paths.at(-1)?.toLowerCase() !== 'settings';
    if (paths.length === 4 && notSettings) {
      return true;
    }
    return false;
  }, [pathname, isExtraSmall]);

  return (
    <>
      <Head>
        <title>{name} | Settings</title>
      </Head>
      <Title style={{ fontWeight: 600 }}>Profile Settings</Title>
      {!isExtraSmall && <Divider mt={32} mb={40} />}
      <Grid gutter={isExtraSmall ? undefined : 'xl'}>
        {!isExtraSmall && (
          <Grid.Col lg={2} sm={3} xs={4} className='border-right'>
            <SideNavigation />
          </Grid.Col>
        )}
        <Grid.Col lg={10} sm={9} xs={8} my={isExtraSmall ? 24 : 0}>
          {showBackButton && (
            <UnstyledButton
              my={24}
              component={NextLink}
              href={`/${id}/settings`}
              className='d-flex'
              style={{ display: 'block', fontSize: 18, color: 'black' }}>
              <ThemeIcon color='gray' variant='light' mr={4}>
                <ChevronLeft size={20} />
              </ThemeIcon>
              Settings
            </UnstyledButton>
          )}
          <Box mt={isExtraSmall ? 0 : -24}>{children}</Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export const withSettingsLayout = (page: ReactElement) =>
  withDefaultLayout(<SettingsLayout>{page}</SettingsLayout>);
