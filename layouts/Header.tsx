import {
  Button,
  Center,
  Header as MantineHeader,
  Loader,
  Menu,
  Paper,
  Title,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import {
  Dispatch,
  FC,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ChevronDown,
  ListDetails,
  Logout,
  Settings,
  User,
} from 'tabler-icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useMediaQuery } from 'hooks';
import { NextLink } from '@mantine/next';
import { CustomContainer } from 'components/CustomizeMantine';
import { useGlobalStore } from 'context/GlobalStore';
import { ActionTypes } from 'context/reducer';

interface Header {
  headerRef: MutableRefObject<HTMLElement>;
}

export const Header: FC<PropsWithChildren<Header>> = (props) => {
  const { children, headerRef } = props;
  const { push, pathname, ...router } = useRouter();
  const [showShadow, setShowShadow] = useState(false);
  const { isExtraSmall } = useMediaQuery();
  const {
    state: { loading, currentUser, isInitializing },
    dispatch,
  } = useGlobalStore();

  const { name, id } = currentUser;

  const handleLogout = async () => {
    console.log('logout');
    await axios.get('/api/auth/logout');
    push('/');
    showNotification({
      message: 'Logged out successfully',
      color: 'green',
    });
  };

  const handleScroll = useCallback(() => {
    if (headerRef && window.scrollY > 40) {
      return setShowShadow(true);
    }
    return setShowShadow(false);
  }, [headerRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleStart = () =>
      dispatch({ type: ActionTypes.setLoading, payload: true });
    const handleComplete = () =>
      dispatch({ type: ActionTypes.setLoading, payload: false });

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [dispatch, router]);

  return (
    <>
      <MantineHeader
        // @ts-ignore
        component={Paper}
        ref={headerRef}
        shadow={showShadow ? 'sm' : undefined}
        radius={0}
        fixed
        height='auto'
        py={isExtraSmall ? 16 : 24}
        style={{
          background: '#f8fafc',
          transition: 'box-shadow 0.1s ease-out',
        }}>
        <CustomContainer className='w-100 d-flex justify-content-between align-items-center border-bottom-0'>
          <Title
            // @ts-ignore
            component={NextLink}
            href='/'
            order={3}
            className='hero-background'>
            {Constants.projectName} (beta)
          </Title>
          <Menu
            size='sm'
            // withArrow
            styles={{
              item: {
                '&:hover': { color: 'black' },
              },
            }}
            placement='end'
            control={
              <Button
                px={0}
                loading={isInitializing}
                size='sm'
                color='cyan'
                variant='white'
                styles={{
                  root: { backgroundColor: 'inherit' },
                  leftIcon: isExtraSmall ? { marginRight: 0 } : {},
                }}
                leftIcon={<User size={18} />}
                rightIcon={<ChevronDown size={14} />}>
                {!isInitializing && !isExtraSmall && name}
              </Button>
            }>
            <Menu.Item
              {...(pathname.includes('dashboard')
                ? { disabled: true }
                : { component: NextLink, href: `/${id}/dashboard` })}
              icon={<ListDetails size={14} />}>
              Dashboard
            </Menu.Item>
            <Menu.Item
              {...(pathname.includes('settings')
                ? { disabled: true }
                : { component: NextLink, href: `/${id}/settings` })}
              icon={<Settings size={14} />}>
              Settings
            </Menu.Item>
            <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </CustomContainer>
      </MantineHeader>
      {loading ? (
        <Center style={{ height: '100vh' }}>
          <Loader color='cyan' />
        </Center>
      ) : (
        children
      )}
    </>
  );
};
