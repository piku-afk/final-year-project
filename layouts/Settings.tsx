import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Stack,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useMediaQuery } from 'hooks';
import { useRouter } from 'next/router';
import { FC, ReactElement, ReactNode, useMemo } from 'react';
import { ChevronLeft, Settings, ShieldLock } from 'tabler-icons-react';

export const withSettingsLayout = (page: ReactElement) => (
  <SettingsLayout>{page}</SettingsLayout>
);

interface SideButton {
  leftIcon: ReactNode;
  label: String;
}

const SideButton: FC<SideButton> = (props) => {
  const { leftIcon, label } = props;
  const { query } = useRouter();
  const { tab, userId } = query as { tab: string; userId: string };
  const { isExtraSmall } = useMediaQuery();

  const selected = useMemo(() => {
    if (!tab) return label.toLowerCase() === 'general';
    return tab.toLowerCase() === label.toLowerCase();
  }, [tab, label]);

  const extraSmallProps = isExtraSmall
    ? {
        radius: 0,
        className: 'border-bottom',
        color: 'dark',
        variant: 'subtle',
      }
    : {
        variant: 'light',
        color: selected ? 'cyan' : 'gray',
      };
  return (
    // @ts-ignore
    <Button
      component={NextLink}
      href={`/${userId}/settings?tab=${label.toLowerCase()}`}
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
  const { isExtraSmall } = useMediaQuery();

  return (
    <Stack spacing={0}>
      <SideButton leftIcon={<Settings size={20} />} label='General' />
      <SideButton leftIcon={<ShieldLock size={20} />} label='Security' />
    </Stack>
  );
};

const SettingsLayout: FC = (props) => {
  const { children } = props;
  const { isExtraSmall } = useMediaQuery();
  const { query } = useRouter();
  const { userId, tab } = query;

  return (
    <>
      <Title style={{ fontWeight: 600 }}>Profile Settings</Title>
      {!isExtraSmall && <Divider mt={32} mb={32} />}
      <Grid>
        {!isExtraSmall && (
          <Grid.Col lg={2} sm={3} xs={4} className='border-right'>
            <SideNavigation />
          </Grid.Col>
        )}
        <Grid.Col lg={10} sm={9} xs={8} my={isExtraSmall && !tab ? 24 : 0}>
          {isExtraSmall && tab && (
            <UnstyledButton
              my={24}
              component={NextLink}
              href={`/${userId}/settings`}
              className='d-flex'
              style={{ display: 'block', fontSize: 18, color: 'black' }}>
              <ThemeIcon color='gray' variant='light' mr={4}>
                <ChevronLeft size={20} />
              </ThemeIcon>
              Settings
            </UnstyledButton>
          )}
          <Box mt={isExtraSmall ? 0 : -16}>{children}</Box>
        </Grid.Col>
      </Grid>
    </>
  );
};
