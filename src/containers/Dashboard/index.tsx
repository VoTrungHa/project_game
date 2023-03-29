/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import { Column, Line, Pie } from '@antv/g2plot';
import { Card, DatePicker, Divider, Empty, Image, Select, Spin, Statistic, Table, Tabs, Typography } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import calendar from 'assets/images/calendar.png';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { STATUS_CASHBACK, TIME_SELECT, TIME_UNIT_BUY_SATOSHI, TIME_UNIT_VNDC, TYPE_TIME } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatDateNowMoment,
  formatMoment,
  formatMonth,
  formatSubtractCountDays,
  formatter,
  FORMAT_MOMENT,
  getQuarterRange,
  Moment,
  momentNow,
  parseGetUnixTimeValue,
  parseIsBefore,
  parseLastMonth,
  parseRanges,
  parseRangesThisMonth,
  parseUnixTimeToEndOfMonth,
  parseUnixTimeToStartOfMonth,
  parseUnixTimeValueToEndOfYear,
  parseUnixTimeValueToStartOfYear,
  parseUTCUnixTimeToEndOfDay,
  parseUTCUnixTimeToStartOfDay,
  parseUTCUnixTimeValue,
  standardizeMoment,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAccountKyc,
  getAccountNonKyc,
  getBuySatoshi,
  getBuySatoshiTotal,
  getCashbackAvailablePeriod,
  getCashbackSummary,
  getDashboardAccount,
  getDashboardAccountTotal,
  getDashboardCashback,
  getDashboardCashbackTotal,
  getTotalAccountHavePhone,
  getTotalAccountVNDC,
  getTotalReferralAmountKyc,
  getTotalReferralAmountNonKyc,
  getWithdrawSatoshi,
} from './duck/thunks';
import './index.scss';

const { PROCESSING, SUCCESS, FAILURE, REJECTED, APPROVED } = STATUS_CASHBACK;
const { YYYY_MM_DD_SLASH, DATE_SLASH_LONG, DATE_TIME_SLASH_LONG, TIME_SHORT, HH_MM_DD_MM_YY } = FORMAT_MOMENT;
const { TODAY, YESTERDAY } = TIME_SELECT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const chartAccountRef = useRef<HTMLDivElement | null>(null);
  const chartCashbackRef = useRef<HTMLDivElement | null>(null);
  const pieChartKycRef = useRef<HTMLDivElement | null>(null);
  const lineChartBuySatoshiRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const {
    dashboard: {
      accounts,
      totalCashback,
      cashback,
      accountKyc,
      accountNonKyc,
      totalAmountReferralKyc,
      totalAmountReferralNonKyc,
      totalAccountVNDC,
      totalAccountHavePhone,
      cashbackSummary,
      buySatoshiTotal,
      buySatoshi,
      withdrawSatoshi,
      cashbackAvailablePeriod,
    },
    systemconfig: { rate },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  const [dashboardAccoutRequest, setDashboardAccountReqest] = useState({
    type: TYPE_TIME.DAY,
    from: parseGetUnixTimeValue(getQuarterRange(3, '2021')[0]),
    to: parseGetUnixTimeValue(getQuarterRange(3, '2021')[1]),
    year: standardizeMoment(),
  });
  const [cashbackState, setCashback] = useState<ICashbackDashboardParam>({
    status: PROCESSING,
    dateFrom: formatDateNowMoment(YYYY_MM_DD_SLASH),
    dateTo: formatDateNowMoment(YYYY_MM_DD_SLASH),
  });
  const [token, setToken] = useState(currencyList.length > 0 ? currencyList[0].code : undefined);

  const [fitlerBalanceRequest, setFitlerBalanceReqest] = useState({
    currency: token,
    from: parseUTCUnixTimeToStartOfDay(),
    to: parseUTCUnixTimeToEndOfDay(),
  });

  useDidMount(() => {
    dispatch(getDashboardAccountTotal());
    dispatch(getDashboardCashbackTotal());
    dispatch(getAccountKyc());
    dispatch(getAccountNonKyc());
    dispatch(getTotalReferralAmountKyc());
    dispatch(getTotalReferralAmountNonKyc());
    dispatch(getTotalAccountVNDC(TIME_UNIT_VNDC.TODAY));
    dispatch(getTotalAccountHavePhone());
    dispatch(getCashbackSummary());
    dispatch(getBuySatoshiTotal(TIME_UNIT_BUY_SATOSHI.ALL));
    dispatch(
      getBuySatoshi({
        from: parseUnixTimeToStartOfMonth(),
        to: parseUnixTimeToEndOfMonth(),
        type: 1,
      }),
    );
    dispatch(
      getWithdrawSatoshi({
        from: parseUnixTimeToStartOfMonth(),
        to: parseUnixTimeToEndOfMonth(),
        type: 2,
      }),
    );
  });

  useEffect(() => {
    if (dashboardAccoutRequest.type === TYPE_TIME.DAY) {
      dispatch(
        getDashboardAccount({
          type: dashboardAccoutRequest.type,
          from: dashboardAccoutRequest.from,
          to: dashboardAccoutRequest.to,
        }),
      );
    }
    if (dashboardAccoutRequest.type === TYPE_TIME.MONTH) {
      const year = dashboardAccoutRequest.year.year();
      dispatch(
        getDashboardAccount({
          type: dashboardAccoutRequest.type,
          from: parseUnixTimeValueToStartOfYear(year),
          to: parseUnixTimeValueToEndOfYear(year),
        }),
      );
    }
  }, [dashboardAccoutRequest, dispatch]);

  useEffect(() => {
    if (!token) return;
    dispatch(
      getCashbackAvailablePeriod({
        currency: fitlerBalanceRequest.currency,
        from: fitlerBalanceRequest.from,
        to: fitlerBalanceRequest.to,
      }),
    );
  }, [fitlerBalanceRequest, dispatch, token]);

  useEffect(() => {
    dispatch(getDashboardCashback(cashbackState));
  }, [cashbackState, dispatch]);

  const buyAndWithdrawSatoshi = useMemo(() => {
    if (!buySatoshi || !withdrawSatoshi) return [];
    const buy = [...buySatoshi.data];
    const withdraw = [...withdrawSatoshi.data];
    const rs: Array<IBuyAndWithdrawItem> = [];
    while (buy.length > 0 && withdraw.length > 0) {
      if (parseIsBefore(buy[0].day, withdraw[0].day)) {
        rs.push({ ...buy[0], category: t('BUY_TEXT') });
        buy.shift();
      } else {
        rs.push({ ...withdraw[0], category: t('WITHDRAW_TEXT') });
        withdraw.shift();
      }
    }
    if (buy.length > 0) {
      buy.forEach((item) => rs.push({ ...item, category: t('BUY_TEXT') }));
    } else {
      withdraw.forEach((item) => rs.push({ ...item, category: t('WITHDRAW_TEXT') }));
    }
    return rs;
  }, [buySatoshi, withdrawSatoshi, t]);

  const totalTransactionValue = useMemo(() => {
    if (!totalCashback || !totalCashback.data) return 0;
    if (!rate) return totalCashback.data.sum.amount;
    return totalCashback.data.sum.amount * Number(rate.SATVNDC.bid);
  }, [rate, totalCashback]);

  const dataAccount = useMemo(() => {
    if (!accounts || accounts.data.length === 0) return [];
    if (dashboardAccoutRequest.type === TYPE_TIME.MONTH) {
      return accounts.data.map((item) => ({
        time: formatMonth(item.date),
        value: item.count,
      }));
    }

    if (dashboardAccoutRequest.type === TYPE_TIME.DAY) {
      return accounts.data.map((item) => ({
        time: formatMoment(item.date, DATE_SLASH_LONG),
        value: item.count,
      }));
    }
    return [];
  }, [dashboardAccoutRequest, accounts]);

  const dataCashback = useMemo(() => {
    return cashback.data.map((item) => ({
      time: formatMoment(item.createdAt, DATE_TIME_SLASH_LONG),
      value: item.amount,
      status: STATUS_CASHBACK[item.status],
    }));
  }, [cashback]);

  const kycPie = useMemo(
    () => [
      { type: t('TOTAL_ACCOUNT_KYC_TEXT'), value: accountKyc.data || 0 },
      { type: t('TOTAL_ACCOUNT_NON_KYC_TEXT'), value: accountNonKyc.data || 0 },
    ],
    [accountKyc, accountNonKyc, t],
  );

  const onChangeAccountSelect = useCallback(
    (value: number) => setDashboardAccountReqest((prev) => ({ ...prev, type: value })),
    [],
  );
  const onChangeStatusSelect = useCallback(
    (value: number) =>
      setCashback((prev) => ({
        ...prev,
        status: value,
      })),
    [],
  );

  const onChangeTimeSelect = useCallback((value: number) => {
    if (value === TIME_SELECT.TODAY) {
      setCashback((prev) => ({
        ...prev,
        dateFrom: formatDateNowMoment(YYYY_MM_DD_SLASH),
        dateTo: formatDateNowMoment(YYYY_MM_DD_SLASH),
      }));
    }
    if (value === TIME_SELECT.YESTERDAY) {
      setCashback((prev) => ({
        ...prev,
        dateFrom: formatSubtractCountDays(1, YYYY_MM_DD_SLASH),
        dateTo: formatDateNowMoment(YYYY_MM_DD_SLASH),
      }));
    }
    if (value === TIME_SELECT.THIS_WEEK) {
      setCashback((prev) => ({
        ...prev,
        dateFrom: formatSubtractCountDays(7, YYYY_MM_DD_SLASH),
        dateTo: formatDateNowMoment(YYYY_MM_DD_SLASH),
      }));
    }
    if (value === TIME_SELECT.THIS_MONTH) {
      setCashback((prev) => ({
        ...prev,
        dateFrom: formatSubtractCountDays(30, YYYY_MM_DD_SLASH),
        dateTo: formatDateNowMoment(YYYY_MM_DD_SLASH),
      }));
    }
  }, []);

  const onSelectBuySatoshiTotal = useCallback((value: number) => dispatch(getBuySatoshiTotal(value)), [dispatch]);

  const onChangeTab = useCallback(
    (tab: string) => {
      dispatch(getTotalAccountVNDC(TIME_UNIT_VNDC[tab]));
    },
    [dispatch],
  );

  const columns = [
    {
      title: t('RECEIVER_TEXT'),
      dataIndex: 'receiver',
      key: 'receiver',
      render: (receiver) => `${receiver ? receiver.fullName : '--'}`,
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      render: (value: string) => `${value} Sat`,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatMoment(time, DATE_TIME_SLASH_LONG),
    },
  ];

  const onChangeDatePickerAccountChartByDay = useCallback((value: RangeValue<Moment>) => {
    if (!value) return;
    setDashboardAccountReqest((prev) => ({
      ...prev,
      from: parseGetUnixTimeValue(value[0]),
      to: parseGetUnixTimeValue(value[1]),
    }));
  }, []);

  const onChangeDatePickerAccountChartByYear = useCallback((year: Moment | null) => {
    if (!year) return;
    setDashboardAccountReqest((prev) => ({
      ...prev,
      year,
    }));
  }, []);

  const onChangeDatePickerFilterBalanceByFrom = useCallback((value: Moment | null) => {
    if (!value) return;
    setFitlerBalanceReqest((prev) => ({
      ...prev,
      from: parseUTCUnixTimeValue(value),
    }));
  }, []);

  const onChangeDatePickerFilterBalanceByTo = useCallback((value: Moment | null) => {
    if (!value) return;
    setFitlerBalanceReqest((prev) => ({
      ...prev,
      to: parseUTCUnixTimeValue(value),
    }));
  }, []);

  const onChangeFilterBalanceSelect = useCallback(
    (value: string) => setFitlerBalanceReqest((prev) => ({ ...prev, currency: value })),
    [],
  );

  const onChangeDatePicker = useCallback(
    (value: RangeValue<Moment>) => {
      if (!value) return;
      dispatch(
        getBuySatoshi({
          from: parseGetUnixTimeValue(value[0]),
          to: parseGetUnixTimeValue(value[1]),
          type: 1,
        }),
      );
      dispatch(
        getWithdrawSatoshi({
          from: parseGetUnixTimeValue(value[0]),
          to: parseGetUnixTimeValue(value[1]),
          type: 2,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const ele = pieChartKycRef.current;
    if (!ele) return;
    const piePlot = new Pie(ele, {
      appendPadding: 10,
      data: kycPie,
      angleField: 'value',
      autoFit: true,
      colorField: 'type',
      radius: 1,
      innerRadius: 0.75,
      legend: {
        position: 'top-right',
        layout: 'vertical',
        itemValue: {
          formatter: (text) => {
            const item = kycPie.find((i) => i.type === text);
            return item ? `(${formatter.format(item.value)})` : '';
          },
        },
      },
      meta: {
        value: {
          formatter: (v) => `${formatter.format(v)}`,
        },
      },
      label: {
        type: 'inner',
        offset: '-50%',
        autoRotate: false,
        style: { textAlign: 'center' },
        formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      },
      statistic: {
        title: {
          content: t('TOTAL_ACCOUNT'),
          style: {
            fontWeight: '400',
            fontSize: '20px',
            lineHeight: 1.5,
          },
        },
        content: {},
      },
      interactions: [
        { type: 'element-selected' },
        { type: 'element-active' },
        {
          type: 'pie-statistic-active',
          cfg: {
            start: [
              { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
              { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
            ],
            end: [
              { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
              { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
            ],
          },
        },
      ],
    });
    piePlot.render();

    return () => {
      piePlot.destroy();
    };
  }, [kycPie, t]);

  useEffect(() => {
    const ele = chartCashbackRef.current;
    if (dataCashback.length === 0 || !ele) return undefined;
    const line = new Line(ele, {
      data: dataCashback,
      xField: 'time',
      yField: 'value',
      seriesField: 'status',
      slider: {},
    });

    line.render();
    return () => {
      line.destroy();
    };
  }, [dataCashback]);

  useEffect(() => {
    const ele = lineChartBuySatoshiRef.current;
    // TODO: uncomment later
    // if (buySatoshi.data.length === 0 || !ele) return undefined;

    if (!ele) return undefined;
    const line = new Line(ele, {
      data: buyAndWithdrawSatoshi,
      xField: 'day',
      yField: 'amount',
      seriesField: 'category',
      color: ['#1979C9', '#D62A0D'],
      slider: {},
      tooltip: {
        formatter: (datum) => {
          return { name: datum.category, value: `${formatter.format(datum.amount)}` };
        },
        domStyles: {
          'g2-tooltip': {
            textAlign: 'left',
          },
        },
      },
    });

    line.render();
    return () => {
      line.destroy();
    };
  }, [buySatoshi, buyAndWithdrawSatoshi, t]);

  useEffect(() => {
    const ele = chartAccountRef.current;
    if (!accounts || !ele) return undefined;

    if (dashboardAccoutRequest.type === TYPE_TIME.MONTH) {
      const chart = new Column(ele, {
        data: dataAccount,
        xField: 'time',
        yField: 'value',
        xAxis: {
          label: {
            autoRotate: false,
            formatter: (value) => `${t('MONTH_TEXT')} ${Number(value)}`,
          },
        },
        tooltip: {
          formatter: (datum) => {
            return { name: `${t('REGISTER_ACCOUNT_TEXT')}`, value: `${datum.value}` };
          },
          title: (title) => `${t('MONTH_TEXT')} ${Number(title)}`,
        },
      });

      chart.render();
      return () => {
        chart.destroy();
      };
    }

    if (dashboardAccoutRequest.type === TYPE_TIME.DAY) {
      const chart = new Column(ele, {
        data: dataAccount,
        xField: 'time',
        yField: 'value',
        xAxis: {},
        tooltip: {
          formatter: (datum) => {
            return { name: `${t('REGISTER_ACCOUNT_TEXT')}`, value: `${datum.value}` };
          },
        },
        slider: {
          start: 0,
          end: 1,
        },
      });

      chart.render();
      return () => {
        chart.destroy();
      };
    }
  }, [dashboardAccoutRequest, accounts, t, dataAccount]);

  return (
    <section>
      <Row gutter={[10, 10]}>
        <Col xl={6} lg={12} xs={24} md={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic suffix='đ' title={t('TOTAL_REFERRAL_AMOUNT_KYC_TEXT')} value={totalAmountReferralKyc.data} />
          </Card>
        </Col>
        <Col xl={6} lg={12} xs={24} md={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              suffix='đ'
              title={t('TOTAL_REFERRAL_AMOUNT_NON_KYC_TEXT')}
              value={totalAmountReferralNonKyc.data}
            />
          </Card>
        </Col>
        <Col xl={6} lg={12} xs={24} md={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic title={t('TOTAL_TRANSACTION_TEXT')} value={totalCashback.data?.sum.value} />
          </Card>
        </Col>
        <Col xl={6} lg={12} xs={24} md={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title={t('TOTAL_TRANSACTION_VALUE_TEXT')}
              value={totalTransactionValue ? totalTransactionValue?.toFixed() : 0}
              suffix={rate ? 'đ' : 'Sat'}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col lg={12} md={12}>
          <Card style={{ height: '237px' }}>
            <Row>
              <Col span={24}>
                <Select
                  style={{ width: 171 }}
                  onChange={(token) => {
                    setToken(token as string);
                    onChangeFilterBalanceSelect(token);
                  }}
                  defaultValue={token}>
                  {currencyList.map((token) => (
                    <Select.Option key={token.code} value={token.code}>
                      {token.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row style={{ margin: '24px 0' }}>
              <Col span={12}>
                <DatePicker
                  showNow={false}
                  showTime={{ format: TIME_SHORT }}
                  format={HH_MM_DD_MM_YY}
                  locale={i18n.language === 'vn' ? vn : undefined}
                  onChange={onChangeDatePickerFilterBalanceByFrom}
                  defaultValue={momentNow()}
                  suffixIcon={<Image src={calendar} alt='calendar' />}
                />
              </Col>
              <Col span={12}>
                <DatePicker
                  showNow={false}
                  showTime={{ format: TIME_SHORT }}
                  format={HH_MM_DD_MM_YY}
                  locale={i18n.language === 'vn' ? vn : undefined}
                  onChange={onChangeDatePickerFilterBalanceByTo}
                  defaultValue={momentNow()}
                  suffixIcon={<Image src={calendar} alt='calendar' />}
                />
              </Col>
            </Row>
            <Row>
              {cashbackAvailablePeriod?.loading ? (
                <Spin />
              ) : (
                <>
                  <Col span={12}>
                    <Statistic
                      title={t('OPENING_BALANCE')}
                      value={`${formatter.format(
                        (cashbackAvailablePeriod && cashbackAvailablePeriod?.fromCashbackAvailable) || 0,
                      )} ${token ? token : ''}`}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={t('ENDING_BALANCE')}
                      value={`${formatter.format(
                        (cashbackAvailablePeriod && cashbackAvailablePeriod?.toCashbackAvailable) || 0,
                      )} ${token ? token : ''}`}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Card>
        </Col>
        <Col lg={12} md={12}>
          <Row gutter={[10, 10]}>
            <Col lg={24} md={24}>
              <Card>
                <Statistic title={t('TOTAL_USER_UPDATED_PHONE')} value={totalAccountHavePhone.data} />
              </Card>
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Card>
                <Statistic title={t('BECOME_PARTNER_TEXT')} value={100} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xl={12} md={12} xs={24}>
          <Card>
            <Tabs
              className='ant-tabs-custom-left'
              direction='rtl'
              tabBarExtraContent={{
                right: <Typography.Title level={4}>{t('STATISTICS_VNDC')}</Typography.Title>,
              }}
              onChange={onChangeTab}>
              <Tabs.TabPane tab={t('TODAY_TEXT')} key='TODAY'>
                <Row>
                  <Col span={24}>
                    <Statistic title={`${t('TOTAL_REFERRAL_VNDC')} ${t('TODAY_TEXT')}`} value={totalAccountVNDC.data} />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={t('THIS_WEEK_TEXT')} key='THIS_WEEK'>
                <Row>
                  <Col span={24}>
                    <Statistic
                      title={`${t('TOTAL_REFERRAL_VNDC')} ${t('THIS_WEEK_TEXT')}`}
                      value={totalAccountVNDC.data}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={t('THIS_MONTH_TEXT')} key='THIS_MONTH'>
                <Row>
                  <Col span={24}>
                    <Statistic
                      title={`${t('TOTAL_REFERRAL_VNDC')} ${t('THIS_MONTH_TEXT')}`}
                      value={totalAccountVNDC.data}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={t('ALL_TEXT')} key='ALL'>
                <Row>
                  <Col span={24}>
                    <Statistic title={`${t('TOTAL_REFERRAL_VNDC')}`} value={totalAccountVNDC.data} />
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col xl={12} md={12} xs={24}>
          <Row>
            <Col span={24}>
              <Card style={{ height: '174px' }}>
                <Statistic
                  suffix='Sat'
                  title={t('TOTAL_CASHBACK_SUMMARY')}
                  value={cashbackSummary.data?.totalCashback}
                  className='statistic-container'
                />
                <Statistic
                  suffix='Sat'
                  title={t('TOTAL_AVAILABLE_CASHBACK_SUMMARY')}
                  value={cashbackSummary.data?.totalAvailable}
                  className='statistic-container'
                />
                <Statistic
                  suffix='Sat'
                  title={t('TOTAL_PENDING_CASHBACK_SUMMARY')}
                  value={cashbackSummary.data?.totalPending}
                  className='statistic-container'
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card>
        <Row gutter={[10, 20]}>
          <Col xs={24} lg={6} md={24}>
            <Row>
              <Col span={24}>
                <Select
                  style={{ minWidth: '120px' }}
                  defaultValue={TIME_UNIT_BUY_SATOSHI.ALL}
                  onSelect={onSelectBuySatoshiTotal}>
                  <Select.Option value={TIME_UNIT_BUY_SATOSHI.ALL}>{t('ALL_TEXT')}</Select.Option>
                  <Select.Option value={TIME_UNIT_BUY_SATOSHI.THIS_MONTH}>{t('THIS_MONTH_TEXT')}</Select.Option>
                  <Select.Option value={TIME_UNIT_BUY_SATOSHI.LAST_MONTH}>{t('LAST_MONTH_TEXT')}</Select.Option>
                </Select>
              </Col>
              <Divider dashed />
              <Col span={24}>
                <Statistic suffix='Sat' title={t('TOTAL_SATOSHI_DEPOSITED_BY_USER')} value={buySatoshiTotal.data} />
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={18} md={24}>
            <Row>
              <Col span={24} textAlign='right'>
                <DatePicker.RangePicker
                  format={DATE_SLASH_LONG}
                  locale={i18n.language === 'vn' ? vn : undefined}
                  allowClear={false}
                  onChange={onChangeDatePicker}
                  defaultValue={parseRangesThisMonth() as any}
                  ranges={
                    {
                      [t('THIS_WEEK_TEXT')]: parseRanges(7),
                      [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                      [t('LAST_MONTH_TEXT')]: parseLastMonth(),
                    } as any
                  }
                />
              </Col>
              <Col span={24} textAlign='right'>
                {/* TODO: Uncomment later */}
                {/* {buySatoshi.data.length > 0 ? (
                  <>
                    <Typography.Title level={5} style={{ textAlign: 'center' }}>
                      {t('SALE_SATOSHI')}
                    </Typography.Title>
                    <div ref={lineChartBuySatoshiRef} />
                    <Link to={PATH.DEPOSITSATOSHIDETAIL}>
                      {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
                    </Link>
                  </>
                ) : (
                  <Empty />
                )} */}
                <Typography.Title level={5} style={{ textAlign: 'center' }}>
                  {t('SALE_SATOSHI')}
                </Typography.Title>
                <div ref={lineChartBuySatoshiRef} />
                <Link to={PATH.DEPOSITSATOSHIDETAIL}>
                  {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <br />
      <Card>
        <Row gutter={[10, 20]}>
          <Col span={24}>
            <Row gutter={5}>
              <Col xs={24} xl={15} lg={24}>
                <Row>
                  <Col span={8}>
                    <Select value={dashboardAccoutRequest.type} onChange={onChangeAccountSelect}>
                      <Select.Option value={TYPE_TIME.DAY}>{t('TOTAL_ACCOUNT_BY_DAY')}</Select.Option>
                      <Select.Option value={TYPE_TIME.MONTH}>{t('TOTAL_ACCOUNT_BY_MONTH')}</Select.Option>
                    </Select>
                  </Col>
                  {dashboardAccoutRequest.type === TYPE_TIME.DAY && (
                    <Col span={16} textAlign='right'>
                      <DatePicker.RangePicker
                        format={DATE_SLASH_LONG}
                        locale={i18n.language === 'vn' ? vn : undefined}
                        allowClear={false}
                        onChange={onChangeDatePickerAccountChartByDay}
                        defaultValue={getQuarterRange(3, '2021')}
                        ranges={
                          {
                            [`${t('QUARTER_TEXT')} 4`]: getQuarterRange(3, '2021'),
                            [t('LAST_MONTH_TEXT')]: parseRanges(30),
                            [t('THIS_WEEK_TEXT')]: parseRanges(7),
                            [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                          } as any
                        }
                      />
                    </Col>
                  )}
                  {dashboardAccoutRequest.type === TYPE_TIME.MONTH && (
                    <Col span={16} textAlign='right'>
                      <DatePicker
                        picker='year'
                        defaultValue={momentNow()}
                        locale={i18n.language === 'vn' ? vn : undefined}
                        allowClear={false}
                        onChange={(year) => onChangeDatePickerAccountChartByYear(year)}
                      />
                    </Col>
                  )}
                </Row>
                <br />
                <br />
                {dataAccount.length > 0 ? <div ref={chartAccountRef} /> : <Empty />}
              </Col>
              <Col xs={24} xl={9} lg={24}>
                <Card>
                  <div ref={pieChartKycRef} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <br />
      <Card>
        <Row gutter={[5, 5]}>
          <Col xl={15} lg={24} xs={24}>
            {cashback.data.length > 0 ? (
              <>
                <div ref={chartCashbackRef} />
                <Typography.Title level={5} style={{ textAlign: 'center' }}>
                  {t('STATUS_TRANSACTION_BY_TIME_TEXT')}
                </Typography.Title>
              </>
            ) : (
              <Empty />
            )}
          </Col>
          <Col xl={9} lg={24} xs={24}>
            <Col span={24}>
              <Select style={{ width: 110, marginRight: 5 }} defaultValue={TODAY} onChange={onChangeTimeSelect}>
                <Select.Option value={TODAY}>{t('TODAY_TEXT')}</Select.Option>
                <Select.Option value={YESTERDAY}>{t('YESTERDAY_TEXT')}</Select.Option>
                {/* TODO: Wait for requirement */}
                {/* <Select.Option value={TIME_SELECT.THIS_WEEK}>{t('THIS_WEEK_TEXT')}</Select.Option>
                <Select.Option value={TIME_SELECT.THIS_MONTH}>{t('THIS_MONTH_TEXT')}</Select.Option> */}
              </Select>
              <Select
                allowClear={false}
                style={{ width: 200 }}
                defaultValue={cashbackState.status}
                onChange={(value) => onChangeStatusSelect(value)}>
                <Select.Option value={PROCESSING}>{t('PROCESSING_TEXT')}</Select.Option>
                <Select.Option value={SUCCESS}>{t('SUCCESS_TEXT')}</Select.Option>
                <Select.Option value={FAILURE}>{t('FAILURE_TEXT')}</Select.Option>
                <Select.Option value={REJECTED}>{t('REJECTED_TEXT')}</Select.Option>
                <Select.Option value={APPROVED}>{t('APPROVED_TEXT')}</Select.Option>
              </Select>
            </Col>
            <Col span={24}>
              <Table
                pagination={{
                  total: cashback.data.length,
                  defaultPageSize: 6,
                  showSizeChanger: false,
                  showLessItems: true,
                }}
                bordered
                columns={columns}
                rowKey='id'
                dataSource={cashback.data}
                loading={cashback.loading}
                scroll={{ x: 270 }}
              />
            </Col>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default Index;
