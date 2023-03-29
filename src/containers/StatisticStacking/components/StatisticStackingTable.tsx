/* eslint-disable react/display-name */
/* eslint-disable react/jsx-no-undef */
import { ArrowRightOutlined } from '@ant-design/icons/lib/icons';
import { Table, TablePaginationConfig, Tooltip } from 'antd';
import { Currency } from 'components/Currency';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatMoment, formatter, FORMAT_MOMENT } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../index.scss';

export const renderUnit = (array: Array<any>, code: string, amount: string | number) =>
  [...array.filter((currency) => [code].includes(currency.code))].map((currency, key) => (
    <Currency icon={currency.icon} key={key} amount={amount ? formatter.format(Number(amount || 0)) : 0} />
  ));

const { DATE_SLASH_LONG } = FORMAT_MOMENT;
interface StatisticStackingTableProps {
  paramSearch: IStatisticStackingRequest;
  onChangeTable: (pagination: TablePaginationConfig, _, sorter) => void;
}
const StatisticStackingTable: React.FC<StatisticStackingTableProps> = ({ paramSearch, onChangeTable }) => {
  const { t } = useTranslation();

  const {
    statisticStacking: { list, loading },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  const columns = [
    {
      title: t('DATE_TIME'),
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dateTime: string) => formatMoment(dateTime, DATE_SLASH_LONG),
    },
    {
      title: t('TOTAL_INTERST_AMOUNT'),
      dataIndex: 'totalInterestAmount',
      key: 'totalInterestAmount',
      render: (totalInterestAmount: number, record: IStatisticStackingItem) => (
        <span className='currency'>{renderUnit(currencyList, record?.toWallet?.code, totalInterestAmount)}</span>
      ),
    },
    {
      title: t('TOTAL_ACCOUNTS'),
      dataIndex: 'totalAccounts',
      key: 'totalAccounts',
    },
    {
      title: t('INTERST_RATE'),
      dataIndex: 'interestRate',
      key: 'interestRate',
    },
    {
      title: t('HIGHEST_INTERST_AMOUNT'),
      dataIndex: 'highestInterestAmount',
      key: 'highestInterestAmount',
      render: (highestInterestAmount: number, record: IStatisticStackingItem) => (
        <span className='currency'>{renderUnit(currencyList, record?.toWallet?.code, highestInterestAmount)}</span>
      ),
    },
    {
      title: t('LOWEST_INTERST_AMOUNT'),
      dataIndex: 'lowestInterestAmount',
      key: 'lowestInterestAmount',
      render: (lowestInterestAmount: number, record: IStatisticStackingItem) => (
        <span className='currency'>{renderUnit(currencyList, record?.toWallet?.code, lowestInterestAmount)}</span>
      ),
    },
    {
      title: t('AVEGARE_INTERST_AMOUNT'),
      dataIndex: 'averageInterestAmount',
      key: 'averageInterestAmount',
      render: (averageInterestAmount: number, record: IStatisticStackingItem) => (
        <span className='currency'>{renderUnit(currencyList, record?.toWallet?.code, averageInterestAmount)}</span>
      ),
    },
    {
      dataIndex: 'id',
      key: 'see_detail',
      // eslint-disable-next-line react/display-name
      render: (_, record) => (
        <Tooltip title={t('INFODETAIL_TEXT')}>
          <Link to={`${PATH.STATISTIC_STACKING_DETAIL}/${record.id}`}>
            <ArrowRightOutlined />
          </Link>
        </Tooltip>
      ),
    },
  ];
  return (
    <Table
      pagination={{
        total: list ? list.totalRecords : 0,
        pageSize: DEFAULT_PAGE_SIZE,
        current: Number(paramSearch.page) || 1,
        showSizeChanger: false,
      }}
      showSorterTooltip={false}
      onChange={onChangeTable}
      loading={loading}
      sortDirections={['descend']}
      dataSource={list ? list.data : []}
      columns={columns}
      scroll={{ x: 700 }}
      rowKey='id'
    />
  );
};

export default StatisticStackingTable;
