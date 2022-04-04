import { FC } from 'react';
import { MantineProvider as Provider } from '@mantine/core';

export const MantineProvider: FC = (props) => {
  const { children } = props;
  return (
    <Provider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
        defaultRadius: 'md',
      }}>
      {children}
    </Provider>
  );
};
