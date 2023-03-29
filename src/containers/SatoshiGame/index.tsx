/* eslint-disable react/display-name */
import { Card, Tabs } from 'antd';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Game from './main/Game';
import Statistic from './main/Statistic';

const Index: React.FC = () => {
  const { t } = useTranslation();

  const [tab, setTab] = useState('GAME');

  const onChangeTab = useCallback(
    (activeTab) => {
      if (activeTab === tab) return;
      setTab(activeTab);
    },
    [tab],
  );

  return (
    <Card>
      <Tabs type='card' activeKey={tab} onChange={onChangeTab}>
        <Tabs.TabPane tab={t('GAME_TEXT')} key='GAME'>
          <Game />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('MENU_STATISTIC')} key='STATISTIC_GAME'>
          <Statistic />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
