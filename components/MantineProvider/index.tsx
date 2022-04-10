import { FC } from 'react';
import { MantineProvider as Provider, useMantineTheme } from '@mantine/core';

export const MantineProvider: FC = (props) => {
  const { children } = props;
  const theme = useMantineTheme();

  return (
    <Provider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        // primaryColor: theme.colors.cyan,
        colorScheme: 'light',
        defaultRadius: 'md',
      }}>
      {children}
    </Provider>
  );
};
