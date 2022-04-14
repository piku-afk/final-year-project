import { useResizeObserver } from '@mantine/hooks';
import { CustomContainer } from 'components/CustomizeMantine';
import { FC, ReactElement, RefObject } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

interface DefaultLayout {
  headerRef?: RefObject<HTMLDivElement>;
}

export const withDefaultLayout = (page: ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
);

const DefaultLayout: FC<DefaultLayout> = (props) => {
  const { children } = props;
  const [headerRef, rect] = useResizeObserver();

  return (
    <Header headerRef={headerRef}>
      <Footer>
        <CustomContainer
          py={32}
          style={{ minHeight: '80vh' }}
          mt={rect.bottom + rect.top}>
          {children}
        </CustomContainer>
      </Footer>
    </Header>
  );
};
