/* eslint-disable react/display-name */
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Descriptions, Empty, Spin, Table, TablePaginationConfig, Tabs, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import { PageHeaderCustom } from 'containers/PageHeader';
import { renderUnit } from 'containers/StatisticStacking/components/StatisticStackingTable';
import { formatMoment, FORMAT_MOMENT, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { getStackingDetailAction, getStackingTableAction } from './duck/thunks';
import './index.scss';

const { DATE_SLASH_LONG } = FORMAT_MOMENT;

const StackingDetail: React.FC = () => {
  const { t } = useTranslation();

  const { stackingId: id } = useParams<{ stackingId: string }>();
  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);

  const dispatch = useAppDispatch();
  const {
    statisticStackingDetail: { loading, stackingDetailInformation, accounts },
    broker: { currencyList },
  } = useAppSelector((state) => state);
  const isXs = useBreakpoint().xs;

  const [paramSearch, setParamSearch] = useState<{ page?: number; size?: number }>({
    ...params,
  });

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current,
      }));
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    dispatch(getStackingDetailAction(id));
    dispatch(getStackingTableAction(id, paramSearch));
  }, [dispatch, history, id, paramSearch]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'accountId',
      key: 'id',
      width: 150,
      render: (accountId: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: accountId,
          }}>
          {accountId}
        </Typography.Text>
      ),
    },
    {
      title: t('USER_NAME_TEXT'),
      dataIndex: 'account',
      key: 'account',
      render: (account, record) =>
        account.fullName ? (
          <Link
            to={{
              pathname: `${account.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${record.accountId}`,
              state: {
                hasStatisticStacking: new Date().getTime(),
                id: id,
              },
            }}>
            {account.fullName}
          </Link>
        ) : (
          '--'
        ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => <span>{record.account.email || '--'}</span>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record) => <span>{record.account.phone || '--'}</span>,
    },
    {
      title: t('SAT_BALANCE'),
      dataIndex: 'fromWalletAmount',
      key: 'fromWalletAmount',
      render: (fromWalletAmount: number) => renderUnit(currencyList, 'SAT', fromWalletAmount),
    },
    {
      title: t('VNDC_BALANCE'),
      dataIndex: 'toWalletAmount',
      key: 'toWalletAmount',
      render: (toWalletAmount: number) => renderUnit(currencyList, 'VNDC', toWalletAmount),
    },
    {
      title: t('AMOUNT_OF_PROFIT'),
      dataIndex: 'toInterestAmount',
      key: 'toInterestAmount',
      render: (toInterestAmount: number) => renderUnit(currencyList, 'VNDC', toInterestAmount),
    },
  ];

  if (!stackingDetailInformation) return loading ? <Spin /> : <Empty />;

  return (
    <Card>
      <ArrowLeftOutlined onClick={() => history.push(PATH.STATISTIC_STACKING)} style={{ fontSize: 20 }} />
      <PageHeaderCustom name=''>
        <Descriptions column={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} layout={isXs ? 'vertical' : 'horizontal'}>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('DATE_TIME')}>
            {formatMoment(stackingDetailInformation?.dateTime, DATE_SLASH_LONG)}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('HIGHEST_INTERST_AMOUNT')}>
            <span className='currency-description'>
              {renderUnit(currencyList, 'VNDC', stackingDetailInformation?.highestInterestAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_ACCOUNTS')}>
            {stackingDetailInformation?.totalAccounts}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('LOWEST_INTERST_AMOUNT')}>
            <span className='currency-description'>
              {renderUnit(currencyList, 'VNDC', stackingDetailInformation?.lowestInterestAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_INTERST_AMOUNT')}>
            <span className='currency-description'>
              {renderUnit(currencyList, 'VNDC', stackingDetailInformation?.totalInterestAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('AVEGARE_INTERST_AMOUNT')}>
            <span className='currency-description'>
              {renderUnit(currencyList, 'VNDC', stackingDetailInformation?.averageInterestAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('INTERST_RATE')}>
            <span className='currency'>{stackingDetailInformation?.interestRate}</span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeaderCustom>
      <Tabs tabBarGutter={5} type='card'>
        <Tabs.TabPane tab={t('INTEREST_PAYMENT')} key='accounts'>
          <br />
          <Table
            pagination={{
              total: accounts ? accounts.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page) || 1,
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            onChange={onChangeTable}
            sortDirections={['descend']}
            dataSource={accounts ? accounts?.data : []}
            columns={columns}
            scroll={{ x: 700 }}
            rowKey='accountId'
            loading={loading}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default StackingDetail;
