/* eslint-disable react/display-name */
import { ExclamationCircleOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, message, Modal, Select, Space, Table, Typography } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { MobileUserDetailAPI } from 'apis/mobileuserdetail';
import { Currency } from 'components/Currency';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { DEFAULT_PAGE_SIZE, OPERATOR, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatDate, formatter, FORMAT_MOMENT, parseUnixTime } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccount } from '../duck/thunks';
const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const { GREATER, LESS, EQUAL, GREATER_EQUAL, LESS_EQUAL } = OPERATOR;
const { EMPTY, PENDING, APPROVED, REJECTED } = STATUS_KYC;
const { Option } = Select;

interface AccountTableProps {
  paramSearch: IAccountRequest;
  onHandleSortAmount: (selectedKeys, confirm, dataIndex) => void;
  onResetSortAmount: (clearFilters, dataIndex) => void;
  onEditUser: (record: IAccount) => void;
  onChangeTable: (pagination, _, sorter) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({
  paramSearch,
  onHandleSortAmount,
  onResetSortAmount,
  onEditUser,
  onChangeTable,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    account: { list, loading },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  const onUpgradePartner = useCallback(
    async (id: string) => {
      try {
        const res = await MobileUserDetailAPI.UPGRADE_PARTNER(id);
        if (res.status) {
          message.success(t('UPGRADE_PARTNER_SUCCESS'));
          dispatch(getAccount(paramSearch));
        }
      } catch (error) {
        message.error(t('UPGRADE_PARTNER_ERROR'));
      }
    },
    [dispatch, paramSearch, t],
  );

  const onOpenModalPartner = useCallback(
    (id: string) => {
      Modal.confirm({
        title: t('BECOME_PARTNER_TEXT'),
        icon: <ExclamationCircleOutlined />,
        content: t('CONTENT_UPGRADE_PARTNER'),
        okText: t('COMMON_BUTTON_UPGRADE'),
        cancelText: t('COMMON_BUTTON_CLOSE'),
        onOk: () => onUpgradePartner(id),
      });
    },
    [t, onUpgradePartner],
  );

  const getColumnSearchProps = useCallback(
    (dataIndex: string) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const isArray = typeof selectedKeys.length === 'number';

        return (
          <div style={{ padding: 8 }}>
            <Select
              style={{ width: '100%', marginBottom: '5px' }}
              value={isArray ? GREATER : selectedKeys.select ? selectedKeys.select : GREATER}
              onChange={(value) => {
                setSelectedKeys({ ...selectedKeys, select: value });
              }}>
              <Option value={GREATER}>{'>'}</Option>
              <Option value={LESS}>{'<'}</Option>
              <Option value={EQUAL}>{'='}</Option>
              <Option value={GREATER_EQUAL}>{'>='}</Option>
              <Option value={LESS_EQUAL}>{'<='}</Option>
            </Select>
            <InputNumber
              placeholder={t('ENTER_NUMBER')}
              value={isArray ? '' : selectedKeys.input ? selectedKeys.input : ''}
              style={{ marginBottom: 8, display: 'block' }}
              onValueChange={({ value }) => setSelectedKeys({ ...selectedKeys, input: value })}
            />
            <Space>
              <Button
                type='primary'
                icon={<SearchOutlined />}
                size='small'
                style={{ width: 100 }}
                onClick={() => {
                  onHandleSortAmount(
                    isArray
                      ? undefined
                      : {
                          select: selectedKeys.select ? selectedKeys.select : OPERATOR.GREATER,
                          input: selectedKeys.input ? selectedKeys.input : undefined,
                        },
                    confirm,
                    dataIndex,
                  );
                }}>
                {t('COMMON_BUTTON_SEARCH')}
              </Button>
              <Button onClick={() => onResetSortAmount(clearFilters, dataIndex)} size='small' style={{ width: 90 }}>
                {t('COMMON_BUTTON_RESET')}
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: () => {
        return (
          <FilterOutlined
            style={{
              color: paramSearch.token === dataIndex ? '#1890FF' : undefined,
            }}
          />
        );
      },
    }),
    [onHandleSortAmount, onResetSortAmount, paramSearch, t],
  );

  const columnLeft = [
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
      title: t('USER_NAME_TEXT'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      render: (value: string, record: IAccount) => (
        <Textlink
          text={value}
          onClick={() => onEditUser({ ...record, phone: record.phone && record.phone.substr(1) })}
        />
      ),
    },
    {
      title: t('INFO_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string, record: IAccount) => (
        <>
          <Typography.Title level={5}>{value}</Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.email}
          </Typography.Text>
        </>
      ),
    },
  ];

  const columnRight = [
    {
      title: t('REFERRED_BY'),
      dataIndex: 'referralBy',
      key: 'referralBy',
      width: 120,
      render: (value) =>
        value ? (
          <Link target='_blank' to={`${value.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${value.id}`}>
            {value.fullName}
          </Link>
        ) : (
          '--'
        ),
    },
    {
      title: 'Referrals',
      dataIndex: 'totalReferrals',
      key: 'totalReferrals',
      width: 180,
      render: (value: number, record: IAccount) => (
        <>
          <Typography.Title type='success' level={5}>
            {value}
          </Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {`( ${t('TOTAL_ACCOUNT_KYC_TEXT')}: ${record.totalKyc} )`}
          </Typography.Text>
        </>
      ),
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.totalReferrals - b.totalReferrals,
    },
    {
      title: t('ROLE_TEXT'),
      dataIndex: 'isPartner',
      key: 'isPartner',
      width: 150,
      render: (value: boolean) => (value ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')),
    },
    {
      title: t('VERIFY_KYC_TEXT'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 120,
      render: (value: number) => (
        <>
          {value === EMPTY && <Typography.Text>{t('NON_KYC_TEXT')}</Typography.Text>}
          {value === PENDING && <Typography.Text type='warning'>{t('PENDING_TEXT')}</Typography.Text>}
          {value === APPROVED && <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>}
          {value === REJECTED && <Typography.Text type='danger'>{t('REJECTED_TEXT')}</Typography.Text>}
        </>
      ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={!!status} />,
    },
    {
      title: t('JOIN_DATE_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (value: string) => formatDate(value, DATE_TIME_SLASH_LONG),
      sorter: (a, b) => parseUnixTime(a) - parseUnixTime(b),
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
    },
    {
      dataIndex: 'becomepartner',
      key: 'becomepartner',
      render: (_, record: IAccount) => (
        <Button disabled={record.isPartner} onClick={() => onOpenModalPartner(record.id)}>
          {t('COMMON_BUTTON_UPGRADE')}
        </Button>
      ),
    },
  ];

  console.log(JSON.stringify(list));
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
      columns={[
        ...columnLeft,
        ...(currencyList || []).map((currency) => ({
          title: t('TOTAL_AMOUNT') + currency.code,
          dataIndex: 'tokens',
          key: currency.code,
          width: 200,
          sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
          sorter: (a, b) => a.tokens[currency.code] - b.tokens[currency.code],
          render: (tokens) => {
            return (
              <Currency icon={currency.icon} amount={formatter.format(tokens[currency.code])} color='#52c41a' bold />
            );
          },
          ...getColumnSearchProps(currency.code),
        })),
        ...columnRight,
      ]}
      scroll={{ x: 700 }}
      rowKey='id'
    />
  );
};

export default AccountTable;
