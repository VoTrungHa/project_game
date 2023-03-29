/* eslint-disable react/display-name */
import { Button, Card, DatePicker, Form, message, Table, TablePaginationConfig, Typography } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { ReportAPI } from 'apis/report';
import { Col, Row } from 'components/Container';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  downloadCSV,
  formatter,
  FORMAT_MOMENT,
  Moment,
  parseGetUnixTime,
  parseGetUnixTimeValue,
  parseObjectToParam,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseUnixTimeSubtractCountDays,
  parseUnixTimeValueToEndOfDay,
  standardizeMoment,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getListReferral } from './duck/thunks';

const { DATE_SLASH_LONG, DD_MM_YYYY } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const {
    referral: { data, totalRecords, loading },
  } = useAppSelector((state) => state);
  const location = useLocation();
  const params = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState<IReferralRequest>({
    from: params.from ? parseGetUnixTimeValue(Number(params.from)) : parseUnixTimeSubtractCountDays(30),
    to: params.to ? parseGetUnixTimeValue(Number(params.to)) : parseGetUnixTime(),
    size: DEFAULT_PAGE_SIZE,
    page: params.page && Number(params.page) ? Number(params.page) : 1,
  });

  useEffect(() => {
    const params = {
      ...paramSearch,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? parseUnixTimeValueToEndOfDay(paramSearch.to)
          : paramSearch.to
        : undefined,
    };
    dispatch(getListReferral(params));
    history.push({ pathname: PATH.REFERRAL, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onDownloadCSV = useCallback(async () => {
    const params = {
      ...paramSearch,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? parseUnixTimeValueToEndOfDay(paramSearch.to)
          : paramSearch.to
        : undefined,
    };
    try {
      const res = await ReportAPI.DOWNLOAD_CSV(params);
      downloadCSV(res, `referral_${standardizeMoment().format(DD_MM_YYYY)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(Number(value[0])) : undefined,
      to: value ? parseGetUnixTimeValue(Number(value[1])) : undefined,
    }));
  }, []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (value: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: value,
          }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t('USER_NAME_TEXT'),
      dataIndex: 'full_name',
      key: 'full_name',
      width: 120,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (value: string) => <>{value || '--'}</>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: t('ACCOUNT_REFERRED_BY_YOU_TEXT'),
      dataIndex: 'totalReferrals',
      key: 'totalReferrals',
      width: 180,
      render: (value: number) => (
        <Typography.Title type='success' level={5}>
          {value}
        </Typography.Title>
      ),
    },
    {
      title: t('TOTAL_ACCOUNT_KYC_TEXT'),
      dataIndex: 'totalKyc',
      key: 'totalKyc',
      width: 180,
      render: (value) => <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>{value}</span>,
    },
    {
      title: t('COMMISSION_RECEIVED'),
      dataIndex: 'receivedAmount',
      key: 'receivedAmount',
      width: 120,
      render: (value: number) => (
        <Typography.Title type='success' level={5}>
          {formatter.format(value)} <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>SAT</span>
        </Typography.Title>
      ),
    },
    {
      title: t('PENDING_COMMISSION'),
      dataIndex: 'pendingAmount',
      key: 'pendingAmount',
      width: 120,
      render: (value: number) => (
        <>
          <Typography.Title type='success' level={5}>
            {formatter.format(value)} <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>SAT</span>
          </Typography.Title>
        </>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[12, 12]}>
        <Col xxl={12} xl={16} lg={24} md={24} xs={24}>
          <Form.Item
            label={t('SUCCESSFULL_KYC_DAY')}
            labelAlign='left'
            wrapperCol={{ span: 12 }}
            labelCol={{ span: 5 }}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format={DATE_SLASH_LONG}
              locale={i18n.language === 'vn' ? vn : undefined}
              allowClear={true}
              onChange={onChangeDatePicker}
              value={[
                paramSearch.from ? standardizeMoment(paramSearch.from) : null,
                paramSearch.to ? standardizeMoment(paramSearch.to) : null,
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
            />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={8} lg={24} md={24} xs={24} textAlign='right'>
          <Button onClick={onDownloadCSV} type='primary'>
            {t('EXPORT_CSV_TEXT')}
          </Button>
        </Col>
      </Row>

      <br />
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
        }}
        onChange={onChangeTable}
        showSorterTooltip={false}
        sortDirections={['descend']}
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 700 }}
        rowKey='id'
      />
    </Card>
  );
};

export default Index;
