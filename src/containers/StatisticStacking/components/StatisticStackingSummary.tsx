import { Card, Row, Statistic } from 'antd';
import { Col } from 'components/Container';
import { Currency } from 'components/Currency';
import { formatter } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface StatisticStackingSummaryProps {}

const StatisticStackingSummary: React.FC<StatisticStackingSummaryProps> = () => {
  const { t } = useTranslation();

  const {
    statisticStacking: { stat },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic value={stat?.totalAccounts || 0} title={t('TOTAL_AMOUNT_RECEIVING')} />
          </Card>
        </Col>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title={t('AVEGARE_INTERST_AMOUNT')}
              prefix={[...currencyList.filter((item) => ['SAT', 'VNDC'].includes(item.code))].map((currency, key) => (
                <Currency
                  icon={currency.icon}
                  key={key}
                  amount={
                    stat?.averageInterestAmount
                      ? formatter.format(Number(stat.averageInterestAmount?.[currency?.code] || 0))
                      : 0
                  }
                />
              ))}
              value=' '
            />
          </Card>
        </Col>
        <Col xxl={6} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title={t('TOTAL_AMOUNT_SAT_VNDC')}
              prefix={[...currencyList.filter((item) => ['SAT', 'VNDC'].includes(item.code))].map((currency, key) => (
                <Currency
                  icon={currency.icon}
                  key={key}
                  amount={
                    stat?.totalInterestAmount ? formatter.format(Number(stat.totalInterestAmount?.[currency?.code])) : 0
                  }
                />
              ))}
              value=' '
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatisticStackingSummary;
