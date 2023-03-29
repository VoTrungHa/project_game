/* eslint-disable react/display-name */
import { Card, DatePicker, Divider, Input, Select, Statistic, Table, TablePaginationConfig, Typography } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { Col, Row } from 'components/Container';
import { Currency } from 'components/Currency';
import { Link } from 'components/Link';
import { DEFAULT_PAGE_SIZE, STATUS_CASHBACK } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatMoment,
  formatter,
  FORMAT_MOMENT,
  Moment,
  parseGetUnixTimeValue,
  parseMoment,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseUnixTimeValueToStartOfDay,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListDepositSatoshiDetail, getStatDepositSatoshiDetail } from './duck/thunks';

const { ALL, SUCCESS, PROCESSING, REJECTED, FAILURE } = STATUS_CASHBACK;
const { DATE_TIME_SLASH_LONG, DATE_SLASH_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    depositSatoshiDetail: { stat, data, loading, totalRecords },
    broker: { currencyList },
  } = useAppSelector((state) => state);
  const [paramSearch, setParamSearch] = useState<IListBuySatoshiRequest>({
    page: 1,
    status: ALL,
    from: null,
    to: null,
  });

  useEffect(() => {
    const params: IListBuySatoshiRequest = {
      page: paramSearch.page,
      status: paramSearch.status !== ALL ? paramSearch.status : undefined,
      from: paramSearch.from ? parseUnixTimeValueToStartOfDay(paramSearch.from) : undefined,
      to: paramSearch.to ? parseUnixTimeValueToStartOfDay(paramSearch.to) : undefined,
      keyword: paramSearch.keyword,
    };
    dispatch(getListDepositSatoshiDetail(params));
    dispatch(getStatDepositSatoshiDetail(params));
  }, [dispatch, paramSearch]);

  const onChangeStatus = useCallback(
    (value: number) => setParamSearch((prev) => ({ ...prev, page: 1, status: value })),
    [],
  );

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 180,
      render: (value: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer', width: '120px' }}
          ellipsis={{
            tooltip: value,
          }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t('PERFORMER_TEXT'),
      dataIndex: 'account',
      key: 'account',
      width: 150,
      render: (account) => (
        <>
          <Link target='_blank' to={`${PATH.MOBILEUSERDETAIL}/${account.id}`}>
            {account.fullName}
          </Link>
          <br />
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {account.phone}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('TITLE_AND_DESCRIPTION'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (value: string, record: IListBuySatoshiItem) => (
        <>
          <Typography.Title level={5}>{value}</Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.description}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (value: number, record: IListBuySatoshiItem) => {
        return (
          <>
            <Typography.Title type='success' level={5}>
              {`${formatter.format(value)} Sat`}
            </Typography.Title>
            <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
              {Number(record.amountExchange) ? `( ${formatter.format(Number(record.amountExchange))} đ )` : '--'}
            </Typography.Text>
          </>
        );
      },
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record: IListBuySatoshiItem) => (
        <>
          {Number(record.status) === SUCCESS && <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>}
          {Number(record.status) === FAILURE && <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>}
          {Number(record.status) === PROCESSING && (
            <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
          )}
          {Number(record.status) === REJECTED && (
            <Typography.Text type='secondary'>{t('REJECTED_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, record: IListBuySatoshiItem) => formatMoment(record.createdAt, DATE_TIME_SLASH_LONG),
      sorter: (a, b) => parseGetUnixTimeValue(a.createdAt) - parseGetUnixTimeValue(b.createdAt),
    },
  ];

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      if (Number(paramSearch.page) === pagination.current) return;

      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current || 1,
        }));
      }
    },
    [paramSearch.page],
  );

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : null,
      to: value ? parseGetUnixTimeValue(value[1]) : null,
    }));
  }, []);

  const onSearchInput = useCallback((value: string) => {
    const keyword = value.trim();
    setParamSearch((prev) => ({
      ...prev,
      keyword: keyword ? keyword : undefined,
      page: 1,
    }));
  }, []);

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={8}>
          <Input.Search
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_SEARCH_DEPOSIT')}
            allowClear
          />
        </Col>
        <Col>
          <DatePicker.RangePicker
            format={DATE_SLASH_LONG}
            locale={i18n.language === 'vn' ? vn : undefined}
            allowClear={true}
            value={[
              paramSearch.from ? parseMoment(paramSearch.from) : null,
              paramSearch.to ? parseMoment(paramSearch.to) : null,
            ]}
            ranges={
              {
                [t('TODAY_TEXT')]: parseRangesToday(),
                [t('YESTERDAY_TEXT')]: parseRanges(1),
                [t('THIS_WEEK_TEXT')]: parseRanges(7),
                [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                [t('LAST_MONTH_TEXT')]: parseRanges(30),
              } as any
            }
            onChange={onChangeDatePicker}
          />
        </Col>
        <Col>
          <Select style={{ width: 120 }} onChange={onChangeStatus} defaultValue={ALL}>
            <Select.Option value={ALL}>{t('ALL_TEXT')}</Select.Option>
            <Select.Option value={SUCCESS}>{t('SUCCESS_TEXT')}</Select.Option>
            <Select.Option value={PROCESSING}>{t('PROCESSING_TEXT')}</Select.Option>
            <Select.Option value={REJECTED}>{t('REJECTED_TEXT')}</Select.Option>
          </Select>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card>
            <Statistic
              title={t('TOTAL_SATOSHI')}
              prefix={[
                ...currencyList.filter((item) =>
                  (stat?.totalDepositAmount ? Object.keys(stat.totalDepositAmount) : []).includes(item.code),
                ),
              ].map((currency, key) => (
                <Currency
                  icon={currency.icon}
                  key={key}
                  amount={
                    stat?.totalDepositAmount ? formatter.format(Number(stat.totalDepositAmount?.[currency?.code])) : 0
                  }
                />
              ))}
              value=' '
            />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_NUMBER_OF_DEPOSIT')} value={stat?.totalRecords} />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_NUMBER_OF_DEPOSIT_SUCCESS')} value={stat?.totalSuccess} />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title={
                paramSearch.status === PROCESSING
                  ? t('TOTAL_NUMBER_OF_DEPOSIT_PENDING')
                  : t('TOTAL_NUMBER_OF_DEPOSIT_FAIL')
              }
              value={stat?.totalFailed}
            />
          </Card>
        </Col>
        <Col xxl={4} xl={6} md={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_NUMBER_OF_USES_DEPOSIT')} value={stat?.totalUsers} />
          </Card>
        </Col>
      </Row>
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page),
          showSizeChanger: false,
        }}
        onChange={onChangeTable}
        loading={loading}
        dataSource={data}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='createdAt'
      />
    </Card>
  );
};

export default Index;
