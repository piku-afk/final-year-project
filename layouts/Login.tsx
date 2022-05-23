import {
  Box,
  Card,
  Center,
  Container,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import VotingSVG from 'public/images/voting_nvu7.svg';
import { Constants } from 'utils/constants';
import { useRouter } from 'next/router';
import { Props } from 'next/script';

interface LoginLayoutPropTypes {
  image: { src: string };
}
// some
export const LoginLayout: FC<PropsWithChildren<LoginLayoutPropTypes>> = (
  props
) => {
  const { children, image } = props;
  const { pathname } = useRouter();
  const isLogin = pathname === '/login';

  return (
    <Container style={{ height: '100vh' }} fluid>
      <Center style={{ height: '100%' }}>
        <Card style={{ maxWidth: 375 }} withBorder shadow='md' px='xl' py={32}>
          {/* {isLogin && <Text align='center'>Hi there, welcome to</Text>} */}
          <Title order={3} my={3} align='center'>
            {Constants.projectName}
          </Title>
          <Title
            align='center'
            order={6}
            sx={(theme) => ({ color: theme.colors.gray[6] })}>
            An ethereum blockchain based dApp
          </Title>
          <Box
            style={{
              width: 200,
              margin: `${isLogin ? 40 : 30}px auto 30px`,
            }}>
            <Image src={image.src || VotingSVG.src} alt='Voting Image' />
          </Box>
          {children}
        </Card>
      </Center>
    </Container>
  );
};
