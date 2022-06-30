import { Anchor, Card, Center, Container, Stack, Text } from '@mantine/core';
import { ElectionStore } from 'context/ElectionStore';
import { FC, PropsWithChildren } from 'react';
import { Constants } from 'utils/constants';

interface VotingAuthLayoutProps {
  admin?: string;
}

export const VotingAuthLayout: FC<PropsWithChildren<VotingAuthLayoutProps>> = (
  props
) => {
  const { children, admin } = props;
  return (
    <ElectionStore>
      <Stack style={{ height: '100vh' }}>
        <Text
          align='center'
          className='hero-background'
          size='xl'
          weight={600}
          mt={16}
          style={{ fontSize: 32 }}>
          {Constants.projectName}
        </Text>
        <Center component={Container} style={{ flex: 1, marginTop: -32 }}>
          <Card
            style={{ maxWidth: 375, textAlign: 'center' }}
            withBorder
            shadow='md'
            px='xl'
            py={32}>
            {children}
            <Text mt={16} size='xs'>
              If you find any mistake in this election, <br />
              please contact the{' '}
              <Anchor size='xs' href={`mailto:${admin}`} color='cyan'>
                admin
              </Anchor>
              .
            </Text>
          </Card>
        </Center>
      </Stack>
    </ElectionStore>
  );
};
