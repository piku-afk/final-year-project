import {
  Button,
  Container,
  Header as MantineHeader,
  Menu,
  Paper,
  Title,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import Link from 'next/link';
import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';
import { useUser } from 'hooks/fetchers';
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

interface Header {
  headerRef: HTMLElement | undefined;
  setHeaderRef: Dispatch<SetStateAction<HTMLElement | undefined>>;
}

export const Header: FC<Header> = (props) => {
  const { children, headerRef, setHeaderRef } = props;
  const { data, error, isValidating } = useSWR('/api/auth/user', useUser);
  const { push, pathname } = useRouter();
  const [showShadow, setShowShadow] = useState(false);
  const { isExtraSmall } = useMediaQuery();

  const { name, id } = data || {};

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

  return (
    <>
      <MantineHeader
        // @ts-ignore
        component={Paper}
        ref={(ref) => ref && setHeaderRef(ref)}
        shadow={showShadow ? 'sm' : undefined}
        radius={0}
        fixed
        height='auto'
        py={isExtraSmall ? 16 : 24}
        style={{
          background: '#f8fafc',
          transition: 'box-shadow 0.1s ease-out',
        }}>
        <CustomContainer
          className='w-100 d-flex justify-content-between align-items-center border-bottom-0'
          // style={{  }}
        >
          <Title
            // @ts-ignore
            component={NextLink}
            href='/'
            order={3}
            className='hero-background'>
            {Constants.projectName}
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
                loading={isValidating}
                size='sm'
                color='cyan'
                variant='white'
                styles={{
                  root: { backgroundColor: 'inherit' },
                  leftIcon: isExtraSmall ? { marginRight: 0 } : {},
                }}
                leftIcon={<User size={18} />}
                rightIcon={<ChevronDown size={14} />}>
                {!isValidating && !isExtraSmall && name}
              </Button>
            }>
            <Menu.Item
              // disabled={pathname.includes('dashboard')}
              component={NextLink}
              href={`/${id}/dashboard`}
              icon={<ListDetails size={14} color='black' />}>
              Dashboard
            </Menu.Item>
            <Menu.Item
              component={NextLink}
              href={`/${id}/settings`}
              icon={<Settings size={14} color='black' />}>
              Settings
            </Menu.Item>
            <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </CustomContainer>
      </MantineHeader>
      {children}
    </>
  );
};
