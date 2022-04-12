import { Card, Center, Divider, Grid, Text, Title } from '@mantine/core';
import { General, Security } from 'components/ProfileSettings';
import { useUser } from 'hooks/fetchers';
import { SideNavigation, withDefaultLayout, withSettingsLayout } from 'layouts';
import { NextPageWithLayout } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useState } from 'react';
import useSWR from 'swr';
import ProfileSvg from 'public/images/profile_data_re_v81r.svg';
import SecuritySvg from 'public/images/my_password_re_ydq7.svg';
import { useMediaQuery } from 'hooks';

const Settings: NextPageWithLayout = () => {
  const { data } = useSWR('/api/auth/user', useUser);
  const { name } = data || {};
  const { query } = useRouter();
  const [image, setImage] = useState(ProfileSvg);
  const { isExtraSmall, isSmall } = useMediaQuery();
  const { tab } = query as { tab: string };

  const renderComponent = useCallback(() => {
    if (!tab) return <General />;

    switch (tab.toLocaleLowerCase()) {
      default:
      case 'general':
        return <General />;
      case 'security':
        return <Security />;
    }
  }, [tab]);

  if (isExtraSmall && !tab) {
    return <SideNavigation />;
  }

  const isSecurity = tab?.toLowerCase() === 'security';

  return (
    <>
      <Head>
        <title>{name} | Settings</title>
      </Head>
      <Grid align='stretch'>
        <Grid.Col lg={5} sm={6}>
          <Card style={{ width: isSmall ? '100%' : 'fit-content' }}>
            {renderComponent()}
          </Card>
        </Grid.Col>
        {!isSmall && (
          <Grid.Col lg={7} sm={6}>
            <Center className='h-100'>
              <Image
                src={isSecurity ? SecuritySvg.src : ProfileSvg.src}
                width={isSecurity ? 280 : 400}
                height={isSecurity ? 280 : 400}
                alt=''
              />
            </Center>
          </Grid.Col>
        )}
      </Grid>
    </>
  );
};

Settings.getLayout = (page: ReactElement) =>
  withDefaultLayout(withSettingsLayout(page));

export default Settings;
