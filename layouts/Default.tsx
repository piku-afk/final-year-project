import { Container } from '@mantine/core';
import { CustomContainer } from 'components/CustomizeMantine';
import { useMediaQuery } from 'hooks';
import {
  FC,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  const [headerRef, setHeaderRef] = useState<HTMLElement>();
  const [headerSize, setHeaderSize] = useState(84);
  const { isExtraSmall, isLarge, isMedium, isSmall } = useMediaQuery();

  const handleResize = useCallback(() => {
    if (headerRef) {
      setHeaderSize(headerRef.clientHeight);
    }
  }, [headerRef]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headerRef, handleResize]);

  return (
    <Header headerRef={headerRef} setHeaderRef={setHeaderRef}>
      <Footer>
        <CustomContainer py={32} style={{ minHeight: '80vh' }} mt={headerSize}>
          {children}
        </CustomContainer>
      </Footer>
    </Header>
  );
};
