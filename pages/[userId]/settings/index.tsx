import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import { SideNavigation, withSettingsLayout } from 'layouts';
import { NextPageWithLayout } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Settings: NextPageWithLayout = () => {
  const {
    state: {
      currentUser: { name, id },
    },
  } = useGlobalStore();
  const { isExtraSmall, isSmall } = useMediaQuery();
  const { push } = useRouter();

  useEffect(() => {
    if (!isExtraSmall) {
      push({
        pathname: '/[userId]/settings/general',
        query: { userId: id },
      });
    }
  }, [isExtraSmall, push, id]);

  return (
    <>
      <Head>
        <title>{name} | Settings</title>
      </Head>

      <SideNavigation />
    </>
  );
};

Settings.getLayout = withSettingsLayout;

export default Settings;
