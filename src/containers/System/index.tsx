import { Card, Tabs } from 'antd';
import BannerEvent from 'containers/BannerConfig';
import CommissionPage from 'containers/GlobalConfig';
import PopupEvent from 'containers/HomeAdsConfig';
import ListToken from 'containers/ListToken';
import SendNotificationPage from 'containers/SendNotification';
import SpinDaily from 'containers/SpinPrize';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Tabs type='card'>
        <Tabs.TabPane tab='Tokens' key='TOKEN'>
          <ListToken />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('REFERRAL_COMISSION')} key='REFERRAL_COMISSION'>
          <CommissionPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('MENU_SEND_NOTIFICATION')} key='NOTIFICATION'>
          <SendNotificationPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('BANNER_TEXT')} key='BANNER'>
          <BannerEvent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('HOMEPAGE_BANNER')} key='POPUP'>
          <PopupEvent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('DAILY_SPIN_TEXT')} key='SPIN'>
          <SpinDaily />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
