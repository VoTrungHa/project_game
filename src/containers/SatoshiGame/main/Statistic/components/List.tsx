/* eslint-disable react/display-name */
import { Statistic, Table, TablePaginationConfig, Typography } from 'antd';
import { Currency } from 'components/Currency';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatMoment, formatter, FORMAT_MOMENT } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../../../index.scss';

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface ListProps {
  paramSearch: IStatisticSatoshiGameRequest;
  onChangeTable: (pagination: TablePaginationConfig, _, sorter) => void;
}

const List: React.FC<ListProps> = ({ paramSearch, onChangeTable }) => {
  const { t } = useTranslation();

  const {
    satoshiGame: { list, loading },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 200,
      render: (receiver: { fullName: string; id: string }) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: receiver?.id,
          }}>
          {receiver?.id}
        </Typography.Text>
      ),
    },
    {
      title: t('FULL_NAME'),
      dataIndex: 'receiver',
      key: 'fullName',
      render: (receiver: { fullName: string; id: string; isPartner: boolean }) =>
        receiver ? (
          <Link
            to={{
              pathname: `${receiver.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${receiver.id}`,
              state: {
                hasStatisticGame: new Date().getTime(),
              },
            }}>
            {receiver.fullName}
          </Link>
        ) : (
          '--'
        ),
    },
    {
      title: t('SAT_REWARD'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className='currency'>
          <Statistic
            prefix={[...currencyList.filter((item) => ['SAT'].includes(item.code))].map((currency, key) => (
              <Currency icon={currency.icon} key={key} amount={amount ? formatter.format(Number(amount)) : 0} />
            ))}
            value=' '
          />
        </span>
      ),
    },
    {
      title: t('TIME_REWARD'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatMoment(createdAt, DATE_TIME_SLASH_LONG),
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

export default List;
