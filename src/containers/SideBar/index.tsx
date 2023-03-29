import { ContactsOutlined, HeatMapOutlined, SolutionOutlined, YuqueOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import {
  icAssign,
  icCustomer,
  icDashboard,
  icLuckySpin,
  icPartner,
  icPartnerBrand,
  icReward,
  icSatoshiGame,
  icSetting,
  icTransaction,
  icUser,
} from 'assets/images';
import { Link } from 'components/Link';
import { PATH } from 'constants/paths';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SideBar = (props) => {
  const { t } = useTranslation();
  const location = useLocation();

  const defaultOpenKeys = useMemo(
    () => ([PATH.GLOBALCONFIG, PATH.ADDCONFIG].includes(location.pathname) ? ['systemconfig'] : []),
    [location.pathname],
  );

  const defaultSelectedKeys = useMemo(() => {
    const path = location.pathname.split('/')[1];
    if (path === 'mobile-user-detail') return [PATH.MOBILEUSER];
    if (path === 'partner-detail') return [PATH.PARTNER];
    return [location.pathname];
  }, [location.pathname]);

  const menu = [
    {
      path: PATH.DASHBOARD,
      name: t('MENU_DASHBOARD'),
      key: PATH.DASHBOARD,
      sub: false,
      icon: <Avatar shape='square' src={icDashboard} alt='ic-dashboard' style={{ width: '19px', height: '19px' }} />,
    },
    {
      path: PATH.USERS,
      name: t('MENU_USERS'),
      key: PATH.USERS,
      sub: false,
      icon: <Avatar shape='square' src={icUser} alt='ic-user' style={{ width: '24px', height: '24px' }} />,
    },
    {
      path: PATH.BROKER,
      name: t('MENU_BROKER'),
      key: PATH.BROKER,
      sub: false,
      icon: <Avatar shape='square' src={icCustomer} alt='ic-customer' style={{ width: '24px', height: '24px' }} />,
    },
    // TODO: Temporary comment kyc
    // {
    //   path: PATH.KYC,
    //   name: t('MENU_KYC'),
    //   key: PATH.KYC,
    //   sub: false,
    //   icon: <IdcardOutlined />,
    // },
    // TODO: Temporary hiding
    // {
    //   path: PATH.MOBILEUSER,
    //   name: t('MENU_MOBILE_USER'),
    //   key: PATH.MOBILEUSER,
    //   sub: false,
    //   icon: <MobileOutlined />,
    // },
    // {
    //   path: PATH.PARTNER,
    //   name: t('MENU_PARTNER'),
    //   key: PATH.PARTNER,
    //   sub: false,
    //   icon: <TeamOutlined />,
    // },
    {
      path: PATH.ACCOUNT,
      name: t('MENU_USER'),
      key: PATH.ACCOUNT,
      sub: false,
      icon: <Avatar shape='square' src={icPartner} alt='ic-partner' style={{ width: '24px', height: '24px' }} />,
    },
    // TODO: TODO: Temporary hiding
    // {
    //   path: PATH.FRIENDINVITATIONEVENT,
    //   name: t('MENU_FRIEND_INVITATION_EVENT'),
    //   key: PATH.FRIENDINVITATIONEVENT,
    //   sub: false,
    //   icon: <MailOutlined />,
    // },
    {
      path: PATH.RANK,
      name: t('RANK'),
      key: PATH.RANK,
      sub: false,
      icon: <HeatMapOutlined style={{ width: '26px', height: '26px' }} />,
    },
    // TODO: Temporary hiding
    // {
    //   path: '',
    //   name: t('MENU_BITPLAY'),
    //   key: 'MENU_BITPLAY',
    //   sub: true,
    //   icon: <RocketOutlined />,
    //   items: [
    //     {
    //       path: PATH.GAME,
    //       name: t('MENU_GAME'),
    //       key: PATH.GAME,
    //       sub: false,
    //     },
    //     {
    //       path: PATH.CHALLENGE,
    //       name: t('MENU_CHALLENGE'),
    //       key: PATH.CHALLENGE,
    //       sub: false,
    //     },
    //   ],
    // },
    {
      path: '',
      name: t('MENU_TRANSACTION_MANAGEMENT'),
      key: 'MENU_TRANSACTION_MANAGEMENT',
      sub: true,
      icon: (
        <Avatar
          shape='square'
          src={icTransaction}
          alt='ic-partner'
          style={{ width: '24px', height: '24px', marginRight: '5px' }}
        />
      ),
      items: [
        {
          path: PATH.DEPOSITSATOSHIDETAIL,
          name: t('MENU_DEPOSIT_SATOSHI_DETAIL'),
          key: PATH.DEPOSITSATOSHIDETAIL,
          sub: false,
        },
        {
          path: PATH.WITHDRAWALVNDC,
          name: t('MENU_SATOSHI_WITHDRAWAL_VNDC'),
          key: PATH.WITHDRAWALVNDC,
          sub: false,
        },
      ],
    },
    {
      path: '',
      name: t('MENU_MISSION'),
      key: 'MENU_MISSION',
      sub: true,
      icon: (
        <Avatar
          shape='square'
          src={icAssign}
          alt='ic-assign'
          style={{ width: '26px', height: '26px', marginRight: '18px' }}
        />
      ),
      items: [
        {
          path: PATH.ACCOUNTOPENINGCAMPAIGN,
          name: t('CAMPAIGN_TEXT'),
          key: PATH.ACCOUNTOPENINGCAMPAIGN,
          sub: false,
        },
      ],
    },
    {
      path: '',
      name: t('MENU_STACKING_BY_DAY'),
      key: 'MENU_STACKING_BY_DAY',
      sub: true,
      icon: <ContactsOutlined style={{ width: '26px', height: '26px' }} />,
      items: [
        {
          path: PATH.STATISTIC_STACKING,
          name: t('MENU_STATISTIC_STACKING'),
          key: PATH.STATISTIC_STACKING,
          sub: false,
        },
        {
          path: PATH.SETTING_STACKING,
          name: t('MENU_SETTING_STACKING'),
          key: PATH.SETTING_STACKING,
          sub: false,
        },
      ],
    },
    // TODO: Delete later
    // {
    //   path: PATH.STATISTIC,
    //   name: t('MENU_STATISTIC'),
    //   key: PATH.STATISTIC,
    //   sub: false,
    //   icon: <BarChartOutlined />,
    // },
    {
      path: PATH.REWARD,
      name: t('MENU_REWARD'),
      key: PATH.REWARD,
      sub: false,
      icon: <Avatar shape='square' src={icReward} alt='ic-reward' style={{ width: '26px', height: '26px' }} />,
    },
    // TODO: Uncomment later
    // {
    //   path: PATH.VNDCORDER,
    //   name: t('MENU_VNDC'),
    //   key: PATH.VNDCORDER,
    //   sub: false,
    //   icon: <DollarOutlined />,
    // },
    {
      path: PATH.CAMPAIGN,
      name: t('MENU_CAMPAIGN'),
      key: PATH.CAMPAIGN,
      sub: false,
      icon: (
        <Avatar shape='square' src={icPartnerBrand} alt='ic-partner-brand' style={{ width: '26px', height: '26px' }} />
      ),
    },
    {
      path: '',
      name: t('MENU_LUCKY_SPIN'),
      key: 'luckySpin',
      sub: true,
      icon: (
        <Avatar
          shape='square'
          src={icLuckySpin}
          alt='ic-lucky-spin'
          style={{ width: '24x', height: '24x', marginRight: '12px' }}
        />
      ),
      items: [
        {
          path: PATH.LUCKYSPIN,
          name: t('DAILY_TEXT'),
          key: PATH.LUCKYSPIN,
          sub: false,
        },
        {
          path: PATH.LUCKYSPINSTATISTIC,
          name: t('MENU_STATISTIC'),
          key: PATH.LUCKYSPINSTATISTIC,
          sub: false,
        },
      ],
    },
    {
      path: PATH.SATOSHIGAME,
      name: t('MENU_SATOSHI_GAME'),
      key: PATH.SATOSHIGAME,
      sub: false,
      icon: <Avatar shape='square' src={icSatoshiGame} alt='ic-satoshi-game' style={{ width: '24x', height: '24x' }} />,
    },
    {
      path: '',
      name: t('CHICKEN_FARM'),
      key: 'chickenfarm',
      sub: true,
      icon: <YuqueOutlined style={{ width: '26px', height: '26px' }} />,
      items: [
        {
          path: PATH.BITFARM,
          name: 'Dashboard',
          key: PATH.BITFARM,
          sub: false,
        },
        {
          path: PATH.ANNOUNCEMENTBITFARM,
          name: t('ANNOUNCEMENT_BITFARM'),
          key: PATH.ANNOUNCEMENTBITFARM,
          sub: false,
        },
        {
          path: PATH.SALESCHEDULE,
          name: t('SALE_SCHEDULE'),
          key: PATH.SALESCHEDULE,
          sub: false,
        },
        {
          path: PATH.PRIVATESALE,
          name: t('PRIVATE_SALE'),
          key: PATH.PRIVATESALE,
          sub: false,
        },
        {
          path: PATH.PLAYERLIST,
          name: t('MENU_PLAYER_LIST'),
          key: PATH.PLAYERLIST,
          sub: false,
        },
        {
          path: PATH.P2PTRANSACTION,
          name: t('P2P_TRANSACTION_STATISTICS'),
          key: PATH.P2PTRANSACTION,
          sub: false,
        },
      ],
    },
    {
      path: '',
      name: t('MENU_REPORT'),
      key: 'report',
      sub: true,
      icon: <SolutionOutlined style={{ width: '26px', height: '26px' }} />,
      items: [
        {
          path: PATH.REFERRAL,
          name: t('MENU_REFERRAL'),
          key: PATH.REFERRAL,
          sub: false,
        },
      ],
    },
    {
      path: PATH.SYSTEMCONFIG,
      name: t('SYSTEM_CONFIG_TEXT'),
      key: PATH.SYSTEMCONFIG,
      icon: (
        <Avatar
          shape='square'
          src={icSetting}
          alt='ic-setting'
          style={{ width: '24x', height: '24x', marginRight: '12px' }}
        />
      ),
      sub: false,
      items: [
        {
          path: PATH.GLOBALCONFIG,
          name: t('GLOBAL_CONFIG'),
          key: PATH.GLOBALCONFIG,
          sub: false,
        },
        {
          path: PATH.SENDNOTIFICATION,
          name: t('MENU_SEND_NOTIFICATION'),
          key: PATH.SENDNOTIFICATION,
          sub: false,
        },
        {
          path: PATH.BANNERCONFIG,
          name: t('BANNER_TEXT'),
          key: PATH.BANNERCONFIG,
          sub: false,
        },
        {
          path: PATH.HOMEADSCOMFIG,
          name: t('HOMEPAGE_BANNER'),
          key: PATH.HOMEADSCOMFIG,
          sub: false,
        },

        {
          path: PATH.SPINPRIZE,
          name: t('SPIN_TEXT'),
          key: PATH.SPINPRIZE,
          sub: false,
        },
      ],
    },
    // {
    //   path: '',
    //   name: t('SYSTEM_CONFIG_TEXT'),
    //   key: 'systemconfig',
    //   sub: true,
    //   icon: <ToolOutlined />,
    //   items: [
    //     {
    //       path: PATH.LISTTOKEN,
    //       name: t('LIST_TOKEN'),
    //       key: PATH.LISTTOKEN,
    //       sub: false,
    //     },
    //     ,
    //     {
    //       path: PATH.GLOBALCONFIG,
    //       name: t('GLOBAL_CONFIG'),
    //       key: PATH.GLOBALCONFIG,
    //       sub: false,
    //     },
    //     {
    //       path: PATH.SENDNOTIFICATION,
    //       name: t('MENU_SEND_NOTIFICATION'),
    //       key: PATH.SENDNOTIFICATION,
    //       sub: false,
    //     },
    //     {
    //       path: PATH.BANNERCONFIG,
    //       name: t('BANNER_TEXT'),
    //       key: PATH.BANNERCONFIG,
    //       sub: false,
    //     },
    //     {
    //       path: PATH.HOMEADSCOMFIG,
    //       name: t('HOMEPAGE_BANNER'),
    //       key: PATH.HOMEADSCOMFIG,
    //       sub: false,
    //     },

    //     {
    //       path: PATH.SPINPRIZE,
    //       name: t('SPIN_TEXT'),
    //       key: PATH.SPINPRIZE,
    //       sub: false,
    //     },
    //   ],
    // },
  ];

  const renderMenu = useCallback((menus, icon = true) => {
    return (
      <>
        {menus.map((el) => {
          return !el.sub ? (
            <Menu.Item key={el.key} icon={icon && el.icon}>
              {el.subIcon && <Avatar shape='square' src={el.subIcon} alt={el.subIcon} />}
              <Link to={el.path}>{el.name}</Link>
            </Menu.Item>
          ) : (
            <Menu.SubMenu key={el.key} icon={icon && el.icon} title={el.name}>
              {renderMenu(el.items, false)}
            </Menu.SubMenu>
          );
        })}
      </>
    );
  }, []);

  return (
    <Sider
      width={300}
      trigger={null}
      collapsible
      className='box-shadow-layer1'
      collapsed={props.collapsed}
      style={{ height: '100vh', overflowY: 'scroll', position: 'fixed' }}>
      <Menu
        style={{ width: 'auto' }}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={defaultSelectedKeys}
        mode='inline'
        theme='light'
        inlineCollapsed={props.collapsed}>
        {renderMenu(menu)}
      </Menu>
    </Sider>
  );
};

export default SideBar;
