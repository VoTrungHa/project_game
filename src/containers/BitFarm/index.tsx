/* eslint-disable react/display-name */
import { Pie } from '@antv/g2plot';
import { Card, Empty, Select, Statistic, Typography } from 'antd';
import { Col, Row } from 'components/Container';
import { TIME_SELECT } from 'constants/index';
import { parseGetUnixTime, parseUnixTimeSubtractCountDays } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getAdultStats, getChickenFarmStats } from './duck/thunks';

const { TODAY, YESTERDAY, THIS_WEEK, THIS_MONTH } = TIME_SELECT;

const Index: React.FC = () => {
  const chartAdultStatsRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    bitFarm: { chickenFarmStat, chickenAdultStat },
  } = useAppSelector((state) => state);

  const dataAdultStatsChart = useMemo(
    () => [
      { type: 'MARS', value: chickenAdultStat.data?.totalChickenType1 },
      { type: 'JUPITER', value: chickenAdultStat.data?.totalChickenType2 },
      { type: 'VENUS', value: chickenAdultStat.data?.totalChickenType3 },
      { type: 'MERCURY', value: chickenAdultStat.data?.totalChickenType4 },
      { type: 'SATURN', value: chickenAdultStat.data?.totalChickenType5 },
    ],
    [chickenAdultStat],
  );

  useDidMount(() => {
    dispatch(getChickenFarmStats({ from: parseGetUnixTime(), to: parseGetUnixTime() }));
    dispatch(getAdultStats());
  });

  useEffect(() => {
    const ele = chartAdultStatsRef.current;
    if (!ele) return;
    const piePlot = new Pie(ele, {
      appendPadding: 10,
      data: dataAdultStatsChart,
      angleField: 'value',
      colorField: 'type',
      radius: 0.7,
      legend: {
        itemValue: {
          formatter: (text) => {
            const item = dataAdultStatsChart.find((i) => i.type === text);
            return item ? `(${item.value})` : '';
          },
        },
      },
      tooltip: {
        formatter: (datum) => {
          return { name: datum.type, value: datum.value };
        },
      },
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    });

    piePlot.render();

    return () => {
      piePlot.destroy();
    };
  }, [dataAdultStatsChart, t]);

  const onChangeTimeSelect = useCallback(
    (value: number) => {
      const params: { from?: number; to?: number } = {
        from: undefined,
        to: undefined,
      };
      if (value === TODAY) {
        params.from = parseGetUnixTime();
        params.to = parseGetUnixTime();
      }
      if (value === YESTERDAY) {
        params.from = parseUnixTimeSubtractCountDays(1);
        params.to = parseGetUnixTime();
      }
      if (value === THIS_WEEK) {
        params.from = parseUnixTimeSubtractCountDays(7);
        params.to = parseGetUnixTime();
      }
      if (value === THIS_MONTH) {
        params.from = parseUnixTimeSubtractCountDays(30);
        params.to = parseGetUnixTime();
      }
      dispatch(getChickenFarmStats(params));
    },
    [dispatch],
  );

  return (
    <section>
      <Row gutter={[10, 10]}>
        <Col xs={24} md={10}>
          <Card>
            <Row>
              <Col span={12}>
                <Statistic
                  title={t('TOTAL_NUMBER_EGG_SOLE')}
                  value={chickenFarmStat.data ? chickenFarmStat.data.totalEggSold || 0 : undefined}
                />
                <Statistic
                  suffix='đ'
                  title={t('TOTAL_AMOUNT_COLLECTED')}
                  value={chickenFarmStat.data ? chickenFarmStat.data.totalPaidAmount || 0 : undefined}
                />
                <Statistic title={t('TOTAL_HATCHING_EGG')} value={chickenAdultStat.data?.totalHatchingEgg} />
              </Col>
              <Col span={12} textAlign='right'>
                <Select onChange={onChangeTimeSelect} defaultValue={TODAY}>
                  <Select.Option value={TODAY}>{t('TODAY_TEXT')}</Select.Option>
                  <Select.Option value={YESTERDAY}>{t('YESTERDAY_TEXT')}</Select.Option>
                  <Select.Option value={THIS_WEEK}>{t('THIS_WEEK_TEXT')}</Select.Option>
                  <Select.Option value={THIS_MONTH}>{t('THIS_MONTH_TEXT')}</Select.Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <Card>
            {chickenAdultStat.data ? (
              <>
                <div ref={chartAdultStatsRef} />
                <Typography.Title level={5} style={{ textAlign: 'center' }}>
                  {t('NUMBER_OF_CHICKEN_EACH_TYPE')}
                </Typography.Title>
              </>
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Index;
