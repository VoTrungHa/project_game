import { Card, Statistic } from 'antd';
import { Col, Row } from 'components/Container';
import { Currency } from 'components/Currency';
import { formatter } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AccountSummary = () => {
  const { t } = useTranslation();

  const {
    account: { stat },
    broker: { currencyList }
  } = useAppSelector((state) => state);

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_ACCOUNT')} value={stat?.totalAccounts} />
          </Card>
        </Col>
        <Col xxl={6} xl={12} xs={24}>
          <Card>
            <Statistic
              prefix={
                currencyList.map((currency, key) =>
                  <Currency icon={currency.icon} key={key} amount={stat ? formatter.format(Number(stat.tokens?.[currency?.code])) : 0} />)
              }
              value=' '
              title={t('TOTAL_PLATFORM_MONEY')}
            />
          </Card>
        </Col>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title={`${t('MENU_PARTNER')}/ ${t('MENU_MOBILE_USER')}`}
              value={stat?.totalPartners}
              suffix={`/ ${stat ? formatter.format(stat.totalAccounts - stat.totalPartners) : 0}`}
            />
          </Card>
        </Col>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title={`${t('TOTAL_ACCOUNT_KYC_TEXT')}/ ${t('TOTAL_ACCOUNT_NON_KYC_TEXT')}`}
              value={stat?.totalKyc}
              suffix={`/ ${stat ? formatter.format(stat.totalAccounts - stat.totalKyc) : 0}`}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AccountSummary
