import { Card, Statistic } from 'antd';
import { Col, Row } from 'components/Container';
import { renderUnit } from 'containers/StatisticStacking/components/StatisticStackingTable';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../index.scss';

const StatisticSummary = () => {
  const { t } = useTranslation();
  const {
    luckySpinStatistic: { summary },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  const summaryData = [
    {
      label: t('SPECIAL_PRIZE'),
      value: summary?.totalPrizeSpecial,
    },
    {
      label: t('TOTAL_SAT_OF_ALL_PRIZES'),
      value: summary?.totalAllPrizes,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 50`,
      value: summary?.totalPrize50,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 100`,
      value: summary?.totalPrize100,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 200`,
      value: summary?.totalPrize200,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 300`,
      value: summary?.totalPrize300,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 400`,
      value: summary?.totalPrize400,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 500`,
      value: summary?.totalPrize500,
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 1000`,
      value: summary?.totalPrize1000,
    },
  ];

  return (
    <div>
      <Row gutter={[10, 10]}>
        {summaryData.map((prize, key) => (
          <Col xxl={6} xl={6} xs={24} key={key}>
            <Card style={{ height: '100%' }}>
              <Statistic title={prize?.label} prefix={renderUnit(currencyList, 'SAT', prize?.value)} value=' ' />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatisticSummary;
