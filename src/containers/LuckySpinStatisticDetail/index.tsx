/* eslint-disable react/display-name */
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, message, Table, TablePaginationConfig, Tabs, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { LuckySpinAPI } from 'apis/luckyspin';
import { DEFAULT_PAGE_SIZE, REWARD_STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import { PageHeaderCustom } from 'containers/PageHeader';
import { renderUnit } from 'containers/StatisticStacking/components/StatisticStackingTable';
import { downloadCSV, formatDate, formatDateNowMoment, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { getListUser } from './duck/thunks';
import './index.scss';

const { DD_MM_YYYY, DATE_SLASH_LONG, DATE_TIME_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { dateSpin } = useParams<{ dateSpin: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    luckySpinDetail: { loading, data, page, totalRecords, summary },
    broker: { currencyList },
  } = useAppSelector((state) => state);
  const isXs = useBreakpoint().xs;
  const [paramSearch, setParamSearch] = useState<ILuckyWheelStatisticByDateRequest>({
    size: DEFAULT_PAGE_SIZE,
    page: 1,
    date: dateSpin,
  });

  useEffect(() => {
    if (!paramSearch.date) return;
    dispatch(getListUser(paramSearch));
  }, [dateSpin, dispatch, paramSearch]);

  const onDownloadCSV = useCallback(async () => {
    try {
      const res = await LuckySpinAPI.DOWNLOAD_LUCKY_SPIN_BY_DATE_CSV(paramSearch);
      downloadCSV(res, `lucky_spin_by_date_${formatDateNowMoment(DD_MM_YYYY)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

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
      width: 120,
      render: (_, record) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: record.account.id,
          }}>
          {record.account.id}
        </Typography.Text>
      ),
    },
    {
      title: t('USER_NAME_TEXT'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
      render: (_, record) => record.account.fullName,
    },

    {
      title: t('DATE_SPIN'),
      dataIndex: 'rewardAt',
      key: 'rewardAt',
      width: 150,
      render: (value: number) => formatDate(value, DATE_TIME_LONG),
    },
    {
      title: t('TITLE_TEXT'),
      dataIndex: 'rewardTitle',
      key: 'rewardTitle',
      width: 150,
    },
    {
      title: t('REWARD_TEXT'),
      dataIndex: 'reward',
      key: 'reward',
      width: 120,
      render: (reward: number) => `${reward} Sat`,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'rewardStatus',
      key: 'rewardStatus',
      width: 120,
      render: (status: number) => (
        <>
          {Number(status) === REWARD_STATUS.NOT_USED && (
            <Typography.Text type='success'>{t('NOT_USED_TEXT')}</Typography.Text>
          )}
          {Number(status) === REWARD_STATUS.USED && <Typography.Text type='danger'>{t('USED_TEXT')}</Typography.Text>}
          {Number(status) === REWARD_STATUS.EXPIRED && (
            <Typography.Text type='warning'>{t('EXPIRED_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
  ];

  const summaryData = [
    {
      label: t('SPECIAL_PRIZE'),
      value: renderUnit(currencyList, 'SAT', summary?.totalPrizeSpecial),
    },
    {
      label: t('TOTAL_SAT_OF_ALL_PRIZES'),
      value: renderUnit(currencyList, 'SAT', summary?.totalAllPrizes),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 50`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize50),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 100`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize100),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 200`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize200),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 300`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize300),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 400`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize400),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 500`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize500),
    },
    {
      label: `${t('TOTAL_SAT_OF_PRIZES')} 1000`,
      value: renderUnit(currencyList, 'SAT', summary?.totalPrize1000),
    },
  ];

  return (
    <Card>
      <ArrowLeftOutlined onClick={() => history.push(PATH.LUCKYSPINSTATISTIC)} style={{ fontSize: 20 }} />
      <PageHeaderCustom
        name={`${t('DETAIL_LUCKY_SPIN_DATE')} ${formatDate(dateSpin, DATE_SLASH_LONG)}`}
        extra={
          <Button onClick={onDownloadCSV} type='primary'>
            {t('EXPORT_CSV_TEXT')}
          </Button>
        }>
        <Descriptions column={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} layout={isXs ? 'vertical' : 'horizontal'}>
          {summaryData.map((prize, key) => (
            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={prize?.label} key={key}>
              <span className='prize-description'>{prize?.value}</span>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </PageHeaderCustom>
      <Tabs tabBarGutter={5} type='card'>
        <Tabs.TabPane tab={t('LIST_TURN')} key='USER'>
          <br />
          <Table
            pagination={{
              total: totalRecords,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(page) || 1,
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={data}
            columns={columns}
            loading={loading}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
            rowKey='id'
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
