import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Popover, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import logoImage from 'assets/images/logo-bbc.png';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { PATH } from 'constants/paths';
import { logoutUser } from 'containers/Auth/duck/thunks';
import storage from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';

interface Props {
  onToggle: () => void;
  collapsed: boolean;
}

export default function Header(props: Props) {
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const { onToggle, collapsed } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const onLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const onGotoProfile = useCallback(() => history.push(PATH.PROFILE), [history]);

  const onChangeLanguage = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang);
      storage.setValueIntoKey('lang', lang);
    },
    [i18n],
  );

  return (
    <Layout.Header style={{ backgroundColor: '#fff', padding: '0 30px', marginLeft: collapsed ? '80px' : '300px' }}>
      <Row justify='space-between'>
        <Col>
          <Row align='middle'>
            <Col>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: onToggle,
                style: { fontSize: 20 },
              })}
            </Col>
            <Col>
              <div style={{ position: 'sticky', top: '0', zIndex: 2 }}>
                <Link to='/'>
                  <img className={classes.logo} src={logoImage} alt='logo' />
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={[10, 10]}>
            <Col>
              <Avatar size='large' icon={<UserOutlined />} />
            </Col>
            <Col>
              <Popover
                placement='bottomRight'
                getPopupContainer={(triggerNode: HTMLElement | null) => triggerNode?.parentNode as any}
                content={
                  <div>
                    <div className={classes.itemMenu} onClick={onGotoProfile}>
                      <UserOutlined />
                      <div className={classes.textMenu}>{t('COMMON_PROFILE')}</div>
                    </div>
                    <div style={{ color: 'red' }} className={classes.itemMenu} onClick={onLogout}>
                      <LogoutOutlined />
                      <div className={classes.textMenu}>{t('COMMON_LOGOUT')}</div>
                    </div>
                  </div>
                }
                trigger='click'>
                <Typography.Text strong style={{ cursor: 'pointer' }}>
                  {user?.fullName}
                </Typography.Text>
              </Popover>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
}
