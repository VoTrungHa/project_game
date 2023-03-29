import { Card, Row, Statistic } from 'antd';
import { Col } from 'components/Container';
import { Currency } from 'components/Currency';
import { formatter } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Summary: React.FC = () => {
  const { t } = useTranslation();

  const {
    satoshiGame: { list },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  return (
    <Row gutter={[10, 10]}>
      <Col xxl={8} xl={12} xs={24}>
        <Card style={{ height: '100%' }}>
          <Statistic
            value={list?.totalRecords ? formatter.format(Number(list.totalRecords)) : 0}
            title={t('TOTAL_TRANSACTION_TEXT')}
          />
        </Card>
      </Col>
      <Col xxl={8} xl={12} xs={24}>
        <Card style={{ height: '100%' }}>
          <Statistic
            value={list?.totalAccounts ? formatter.format(Number(list.totalAccounts)) : 0}
            title={t('TOTAL_ACCOUNTS_PARTICIPATING')}
          />
        </Card>
      </Col>
      <Col xxl={8} xl={12} xs={24}>
        <Card style={{ height: '100%' }}>
          <Statistic
            title={t('SUM_OF_SAT')}
            prefix={[...currencyList.filter((item) => ['SAT'].includes(item.code))].map((currency, key) => (
              <Currency
                icon={currency.icon}
                key={key}
                amount={list?.totalSAT ? formatter.format(Number(list.totalSAT)) : 0}
              />
            ))}
            value=' '
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Summary;
