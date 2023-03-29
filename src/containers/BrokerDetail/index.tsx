/* eslint-disable react/display-name */
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  List,
  message,
  Modal,
  PageHeader,
  Select,
  Spin,
  Statistic,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { BrokerAPI } from 'apis/broker';
import bami from 'assets/images/bami.png';
import kai from 'assets/images/kai.png';
import sat from 'assets/images/sat.png';
import vndc from 'assets/images/vndc.png';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { DEFAULT_PAGE_SIZE, STATUS, STATUS_CASHBACK } from 'constants/index';
import { PATH } from 'constants/paths';
import { getListCurrency } from 'containers/Broker/duck/thunks';
import { getBrokerDetail, getBrokerTransaction, getBrokerTransactionStat } from 'containers/BrokerDetail/duck/thunks';
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
  parseUnixTimeValueToEndOfDay,
  parseUnixTimeValueToStartOfDay,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

const { DATE_TIME_SLASH_LONG, DATE_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Deposit';
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { brokerId: id } = useParams<{ brokerId: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    brokerDetail: { brokerDetailInformation, loading, brokerTransaction, brokerTransactionStat },
    broker: { currencyList },
  } = useAppSelector((state) => state);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [tab, setTab] = useState('WALLET');
  const [paramSearch, setParamSearch] = useState<IBrokerTransactionRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    type: 1,
    coin: 1,
    from: null,
    to: null,
  });
  const [formDeposit] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formDeposit.resetFields();
      dispatch(getBrokerDetail(id));
    }
  }, [dispatch, formDeposit, id, modalState]);

  useEffect(() => {
    if (tab === 'TRANSACTION') {
      dispatch(
        getBrokerTransaction({
          ...paramSearch,
          id,
          coin: typeof paramSearch.coin === 'number' ? undefined : paramSearch.coin,
          from: paramSearch.from ? parseUnixTimeValueToStartOfDay(paramSearch.from) : undefined,
          to: paramSearch.to ? parseUnixTimeValueToEndOfDay(paramSearch.to) : undefined,
        }),
      );
      dispatch(
        getBrokerTransactionStat(id, {
          ...paramSearch,
          id,
          coin: typeof paramSearch.coin === 'number' ? undefined : paramSearch.coin,
        }),
      );
    }
  }, [dispatch, id, tab, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const availableWallet = useMemo(() => {
    if (!brokerDetailInformation || !brokerDetailInformation.cbAvailable || !currencyList) return [];
    const list: Array<ICurrencyItem> = [];
    for (let i = 0; i < brokerDetailInformation.cbAvailable.length; i++) {
      const id = brokerDetailInformation.cbAvailable[i].currencyId;
      const item = currencyList.find((item) => item.id === id);
      if (item) {
        list.push({ ...item, amount: brokerDetailInformation.cbAvailable[i].amount });
      }
    }
    return list;
  }, [brokerDetailInformation, currencyList]);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Deposit') {
      formDeposit.submit();
    }
  }, [formDeposit, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Deposit') {
        try {
          const res = await BrokerAPI.ADD_DEPOSIT({ ...values, id });
          if (res.currencyId) {
            message.success(t('ADD_DEPOSIT_SUCCESS'));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [id, modalState, t],
  );

  const onChangeTab = useCallback((tab: string) => setTab(tab), []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onSearchInput = useCallback((value: string) => {
    const keyword = value.trim();
    setParamSearch((prev) => ({
      ...prev,
      keyword: keyword ? keyword : undefined,
      page: 1,
    }));
  }, []);

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : null,
      to: value ? parseGetUnixTimeValue(value[1]) : null,
    }));
  }, []);

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Deposit') {
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          centered
          title={t('UPDATE_DEPOSIT')}
          width={1000}
          visible={modalState.isOpen}
          okText={t('UPDATE')}
          onOk={onSubmitModal}
          onCancel={() => onChangeModal(undefined)}>
          <Row>
            <Col span={14}>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={onFinishForm} form={formDeposit}>
                <Form.Item name='coin' label={t('WALLET')} initialValue={availableWallet[0].code}>
                  <Select allowClear>
                    {availableWallet.map((item) => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.code}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name='amount'
                  label={t('AMOUNT_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_AMOUNT_REQUIRED_ERROR') },
                    ({ getFieldValue }) => ({
                      validator(_, amount) {
                        const coin = getFieldValue('coin');
                        const amountAsNumber = Number(amount);
                        if (coin === 'SAT') {
                          if (amountAsNumber > 5000000) {
                            return Promise.reject(new Error(t('LIMIT_AMOUNT_5_MILLION')));
                          }
                        }
                        if (coin === 'VNDC') {
                          if (amountAsNumber > 50000000) {
                            return Promise.reject(new Error(t('LIMIT_AMOUNT_50_MILLION')));
                          }
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <InputNumber />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Modal>
      );
    }
  }, [availableWallet, formDeposit, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

  const columnsTransaction = [
    {
      title: t('TITLE_AND_DESCRIPTION'),
      dataIndex: 'title',
      key: 'title',
      className: 'text-normal',
      render: (value: string, record: IBrokerTransactionItem) => (
        <>
          <Typography.Title level={5}>{value}</Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.description}
          </Typography.Text>
        </>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'vndcUserId',
      key: 'vndcUserId',
    },
    {
      title: t('TRANSACTION_CODE'),
      dataIndex: 'transactionNumber',
      key: 'transactionNumber',
    },
    {
      title: t('CURRENCY_TEXT'),
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: { code: string; name: string }) => currency?.name,
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number, record: IBrokerTransactionItem) =>
        `${record.actionType === 1 ? '+' : '-'}${formatter.format(value)}`,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <>
          {Number(status) === STATUS_CASHBACK.SUCCESS && (
            <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_CASHBACK.FAILURE && (
            <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_CASHBACK.PROCESSING && (
            <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('FEE_TEXT'),
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatMoment(createdAt, DATE_TIME_SLASH_LONG),
    },
  ];

  if (!brokerDetailInformation) return loading ? <Spin /> : <Empty />;

  return (
    <Card>
      <ArrowLeftOutlined onClick={() => history.push(PATH.BROKER)} style={{ fontSize: 20 }} />
      <PageHeader
        title={<>{brokerDetailInformation.fullName}</>}
        avatar={{ src: brokerDetailInformation.avatar, size: 70 }}
        tags={
          <Tag color={brokerDetailInformation.status ? 'green' : 'red'}>
            {STATUS[`${brokerDetailInformation.status}`]}
          </Tag>
        }
        extra={[
          <Button
            key='ADD_DEPOSIT'
            type='primary'
            onClick={() => {
              dispatch(getListCurrency({ status: 1 })).then(() => {
                onChangeModal({ isOpen: true, type: 'Deposit' });
              });
            }}>
            {t('ADD_DEPOSIT')}
          </Button>,
        ]}>
        <Descriptions column={2}>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('PHONE_TEXT')}>
            {brokerDetailInformation.phone}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label='Email'>
            {brokerDetailInformation.email}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Tabs tabBarGutter={5} type='card' onChange={(tab) => onChangeTab(tab)} activeKey={tab}>
        <Tabs.TabPane tab={t('WALLET')} key='WALLET'>
          <Row>
            <Col span={24}>
              <List
                grid={{ gutter: 100, column: 2 }}
                itemLayout='vertical'
                dataSource={availableWallet}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            (item.code === 'BAMI' && bami) ||
                            (item.code === 'VNDC' && vndc) ||
                            (item.code === 'SAT' && sat) ||
                            (item.code === 'KAI' && kai)
                          }
                        />
                      }
                      title={
                        <p>
                          {t('WALLET')} {item.code}
                        </p>
                      }
                      description={
                        <InputNumber
                          value={item.amount}
                          readOnly
                          decimalScale={0}
                          thousandSeparator
                          isUnit={`${t('UNIT_TEXT')}: ${item.code}`}
                        />
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('TRANSACTION_TEXT')} key='TRANSACTION'>
          <Row gutter={[5, 5]} justify='space-around'>
            <Col xxl={6}>
              <Input.Search placeholder={t('PLACEHOLDER_TEXT')} allowClear onSearch={onSearchInput} />
            </Col>
            <Col xxl={{ span: 5, push: 1 }}>
              <Form.Item label={t('TRANSACTION_TYPE')}>
                <Switch
                  defaultChecked
                  checkedChildren='IN'
                  unCheckedChildren='OUT'
                  onChange={(value) => {
                    setParamSearch((prev) => ({ ...prev, type: value ? 1 : -1 }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xxl={4}>
              <Form.Item label={t('UNIT_TEXT')}>
                <Select
                  defaultValue={1}
                  style={{ width: 100 }}
                  onChange={(value) => setParamSearch((prev: any) => ({ ...prev, coin: value }))}>
                  <Select.Option value={1}>{t('ALL_TEXT')}</Select.Option>
                  <Select.Option value='VNDC'>VNDC</Select.Option>
                  <Select.Option value='BAMI'>BAMI</Select.Option>
                  <Select.Option value='KAI'>KAI</Select.Option>
                  <Select.Option value='SAT'>SAT</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={6}>
              <Form.Item>
                <DatePicker.RangePicker
                  format={DATE_SLASH_LONG}
                  locale={i18n.language === 'vn' ? vn : undefined}
                  allowClear={true}
                  value={[
                    paramSearch.from ? parseMoment(paramSearch.from) : null,
                    paramSearch.to ? parseMoment(paramSearch.to) : null,
                  ]}
                  onChange={onChangeDatePicker}
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
            <Col xxl={{ span: 3, push: 1 }}>
              <Button type='primary'>{t('EXPORT_CSV_TEXT')}</Button>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xl={6} lg={12} md={24} xs={24}>
              <Card>
                <Statistic title={t('TOTAL_TRANSACTION_TEXT')} value={brokerTransactionStat?.totalTransactionCount} />
              </Card>
            </Col>
            <Col xl={6} lg={12} md={24} xs={24}>
              <Card>
                <Statistic title={t('TOTAL_AMOUNT_TRANSFERRED')} value={brokerTransactionStat?.totalTransferAmount} />
              </Card>
            </Col>
            <Col xl={6} lg={12} md={24} xs={24}>
              <Card>
                <Statistic title={t('TOTAL_AMOUNT_WITHDRAWN')} value={brokerTransactionStat?.totalDepositAmount} />
              </Card>
            </Col>
            <Col xl={6} lg={12} md={24} xs={24}>
              <Card>
                <Statistic
                  title={t('TOTAL_NUMBER_OF_USER_TRANSFERRED')}
                  value={brokerTransactionStat?.totalTransferAccountCount}
                />
              </Card>
            </Col>
          </Row>
          <Divider />
          <Table
            pagination={{
              total: brokerTransaction ? brokerTransaction.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page) || 1,
              showSizeChanger: false,
            }}
            onChange={onChangeTable}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={brokerTransaction ? brokerTransaction.data : []}
            columns={columnsTransaction}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
      </Tabs>
      {renderModal}
    </Card>
  );
};

export default Index;
