import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Container,
  Group,
  Header,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import { AppFeatures, Constants } from 'assets/constants';
import { useMediaQuery } from 'hooks';
import Link from 'next/link';
import { FlexContainer } from 'components/FlexContainer';
import { Footer } from 'layouts/Footer';
import DotsSvg from 'public/images/image.svg';

const ButtonsContainer = () => {
  const { isExtraSmall } = useMediaQuery();

  return (
    <>
      <Link href='/login' passHref>
        <Button
          component='a'
          size={isExtraSmall ? 'md' : 'sm'}
          color='cyan'
          variant='subtle'
          mr={8}>
          Log In
        </Button>
      </Link>
      <Link href='/signup' passHref>
        <Button
          component='a'
          size={isExtraSmall ? 'md' : 'sm'}
          color='cyan'
          variant='filled'
          mr={8}
          sx={{ '&:hover': { color: 'white' } }}>
          Sign Up
        </Button>
      </Link>
    </>
  );
};

const Hero: NextPage = () => {
  const { isExtraSmall, isSmall, isLarge } = useMediaQuery();
  const heroTextSize = isExtraSmall ? 38 : isSmall ? 40 : isLarge ? 56 : 64;
  const heroSubOrder = isExtraSmall ? 5 : isSmall ? 5 : 4;

  return (
    <BackgroundImage
      src={DotsSvg.src}
      style={{
        backgroundColor: '#12283a',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'left',
      }}>
      <Footer>
        <Head>
          <title>Welcome | {Constants.projectName}</title>
        </Head>

        <Container style={{ height: '100vh' }} size='xl'>
          <Stack className='h-100'>
            <Header
              style={{ borderBottom: 'none', backgroundColor: 'transparent' }}
              height='auto'
              className='w-100 d-flex justify-content-between'
              py={24}>
              <Title className='text-white' order={3}>
                {Constants.projectName}
              </Title>
              {!isExtraSmall && (
                <Box>
                  <ButtonsContainer />
                </Box>
              )}
            </Header>

            <Group
              style={{
                flexGrow: 1,
                flexDirection: isLarge ? 'column' : 'row',
                justifyContent: isLarge ? 'center' : 'flex-start',
              }}>
              <Box
                component={Container}
                size='sm'
                // className='border'
                sx={(theme) => ({
                  maxWidth: isLarge
                    ? theme.breakpoints.sm
                    : isSmall
                    ? theme.breakpoints.xs
                    : 'auto',
                  textAlign: 'center',
                })}>
                <Title
                  align={isLarge ? 'center' : undefined}
                  order={1}
                  style={{
                    color: 'white',
                    fontSize: heroTextSize,
                    lineHeight: `${heroTextSize + 8}px`,
                  }}>
                  <Text
                    component='span'
                    inherit
                    className='hero-background'
                    // variant='gradient'
                    // gradient={{ from: 'blue', to: 'teal' }}
                  >
                    Secure, Blockchain
                  </Text>{' '}
                  based Elections
                </Title>
                <Title
                  align={isLarge ? 'center' : undefined}
                  order={heroSubOrder}
                  mt={8}>
                  <Text inherit color='#ADB5BD' style={{ fontWeight: 400 }}>
                    {Constants.projectName} allows organizations, groups and
                    communities to make decisions online by providing a modern,
                    secure, and effective e-voting technology.
                  </Text>
                </Title>
                {isExtraSmall && (
                  <Group grow position='center' mt={32}>
                    <ButtonsContainer />
                  </Group>
                )}
                {!isExtraSmall && (
                  <Link href='/ongoing' passHref>
                    <Button
                      component='a'
                      sx={(theme) => ({
                        '&:hover': { color: theme.colors.cyan[7] },
                      })}
                      color='cyan'
                      size='md'
                      variant='light'
                      mt={24}>
                      View ongoing elections
                    </Button>
                  </Link>
                )}
              </Box>
            </Group>
          </Stack>
        </Container>

        <Box style={{ backgroundColor: 'white' }}>
          <Container size='xl' py={48}>
            <Title order={2} align='center' mb={isExtraSmall ? 40 : 48}>
              Vote at any time from anywhere
              {!isExtraSmall && (
                <>
                  <br /> at your convenience
                </>
              )}
            </Title>
            <FlexContainer
              groupProps={{ style: { flexWrap: 'nowrap' }, grow: true }}>
              {AppFeatures.map((feature) => {
                const { description, Icon, title } = feature;
                return (
                  <Card key={title} className='text-center'>
                    <ThemeIcon
                      style={{ width: 64 }}
                      size={'xl'}
                      mx='auto'
                      sx={(theme) => ({
                        color: theme.colors.cyan[5],
                        backgroundColor: 'transparent',
                      })}>
                      {<Icon size={48} strokeWidth={2} />}
                    </ThemeIcon>
                    <Title style={{ fontWeight: 600 }} order={3} mt={8} mb={4}>
                      {title}
                    </Title>
                    <Text size={'md'}>{description}</Text>
                  </Card>
                );
              })}
            </FlexContainer>
          </Container>
        </Box>

        <Container size='xl' py={72} className='text-white'>
          <FlexContainer>
            <Box style={{ flexGrow: 1 }}>
              <Title order={1} mb={8}>
                Start building your first election
              </Title>
              <Title order={4} style={{ fontWeight: 400 }}>
                {Constants.projectName} is the a powerful online voting
                decentralized application.
                <br /> Don&apos;t believe us? See for yourself.
              </Title>
            </Box>
            <Link href='/signup' passHref>
              <Button
                component='a'
                sx={(theme) => ({
                  '&:hover': { color: theme.colors.cyan[7] },
                })}
                color='cyan'
                size='md'
                variant='light'
                mx={48}>
                Get Started
              </Button>
            </Link>
          </FlexContainer>
        </Container>
      </Footer>
    </BackgroundImage>
  );
};

export default Hero;

// Unused Text

// Make your decision-making process modern, secure, and effective.

// Cast your vote in just a few minutes, without the need to go to a
// certain place, at any time of the day and from any place, just
// with the need of an Internet connection.

// Voting made efficient and made available to all

// From anywhere on the planet with internet connection, be it with a
// mobile phone, a tablet or a computer, your voters will be able to
// exercise their right in a few clicks, without having to travel or
// spend excessive time.
