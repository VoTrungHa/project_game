import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import bbc from 'assets/images/logo-bbc.png';
import sat from 'assets/images/sat.png';
import vndc from 'assets/images/vndc.png';
import { CardToken } from 'components/CardToken';
import { Col, Row } from 'components/Container';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Row justify='space-between'>
        <Col span={12}>
          <Typography.Title level={5}>{t('LIST_TOKEN')}</Typography.Title>
        </Col>
        <Col span={12} textAlign='right'>
          <Button type='primary'>
            <PlusSquareOutlined />
            {t('ADD_TOKEN')}
          </Button>
        </Col>
      </Row>
      <br />
      <Row gutter={[10, 10]}>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='1' title='BBC - Bitback Community' src={bbc} />
        </Col>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='2' title='SAT - Satoshi' src={sat} />
        </Col>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='3' title='VNDC' src={vndc} />
        </Col>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='1' title='BBC - Bitback Community' src={bbc} />
        </Col>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='2' title='SAT - Satoshi' src={sat} />
        </Col>
        <Col xxl={12} xl={12} md={12} xs={24}>
          <CardToken id='3' title='VNDC' src={vndc} />
        </Col>
      </Row>
      <Row justify='end'>
        <Col>
          <Button type='primary'>{t('UPDATE')}</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Index;
