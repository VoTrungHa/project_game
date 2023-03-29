/* eslint-disable react/display-name */
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Statistic,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { ChickenSaleAPI } from 'apis/chickensale';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Textlink } from 'components/Textlink';
import { CHICKEN_FARM_EGG_EVENT_STATUS, CHICKEN_GENDER, DEFAULT_PAGE_SIZE } from 'constants/index';
import {
  formatter,
  FORMAT_MOMENT,
  isAfter,
  isSame,
  Moment,
  parseGetUnixTime,
  parseGetUnixTimeValue,
  parseGetUnixTimeValueAddMinutes,
  parseTime,
  standardizeMoment,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListSchedule } from './duck/thunks';

const { DATE_TIME_SHORT, DATE_TIME_LONG, DATE_TIME_SLASH_SHORT, TIME_SHORT } = FORMAT_MOMENT;

interface IModalState {
  type: 'Add' | 'Edit';
  data?: IScheduleItem;
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    saleSchedule: { data, totalRecords, loading, page },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState({ page: 1, size: DEFAULT_PAGE_SIZE });
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      dispatch(getListSchedule(paramSearch));
    }
  }, [dispatch, formAdd, formEdit, modalState, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (!modalState) return;

      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }

      if (modalState.data && modalState.data.timeStart) {
        if (isSame(parseTime(time, DATE_TIME_SHORT), parseTime(modalState.data.timeStart, DATE_TIME_SHORT))) {
          return Promise.resolve();
        }
        const now = parseTime(parseGetUnixTime(), DATE_TIME_LONG);
        const value = parseTime(time, DATE_TIME_LONG);
        const compare = isAfter(value, now);
        if (!compare) {
          return Promise.reject(new Error(t('START_MUST_BE_GREATER_THAN_NOW')));
        }
      }

      return Promise.resolve();
    },
    [modalState, t],
  );

  const checkValueTotal = useCallback(
    (_, total: number) => {
      const totalAsString = String(total);
      if (!totalAsString || !Number(totalAsString.replaceAll(',', ''))) {
        return Promise.reject(new Error(t('COMMON_TOTAL_EGG_REQUIRED_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
  );

  const checkValueLimitPerBuy = useCallback(
    (_, limit: number) => {
      const limitAsString = String(limit);
      if (!limitAsString || !Number(limitAsString.replaceAll(',', ''))) {
        return Promise.reject(new Error(t('LIMIT_PER_BUY_REQUIRED_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
  );

  const checkValuePriceEgg = useCallback(
    (_, price: number) => {
      if (!price) {
        return Promise.reject(new Error(t('COMMON_PRICE_EGG_REQUIRED_ERROR')));
      }
      const priceAsString = String(price);
      const num = Number(priceAsString.replaceAll(',', ''));
      if (num < 1000 || num > 1000000) {
        return Promise.reject(new Error(t('PRICE_EGG_VALIDATE_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
  );

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [formAdd, modalState, formEdit]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      const payload = {
        title: values.title,
        price: typeof values.price === 'string' ? Number(values.price.replaceAll(',', '')) : values.price,
        totalEgg: typeof values.totalEgg === 'string' ? Number(values.totalEgg.replaceAll(',', '')) : values.totalEgg,
        limitPerBuy:
          typeof values.limitPerBuy === 'string' ? Number(values.limitPerBuy.replaceAll(',', '')) : values.limitPerBuy,
        timeStart: parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
        timeEnd: parseGetUnixTimeValue(values.timeEnd),
        type: values.type,
      };
      if (modalState.type === 'Add') {
        try {
          const res = await ChickenSaleAPI.ADD_SCHEDULE(payload);
          if (res.id) {
            message.success(t('ADD_SCHEDULE_SUCCESS'));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }

      if (modalState.type === 'Edit') {
        if (!modalState.data) return;
        try {
          const res = await ChickenSaleAPI.UPDATE_SCHEDULE({
            ...payload,
            id: modalState.data.id,
            timeStart: isSame(values.timeStart, parseTime(modalState.data.timeStart, DATE_TIME_SHORT))
              ? undefined
              : payload.timeStart,
            timeEnd: isSame(values.timeEnd, parseTime(modalState.data.timeEnd, DATE_TIME_SHORT))
              ? undefined
              : payload.timeEnd,
          });
          if (res.id) {
            message.success(t('UPDATE_SCHEDULE_SUCCESS'));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [modalState, t],
  );

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onUpdateStatus = useCallback(
    async ({ id, status }: { id: string; status: string }) => {
      try {
        const res = await ChickenSaleAPI.UPDATE_STATUS({ id, status: Number(status) });
        if (res.status) {
          message.success(t('UPDATE_EVENT_STATUS_SUCCESS'));
          dispatch(getListSchedule({ page: 1, size: DEFAULT_PAGE_SIZE }));
        }
      } catch (error) {
        message.error(t('UPDATE_EVENT_STATUS_ERROR'));
      }
    },
    [dispatch, t],
  );

  const onEditUser = useCallback(
    async (record: IScheduleItem) => {
      onChangeModal({
        isOpen: true,
        type: 'Edit',
      });
      try {
        const res = await ChickenSaleAPI.GET_DETAIL_BY_ID(record.id);
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: { ...res, type: record.type },
        });
      } catch (error) {
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: record,
        });
      }
    },
    [onChangeModal],
  );

  const onDeleteSchedule = useCallback(
    async (id?: string) => {
      if (!id) return;
      try {
        const res = await ChickenSaleAPI.DELETE_BY_ID(id);
        if (res.status) {
          onChangeModal(undefined);
          message.success(t('DELETE_SCHEDULE_SUCCESS'));
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [onChangeModal, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={1000}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_ADD')}
          title={t('ADD_SCHEDULE')}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          onCancel={() => onChangeModal(undefined)}>
          <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item required rules={[{ validator: checkValueStart }]} name='timeStart' label={t('TIME_START')}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  required
                  name='timeEnd'
                  label={t('TIME_END')}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }
                        const start = parseTime(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = parseTime(time, DATE_TIME_LONG);
                        const compare = isAfter(end, start);
                        if (!compare) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item name='totalEgg' label={t('TOTAL_EGG')} rules={[{ validator: checkValueTotal }]}>
                  <InputNumber allowNegative={false} thousandSeparator decimalScale={0} />
                </Form.Item>
                <Form.Item
                  name='limitPerBuy'
                  initialValue='1'
                  label={t('LIMIT_EGG_EVERY_TIME')}
                  required
                  rules={[{ validator: checkValueLimitPerBuy }]}>
                  <InputNumber decimalScale={0} />
                </Form.Item>
                <Form.Item name='type' label={t('TYPE_CHICKEN_TEXT')} initialValue={CHICKEN_GENDER.HEN}>
                  <Select>
                    <Select.Option value={CHICKEN_GENDER.HEN}>{t('HEN_TEXT')}</Select.Option>
                    <Select.Option value={CHICKEN_GENDER.ROOSTER}>{t('ROOSTER_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name='price' label={t('PRICE_EGG')} rules={[{ validator: checkValuePriceEgg }]}>
                  <InputNumber thousandSeparator decimalScale={0} isUnit={`${t('UNIT_TEXT')}: Satoshi`} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    if (modalState.type === 'Edit') {
      if (!modalState.data) {
        return '...loading';
      }
      const isDisable = modalState.data.status !== CHICKEN_FARM_EGG_EVENT_STATUS.PENDING;
      const timeStart = parseTime(modalState.data.timeStart, DATE_TIME_SHORT);
      const timeEnd = parseTime(modalState.data.timeEnd, DATE_TIME_SHORT);

      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={1000}
          title={t('UPDATE_SCHEDULE')}
          onCancel={() => onChangeModal(undefined)}
          className='ant-modal-users'
          footer={[
            <Popconfirm
              disabled={isDisable}
              key='delete'
              onConfirm={() => onDeleteSchedule(modalState.data?.id)}
              title={t('COMMON_PROMPT_DELETE_SCHEDULE')}
              okText={t('COMMON_BUTTON_DELETE')}
              cancelText={t('COMMON_BUTTON_CANCEL')}>
              <Button type='primary' danger disabled={isDisable}>
                {t('DELETE_SCHEDULE')}
              </Button>
            </Popconfirm>,
            <div key='cancel-update'>
              <Button key='cancel' onClick={() => onChangeModal(undefined)}>
                {t('COMMON_BUTTON_CLOSE')}
              </Button>
              <Button type='primary' key='update' disabled={isDisable} onClick={onSubmitModal}>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </div>,
          ]}>
          <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='title'
                  initialValue={modalState.data.title}
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input readOnly={isDisable} />
                </Form.Item>
                <Form.Item
                  initialValue={standardizeMoment(timeStart)}
                  required
                  rules={[{ validator: checkValueStart }]}
                  name='timeStart'
                  label={t('TIME_START')}>
                  <DatePicker
                    disabled={isDisable}
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  initialValue={standardizeMoment(timeEnd)}
                  required
                  name='timeEnd'
                  label={t('TIME_END')}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }
                        if (modalState.data && modalState.data.timeEnd) {
                          if (
                            isSame(
                              parseTime(time, DATE_TIME_SHORT),
                              parseTime(modalState.data.timeEnd, DATE_TIME_SHORT),
                            )
                          ) {
                            return Promise.resolve();
                          }
                        }
                        const now = parseTime(parseGetUnixTime(), DATE_TIME_LONG);
                        const start = parseTime(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = parseTime(time, DATE_TIME_LONG);
                        if (!isAfter(end, start)) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        if (!isAfter(end, now)) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_NOW')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <DatePicker
                    disabled={isDisable}
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data.totalEgg}
                  name='totalEgg'
                  label={t('TOTAL_EGG')}
                  rules={[{ validator: checkValueTotal }]}>
                  <InputNumber readOnly={isDisable} allowNegative={false} thousandSeparator decimalScale={0} />
                </Form.Item>
                <Form.Item
                  name='limitPerBuy'
                  initialValue={modalState.data.limitPerBuy}
                  label={t('LIMIT_EGG_EVERY_TIME')}
                  required
                  rules={[{ validator: checkValueLimitPerBuy }]}>
                  <InputNumber readOnly={isDisable} decimalScale={0} />
                </Form.Item>
                <Form.Item name='type' label={t('TYPE_CHICKEN_TEXT')} initialValue={modalState.data.type}>
                  <Select disabled={isDisable}>
                    <Select.Option value={CHICKEN_GENDER.HEN}>{t('HEN_TEXT')}</Select.Option>
                    <Select.Option value={CHICKEN_GENDER.ROOSTER}>{t('ROOSTER_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data.price}
                  name='price'
                  label={t('PRICE_EGG')}
                  rules={[{ validator: checkValuePriceEgg }]}>
                  <InputNumber
                    readOnly={isDisable}
                    thousandSeparator
                    decimalScale={0}
                    isUnit={`${t('UNIT_TEXT')}: Satoshi`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
          <Row>
            <Col span={6}>
              <Statistic
                title={t('STATUS_TEXT')}
                value={
                  modalState.data.status === CHICKEN_FARM_EGG_EVENT_STATUS.PENDING
                    ? `${t('PENDING_SCHEDULE_TEXT')}`
                    : modalState.data.status === CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING
                    ? `${t('RUNNING_SCHEDULE_TEXT')}`
                    : `${t('FINISH_SCHEDULE_TEXT')}`
                }
              />
            </Col>
            <Col span={6}>
              <Statistic title={t('TOTAL_EGG_SOLD')} value={modalState.data.totalSold} />
            </Col>
            <Col span={6}>
              <Statistic title={t('TOTAL_EGG_LEFT')} value={modalState.data.totalEgg - modalState.data.totalSold} />
            </Col>
            <Col span={6}>
              <Statistic title={t('BUYING_TIME')} value={modalState.data.totalSold / modalState.data.limitPerBuy} />
            </Col>
          </Row>
        </Modal>
      );
    }
  }, [
    checkValueLimitPerBuy,
    checkValuePriceEgg,
    checkValueStart,
    checkValueTotal,
    formAdd,
    formEdit,
    i18n,
    modalState,
    onChangeModal,
    onDeleteSchedule,
    onFinishForm,
    onSubmitModal,
    t,
  ]);

  const chickenTypeRunning = useMemo(() => {
    const temp = {
      HEN: false,
      ROOSTER: false,
    };
    data
      .filter((item) => Number(item.status) === CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING)
      .forEach((item) => {
        if (item.type === CHICKEN_GENDER.ROOSTER) {
          temp.ROOSTER = true;
        } else {
          temp.HEN = true;
        }
      });
    return temp;
  }, [data]);

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
      title: t('TITLE_TEXT'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (value: string, record: IScheduleItem) => {
        const type = record.status === CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING ? 'success' : 'danger';
        const isPending = record.status === CHICKEN_FARM_EGG_EVENT_STATUS.PENDING;
        return (
          <>
            <Textlink
              type={isPending ? 'normal' : type}
              text={isPending ? value : <Typography.Text type={type}>{value}</Typography.Text>}
              onClick={() => onEditUser(record)}
            />
            <br />
            <Typography.Text style={{ color: 'gray', fontStyle: 'italic' }}>
              ({t('LIMIT_EGG_TABLE')} {record.limitPerBuy} {t('EGG_TEXT')})
            </Typography.Text>
          </>
        );
      },
    },
    {
      title: t('TOTAL_EGG'),
      dataIndex: 'totalEgg',
      key: 'totalEgg',
      width: 120,
      render: (value: number) => formatter.format(value),
    },
    {
      title: t('TOTAL_EGG_SOLD'),
      dataIndex: 'totalSold',
      key: 'totalSold',
      width: 120,
      render: (value: string) => value || 0,
    },
    {
      title: t('TYPE_CHICKEN_TEXT'),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => (CHICKEN_GENDER.ROOSTER === type ? t('ROOSTER_TEXT') : t('HEN_TEXT')),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (value: string, record: IScheduleItem) => {
        const isDisable =
          chickenTypeRunning[CHICKEN_GENDER[record.type]] && Number(value) !== CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING;
        return (
          <Select
            onClick={() =>
              isDisable && Number(value) !== CHICKEN_FARM_EGG_EVENT_STATUS.FINISH
                ? message.warn(t('RUNNING_SCHEDULE_ERROR'))
                : () => {}
            }
            disabled={Number(value) === CHICKEN_FARM_EGG_EVENT_STATUS.FINISH}
            onSelect={(value) => onUpdateStatus({ id: record.id, status: value })}
            style={{ minWidth: 110 }}
            defaultValue={value}>
            <Select.Option disabled value={CHICKEN_FARM_EGG_EVENT_STATUS.PENDING}>
              {t('PENDING_SCHEDULE_TEXT')}
            </Select.Option>
            <Select.Option
              disabled={Number(value) === CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING || isDisable}
              value={CHICKEN_FARM_EGG_EVENT_STATUS.RUNNING}>
              {t('RUNNING_SCHEDULE_TEXT')}
            </Select.Option>
            <Select.Option
              disabled={isDisable || Number(value) === CHICKEN_FARM_EGG_EVENT_STATUS.PENDING}
              value={CHICKEN_FARM_EGG_EVENT_STATUS.FINISH}>
              {t('FINISH_SCHEDULE_TEXT')}
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: t('TIME_START'),
      dataIndex: 'timeStart',
      key: 'timeStart',
      render: (value: string) => parseTime(Number(value), DATE_TIME_SLASH_SHORT),
    },
    {
      title: t('TIME_END'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: (value: string) => parseTime(Number(value), DATE_TIME_SLASH_SHORT),
    },
  ];

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}></Col>
        <Col xs={24} md={12}>
          <Row justify='space-between'>
            <Col></Col>
            <Col>
              <Button onClick={() => onChangeModal({ type: 'Add', isOpen: true })} type='primary'>
                {t('ADD_SCHEDULE')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(page) || 1,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        onChange={onChangeTable}
        loading={loading}
        sortDirections={['descend']}
        dataSource={data}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
