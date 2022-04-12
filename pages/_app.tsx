// import '../styles/globals.css'
// import type { AppProps } from 'next/app'

// function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }
// export default MyApp

import { AppProps } from 'next/app';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NotificationsProvider } from '@mantine/notifications';
import 'styles/globals.css';

import { GlobalStore } from 'context/GlobalStore';
import { MantineProvider } from 'components/MantineProvider';
import { NextPage, NextPageWithLayout } from 'next';
import { ReactElement, ReactNode } from 'react';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

declare module 'next' {
  type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
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
          <NotificationsProvider>
            {getLayout(<Component {...pageProps} />)}
          </NotificationsProvider>
        </MantineProvider>
      </GlobalStore>
    </>
  );
}
