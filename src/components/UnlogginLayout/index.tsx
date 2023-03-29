import { Image } from 'antd';
import logo from 'assets/images/logo_login.png';
import { Col, Row } from 'components/Container';
import { useStyles } from 'containers/Auth/styles';
import storage from 'helpers/localStorage';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const UnlogginLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const onChangeLanguage = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang);
      storage.setValueIntoKey('lang', lang);
    },
    [i18n],
  );

  return (
    <Row justify='center' fullHeight style={{ backgroundColor: '#091838' }}>
      {/* TODO: enable multilanguage later 
      <Select
        defaultValue={i18n.language}
        style={{ width: 120 }}
        className={classes.select}
        onChange={onChangeLanguage}>
        <Select.Option value='en'>English</Select.Option>
        <Select.Option value='vn'>Vietnamese</Select.Option>
      </Select> */}
      <Col md={12} xs={16} lg={8} textAlign='center'>
        <Image src={logo} preview={false} style={{ width: '50%', margin: '0 auto' }} />
        {children}
      </Col>
    </Row>
  );
};
