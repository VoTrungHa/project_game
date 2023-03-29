/* eslint-disable react/display-name */
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Card,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
  PageHeader,
  Select,
  Statistic,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
  Timeline,
  Typography,
} from 'antd';
import { BitfarmAPI } from 'apis/bitfarm';
import { Col, Row } from 'components/Container';
import { Textlink } from 'components/Textlink';
import {
  CHICKEN_FARM_TRANSACTION_STATUS,
  CHICKEN_STATUS,
  CHICKEN_TYPE,
  DEFAULT_PAGE_SIZE,
  PLAYER_TRANSACTION_TYPE,
  STATUS_CASHBACK,
} from 'constants/index';
import { PATH } from 'constants/paths';
import { formatMoment, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { getAccountTransaction, getBrokerTransaction, getListChicken, getListEgg } from './duck/thunks';

interface IParamSearch {
  tab?: string;
  page?: number;
  size?: number;
  type?: number | string;
  status?: number | string;
}

const initialParam = {
  tab: 'HISTORY_OF_EGGS',
  page: 1,
  type: PLAYER_TRANSACTION_TYPE.SELLER,
  status: 'ALL',
};

interface IModalState {
  type: 'DetailEgg' | 'DetailChicken';
  data?: IDetailEggResponse | IChickenItem;
  isOpen: boolean;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const Index: React.FC = () => {
  const { t } = useTranslation();
  const { playerId: id } = useParams<{ playerId: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    playerDetail: { brokerTransactionData, loading, listEgg, listChicken, accountTransaction },
  } = useAppSelector((state) => state);
  const [paramSearch, setParamSearch] = useState<IParamSearch>(initialParam);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useDidMount(() => {
    dispatch(getBrokerTransaction(id));
  });

  useEffect(() => {
    if (paramSearch.tab === 'HISTORY_OF_EGGS') {
      dispatch(getListEgg({ id, page: paramSearch.page, size: DEFAULT_PAGE_SIZE }));
    }
    if (paramSearch.tab === 'HISTORY_OF_CHICKEN') {
      dispatch(
        getListChicken({
          id,
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          type: typeof paramSearch.type === 'number' ? paramSearch.type : undefined,
        }),
      );
    }
    if (paramSearch.tab === 'TRANSACTION') {
      dispatch(
        getAccountTransaction({
          id,
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          type: Number(paramSearch.type),
          status: typeof paramSearch.status === 'number' ? paramSearch.status : undefined,
        }),
      );
    }
  }, [dispatch, id, paramSearch]);

  const onChangeTab = useCallback(
    (tab: string) => {
      if (tab === paramSearch.tab) return;
      setParamSearch((prev) => ({ ...prev, tab, page: 1 }));
    },
    [paramSearch.tab],
  );

  const onSelectChickenType = useCallback((type: number | string) => {
    setParamSearch((prev) => ({ ...prev, type }));
  }, []);

  const onSelectTransactionType = useCallback((type: number | string) => {
    setParamSearch((prev) => ({ ...prev, type }));
  }, []);

  const onSelectTransactionStatus = useCallback((status: number | string) => {
    setParamSearch((prev) => ({ ...prev, status }));
  }, []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onDetailEgg = useCallback(
    async (eggId: string) => {
      onChangeModal({ isOpen: true, type: 'DetailEgg', data: undefined });
      try {
        const res = await BitfarmAPI.GET_DETAIL_EGG_BY_ID({ id, eggId });
        onChangeModal({ isOpen: true, type: 'DetailEgg', data: res });
      } catch (error) {
        onChangeModal({ isOpen: true, type: 'DetailEgg', data: undefined });
      }
    },
    [id, onChangeModal],
  );

  const onDetailChicken = useCallback(
    async (chickenId: string) => {
      onChangeModal({ isOpen: true, type: 'DetailChicken', data: undefined });
      try {
        const res = await BitfarmAPI.GET_DETAIL_CHICKEN_BY_ID({ id, chickenId });
        onChangeModal({ isOpen: true, type: 'DetailChicken', data: res });
      } catch (error) {
        onChangeModal({ isOpen: true, type: 'DetailChicken', data: undefined });
      }
    },
    [id, onChangeModal],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'DetailEgg') {
      if (!modalState.data) return '...loadng';
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okButtonProps={{ style: { display: 'none' } }}
          centered
          title={t('INFO_TEXT')}
          width={800}
          visible={modalState.isOpen}
          onCancel={() => onChangeModal(undefined)}>
          <Row>
            <Col span={24}>
              <Card hoverable>
                <Timeline mode='left'>
                  {(modalState.data as IDetailEggResponse).histories.map((item) => (
                    <Timeline.Item key={item.note} label={formatMoment(item.updatedAt, DATE_TIME_SLASH_LONG)}>
                      {item.note}
                    </Timeline.Item>
                  ))}
                  <Timeline.Item color='red' />
                </Timeline>
              </Card>
            </Col>
          </Row>
        </Modal>
      );
    }

    if (modalState.type === 'DetailChicken') {
      if (!modalState.data) return '...loadng';
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okButtonProps={{ style: { display: 'none' } }}
          centered
          title={t('INFO_TEXT')}
          width={600}
          visible={modalState.isOpen}
          onCancel={() => onChangeModal(undefined)}>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='type'
                  label={t('TYPE_CHICKEN_TEXT')}
                  initialValue={CHICKEN_TYPE[(modalState.data as IChickenItem).level]}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item
                  name='level'
                  label={t('LEVEL_CHICKEN_TEXT')}
                  initialValue={(modalState.data as IChickenItem).level}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item
                  name='chickenNo'
                  label={t('CHICKEN_NO')}
                  initialValue={(modalState.data as IChickenItem).chickenNo}>
                  <Input readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [modalState, onChangeModal, t]);

  const columnEgg = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      title: t('BUY_FROM_EVENT'),
      dataIndex: 'eggEvent',
      key: 'eggEvent',
      render: (value) => value?.title,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (_, record: IEggItem) => (
        <>
          {Number(record.status) === STATUS_CASHBACK.SUCCESS && (
            <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>
          )}
          {Number(record.status) === STATUS_CASHBACK.FAILURE && (
            <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>
          )}
          {Number(record.status) === STATUS_CASHBACK.PROCESSING && (
            <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('TIME_OF_PURCHASE'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      render: (_, record: IEggItem) => <Textlink text={t('INFODETAIL_TEXT')} onClick={() => onDetailEgg(record.id)} />,
    },
  ];

  const columnChicken = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      title: t('TYPE_CHICKEN_TEXT'),
      dataIndex: 'type',
      key: 'type',
      render: (value) => CHICKEN_TYPE[value],
    },
    {
      title: t('LEVEL_CHICKEN_TEXT'),
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <>
          {Number(status) === CHICKEN_STATUS.ALIVE && (
            <Typography.Text type='success'>{t('EXIST_CHICKEN')}</Typography.Text>
          )}
          {Number(status) === CHICKEN_STATUS.DIE && (
            <Typography.Text type='danger'>{t('NON_EXIST_CHICKEN')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('CHICKEN_NO'),
      dataIndex: 'chickenNo',
      key: 'chickenNo',
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      render: (_, record) => <Textlink text={t('INFODETAIL_TEXT')} onClick={() => onDetailChicken(record.id)} />,
    },
  ];

  const columnsTransaction = [
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
      render: (value) => value?.fullName,
    },
    {
      title: t('SELLER_DESCRIPTION_TEXT'),
      dataIndex: 'sellerDescription',
      key: 'sellerDescription',
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
          {Number(status) === CHICKEN_FARM_TRANSACTION_STATUS.SUCCESS && (
            <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>
          )}
          {Number(status) === CHICKEN_FARM_TRANSACTION_STATUS.PROCESSING && (
            <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
          )}
        </>
      ),
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
      <ArrowLeftOutlined onClick={() => history.push(PATH.PLAYERLIST)} style={{ fontSize: 20 }} />
      <PageHeader
        title={<>{brokerTransactionData?.fullName}</>}
        avatar={{ src: brokerTransactionData?.avatar, size: 70 }}>
        <Descriptions column={2}>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('PHONE_TEXT')}>
            {brokerTransactionData?.phone}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label='Email'>
            {brokerTransactionData?.email}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_EGG')}>
            {brokerTransactionData?.totalEgg}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_CHICKEN')}>
            {brokerTransactionData?.totalChicken}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_GOLDEN_EGG')}>
            {brokerTransactionData?.totalGoldenEgg}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TOTAL_SLOT')}>
            {brokerTransactionData?.totalSlot}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Tabs tabBarGutter={5} defaultActiveKey={paramSearch.tab} type='card' onChange={onChangeTab}>
        <Tabs.TabPane tab={t('HISTORY_OF_EGGS')} key='HISTORY_OF_EGGS'>
          {listEgg ? (
            <Table
              pagination={{
                total: listEgg.totalRecords,
                pageSize: DEFAULT_PAGE_SIZE,
                current: Number(paramSearch.page),
                showSizeChanger: false,
              }}
              showSorterTooltip={false}
              sortDirections={['descend']}
              dataSource={listEgg ? listEgg.data : []}
              columns={columnEgg}
              loading={loading}
              onChange={onChangeTable}
              rowKey='id'
            />
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('HISTORY_OF_CHICKEN')} key='HISTORY_OF_CHICKEN'>
          {listChicken ? (
            <>
              <Select style={{ width: 110, marginBottom: 10 }} value={paramSearch.type} onSelect={onSelectChickenType}>
                <Select.Option value={'ALL'}>{t('ALL_TEXT')}</Select.Option>
                <Select.Option value={CHICKEN_TYPE.MARS}>{CHICKEN_TYPE[1]}</Select.Option>
                <Select.Option value={CHICKEN_TYPE.JUPITER}>{CHICKEN_TYPE[2]}</Select.Option>
                <Select.Option value={CHICKEN_TYPE.VENUS}>{CHICKEN_TYPE[3]}</Select.Option>
                <Select.Option value={CHICKEN_TYPE.MERCURY}>{CHICKEN_TYPE[4]}</Select.Option>
                <Select.Option value={CHICKEN_TYPE.SATURN}>{CHICKEN_TYPE[5]}</Select.Option>
              </Select>
              <Table
                pagination={{
                  total: listChicken.totalRecords,
                  pageSize: DEFAULT_PAGE_SIZE,
                  current: Number(paramSearch.page),
                  showSizeChanger: false,
                }}
                showSorterTooltip={false}
                sortDirections={['descend']}
                dataSource={listChicken ? listChicken.data : []}
                columns={columnChicken}
                loading={loading}
                onChange={onChangeTable}
                rowKey='id'
              />
            </>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('TRANSACTION_TEXT')} key='TRANSACTION'>
          {accountTransaction ? (
            <>
              <Row gutter={[10, 10]}>
                <Col span={8}>
                  <Select
                    style={{ width: 120, marginBottom: 10, marginRight: 10 }}
                    value={paramSearch.status}
                    onSelect={onSelectTransactionStatus}>
                    <Select.Option value={'ALL'}>{t('ALL_TEXT')}</Select.Option>
                    <Select.Option value={CHICKEN_FARM_TRANSACTION_STATUS.PROCESSING}>
                      {t('PROCESSING_TEXT')}
                    </Select.Option>
                    <Select.Option value={CHICKEN_FARM_TRANSACTION_STATUS.SUCCESS}>{t('SUCCESS_TEXT')}</Select.Option>
                  </Select>
                  <Switch
                    checkedChildren={t('SELL_TEXT')}
                    unCheckedChildren={t('BUY_TEXT')}
                    checked={paramSearch.type === PLAYER_TRANSACTION_TYPE.SELLER}
                    onChange={(value) => {
                      onSelectTransactionType(value ? PLAYER_TRANSACTION_TYPE.SELLER : PLAYER_TRANSACTION_TYPE.BUYER);
                    }}
                    style={{ marginBottom: 10 }}
                  />
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title={t('TOTAL_TRANSACTION_TEXT')} value={accountTransaction.totalRecords} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={t('TOTAL_TRANSACTION_VALUE_TEXT')}
                      value={accountTransaction.totalAmount}
                      suffix='đ'
                    />
                  </Card>
                </Col>
              </Row>
              <Table
                pagination={{
                  total: accountTransaction.totalRecords,
                  pageSize: DEFAULT_PAGE_SIZE,
                  current: Number(paramSearch.page),
                  showSizeChanger: false,
                }}
                showSorterTooltip={false}
                sortDirections={['descend']}
                dataSource={accountTransaction ? accountTransaction.data : []}
                columns={columnsTransaction}
                loading={loading}
                onChange={onChangeTable}
                rowKey='id'
              />
            </>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
      </Tabs>
      {renderModal}
    </Card>
  );
};

export default Index;
