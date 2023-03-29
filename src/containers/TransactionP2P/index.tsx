/* eslint-disable react/display-name */
import { Card, Divider, Select, Statistic, Table, TablePaginationConfig, Typography } from 'antd';
import { Col, Row } from 'components/Container';
import {
  CHICKEN_FARM_TRANSACTION_STATUS,
  CHICKEN_FARM_TRANSACTION_TYPE,
  DEFAULT_PAGE_SIZE,
  TIME_SELECT,
} from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatMoment,
  FORMAT_MOMENT,
  parseGetUnixTime,
  parseObjectToParam,
  parseParamToObject,
  parseUnixTimeSubtractCountDays,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getListTransactionP2P, getStatTransactionP2P } from './duck/thunks';

const { THIS_WEEK, TODAY, YESTERDAY, THIS_MONTH } = TIME_SELECT;
const { BONUS_CHICKEN_EGG, CHICKEN, COMMISSION_GOLDEN_EGG, EGG, GOLDEN_EGG } = CHICKEN_FARM_TRANSACTION_TYPE;
const { SUCCESS, FAILED, PROCESSING } = CHICKEN_FARM_TRANSACTION_STATUS;
const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const params: ITransactionP2PResquest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState({ ...params, time: THIS_WEEK });
  const {
    p2pTransaction: { data, totalRecords, loading, stat },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const param = {
      ...paramSearch,
      status: Number(paramSearch.status) === CHICKEN_FARM_TRANSACTION_STATUS.ALL ? undefined : paramSearch.status,
      type: Number(paramSearch.type) === CHICKEN_FARM_TRANSACTION_TYPE.ALL ? undefined : paramSearch.type,
    };
    if (paramSearch.time === TIME_SELECT.TODAY) {
      param.from = parseGetUnixTime();
      param.to = parseGetUnixTime();
    }
    if (paramSearch.time === TIME_SELECT.YESTERDAY) {
      param.from = parseUnixTimeSubtractCountDays(1);
      param.to = parseGetUnixTime();
    }
    if (paramSearch.time === TIME_SELECT.THIS_WEEK) {
      param.from = parseUnixTimeSubtractCountDays(7);
      param.to = parseGetUnixTime();
    }
    if (paramSearch.time === TIME_SELECT.THIS_MONTH) {
      param.from = parseUnixTimeSubtractCountDays(30);
      param.to = parseGetUnixTime();
    }
    dispatch(getListTransactionP2P(param));
    dispatch(getStatTransactionP2P());
    history.push({ pathname: PATH.P2PTRANSACTION, search: parseObjectToParam(param) });
  }, [dispatch, history, paramSearch]);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onChangeStatusSelect = useCallback(
    (status: number) =>
      setParamSearch((prev) => ({
        ...prev,
        status,
      })),
    [],
  );

  const onChangeTypeSelect = useCallback(
    (type: number) =>
      setParamSearch((prev) => ({
        ...prev,
        type,
      })),
    [],
  );

  const onChangeTimeSelect = useCallback((value: number) => setParamSearch((prev) => ({ ...prev, time: value })), []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
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
      title: t('SELLER_TEXT'),
      dataIndex: 'seller',
      key: 'seller',
      width: 150,
      render: (value) => value?.fullName,
    },
    {
      title: t('DESCRIPTON_TEXT'),
      dataIndex: 'sellerDescription',
      key: 'sellerDescription',
      width: 200,
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <>
          {Number(status) === SUCCESS && <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>}
          {Number(status) === FAILED && <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>}
          {Number(status) === PROCESSING && <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>}
        </>
      ),
    },
    {
      title: t('TYPE_TEXT'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => CHICKEN_FARM_TRANSACTION_TYPE[type],
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
  ];

  return (
    <Card>
      <Row gutter={[10, 10]}>
        <Col lg={8} md={24} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_TRANSACTION_TEXT')} value={stat?.totalTransactionCount} />
          </Card>
        </Col>
        <Col lg={8} md={24} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_TRANSACTION_VALUE_TEXT')} value={stat?.totalTransactionAmount} suffix='đ' />
          </Card>
        </Col>
        <Col lg={8} md={24} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_REVENUE_TEXT')} value={stat?.totalRevenue} suffix='Sat' />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[5, 20]}>
        <Col>
          <Row gutter={[5, 0]}>
            <Col>
              <Select
                defaultValue={paramSearch.status ? Number(paramSearch.status) : CHICKEN_FARM_TRANSACTION_STATUS.ALL}
                style={{ minWidth: 150 }}
                onChange={onChangeStatusSelect}>
                <Select.Option value={CHICKEN_FARM_TRANSACTION_STATUS.ALL}>{t('ALL_TEXT')}</Select.Option>
                <Select.Option value={SUCCESS}>{t('SUCCESS_TEXT')}</Select.Option>
                <Select.Option value={PROCESSING}>{t('PROCESSING_TEXT')}</Select.Option>
                <Select.Option value={FAILED}>{t('FAILURE_TEXT')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                defaultValue={paramSearch.type ? Number(paramSearch.type) : CHICKEN_FARM_TRANSACTION_TYPE.ALL}
                style={{ minWidth: 200 }}
                onChange={onChangeTypeSelect}>
                <Select.Option value={CHICKEN_FARM_TRANSACTION_TYPE.ALL}>{t('ALL_TEXT')}</Select.Option>
                <Select.Option value={BONUS_CHICKEN_EGG}>BONUS_CHICKEN_EGG</Select.Option>
                <Select.Option value={CHICKEN}>CHICKEN</Select.Option>
                <Select.Option value={COMMISSION_GOLDEN_EGG}>COMMISSION_GOLDEN_EGG</Select.Option>
                <Select.Option value={EGG}>EGG</Select.Option>
                <Select.Option value={GOLDEN_EGG}>GOLDEN_EGG</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select onChange={onChangeTimeSelect} defaultValue={THIS_WEEK}>
                <Select.Option value={TODAY}>{t('TODAY_TEXT')}</Select.Option>
                <Select.Option value={YESTERDAY}>{t('YESTERDAY_TEXT')}</Select.Option>
                <Select.Option value={THIS_WEEK}>{t('THIS_WEEK_TEXT')}</Select.Option>
                <Select.Option value={THIS_MONTH}>{t('THIS_MONTH_TEXT')}</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        onChange={onChangeTable}
        loading={loading}
        dataSource={data}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
    </Card>
  );
};

export default Index;
