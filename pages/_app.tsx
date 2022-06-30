import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MantineProvider } from 'components/MantineProvider';
import { GlobalStore } from 'context/GlobalStore';
import { NextApiRequest, NextPage, NextPageWithLayout } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import 'styles/globals.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

declare module 'iron-session' {
  interface IronSessionData {
    user: { id: number };
    voter: { id: number };
  }
}

declare module 'next' {
  type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
  type ExtendedNextApiRequest = NextApiRequest & {
    user: { id: number };
  };
}

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <GlobalStore>
        <MantineProvider>
          <ModalsProvider>
            <NotificationsProvider>
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </GlobalStore>
    </>
  );
}
