// /* eslint-disable react/display-name */
// import { Card, Row, Typography } from 'antd';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import EventReward from './main/EventReward';
// import Events from './main/Events';

// const Index: React.FC = () => {
//   const { t } = useTranslation();

//   const [tab, setTab] = useState('EVENTS');
//   const [isEvent, setIsEvent] = useState(true);
//   const onChangeTab = useCallback(
//     (activeTab) => {
//       if (activeTab === tab) return;
//       setTab(activeTab);
//     },
//     [tab],
//   );
//   useEffect(() => {
//     if (tab === 'REWARD') setIsEvent(true);
//   }, [tab]);

//   const onChangeIsEvent = (value: IRewardState) => {
//     setTab(value.tab);
//     setIsEvent(value.event);
//   };

//   return (
//     <>
//       <Row className='mb-32 mt-20'>
//         <Typography.Text className='headline-07'>{t('MENU_REWARD')}</Typography.Text>
//       </Row>

//       <Card className='mod-card'>
//         {/* <Tabs type='card' className='reward-title' activeKey={tab} onChange={onChangeTab}>
//         <Tabs.TabPane tab={t('TOTAL_LIST')} key='REWARD'>
//           <TotalReward />
//         </Tabs.TabPane> */}

//         {isEvent ? (
//           // <Tabs.TabPane tab={t('LIST_EVENT')} key='EVENTS'>
//           <Events onChangefiledSet={onChangeIsEvent} />
//         ) : (
//           // </Tabs.TabPane>
//           // <Tabs.TabPane tab={t('EVENT_REWARD')} key='EVENT_REWARD'>
//           <EventReward onChangefiledSet={onChangeIsEvent} />
//           // </Tabs.TabPane>
//         )}
//         {/* </Tabs> */}
//       </Card>
//     </>
//   );
// };

// export default Index;
