/* eslint-disable react/display-name */
import { Button, Form, Input, message, Popconfirm, Select, Table, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { SatoshiGameAPI } from 'apis/satoshigame';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Textlink } from 'components/Textlink';
import { STATUS_EVENT_CONFIG } from 'constants/index';
import { getAllEvent } from 'containers/SatoshiGame/duck/thunks';
import { formatMoment, formatter, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Add' | 'Edit';
  data?: ISatoshiGameItem;
  isOpen: boolean;
}

const Game = () => {
  const { t } = useTranslation();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  const dispatch = useAppDispatch();
  const {
    satoshiGame: { loading, eventGame },
  } = useAppSelector((state) => state);

  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      dispatch(getAllEvent());
    }
  }, [dispatch, formAdd, formEdit, modalState]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [formAdd, formEdit, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        try {
          const res = await SatoshiGameAPI.ADD_EVENT({
            ...values,
            totalAmount: values.totalAmount.replaceAll(',', ''),
          });
          if (res.currency.id) {
            message.success(t('COMMON_ADD_REWARD_GAME_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error) {
          message.error(t('COMMON_ADD_REWARD_GAME_ERROR'));
        }
      }
      if (modalState.type === 'Edit') {
        if (!modalState.data) return;
        const totalAmount =
          typeof values.totalAmount === 'number' ? values.totalAmount : values.totalAmount.replaceAll(',', '');
        try {
          const res = await SatoshiGameAPI.UPDATE_EVENT({
            id: modalState.data.id,
            ...values,
            totalAmount,
          });
          if (res.id) {
            message.success(t('UPDATE_EVENT_SUCCESS'));
          }
        } catch (error) {
          message.error(t('UPDATE_EVENT_ERROR'));
        }
        onChangeModal(undefined);
      }
    },
    [modalState, onChangeModal, t],
  );

  const onEditUser = useCallback(
    async (record: ISatoshiGameItem) => {
      onChangeModal({
        isOpen: true,
        type: 'Edit',
        data: undefined,
      });
      try {
        const res = await SatoshiGameAPI.GET_DETAIL_BY_ID(record.id);
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: res,
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

  const onDeleteEvent = useCallback(
    async (id?: string) => {
      if (!id) return;
      try {
        const res = await SatoshiGameAPI.DELETE_BY_ID(id);
        if (res.status) {
          onChangeModal(undefined);
          message.success(t('DELETE_EVENT_SUCCESS'));
        }
      } catch (error) {
        message.error(t('DELETE_EVENT_ERROR'));
      }
    },
    [onChangeModal, t],
  );

  const onUpdateStatus = useCallback(
    async ({ id, status }: { id: string; status: string }) => {
      try {
        const res = await SatoshiGameAPI.UPDATE_EVENT_STATUS({ id, status });
        if (res.status) {
          message.success(t('UPDATE_EVENT_STATUS_SUCCESS'));
          dispatch(getAllEvent());
        }
      } catch (error) {
        message.error(t('UPDATE_EVENT_STATUS_ERROR'));
      }
    },
    [dispatch, t],
  );
  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Add') {
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_ADD')}
          onOk={onSubmitModal}
          width={800}
          centered
          visible={modalState.isOpen}
          title={t('MENU_SATOSHI_GAME')}
          onCancel={() => onChangeModal(undefined)}>
          <Form onFinish={onFinishForm} form={formAdd} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='time'
                  label={t('TIME_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TIME_REQUIRED_ERROR') }]}>
                  <InputNumber decimalScale={0} isUnit={`${t('UNIT_TEXT')}: ${t('MINUTE_TEXT')}`} />
                </Form.Item>
                <Form.Item
                  name='totalAmount'
                  label={t('TOTAL_AMOUNT_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TOTAL_AMOUNT_REQUIRED_ERROR') }]}>
                  <InputNumber thousandSeparator decimalScale={0} isUnit={`${t('UNIT_TEXT')}: Satoshi`} />
                </Form.Item>
                <Form.Item
                  name='reward'
                  label={t('REWARD_GAME_TEXT')}
                  required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const inputValue = String(getFieldValue('totalAmount')).replaceAll(',', '');
                        if (Number(inputValue) % Number(value) !== 0 || Number(value) < 10) {
                          return Promise.reject(t('COMMON_REWARD_GAME_REQUIRED_ERROR'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <InputNumber decimalScale={0} isUnit={`${t('UNIT_TEXT')}: Satoshi`} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'Edit') {
      return (
        <Modal
          width={800}
          centered
          visible={modalState.isOpen}
          title={t('MENU_SATOSHI_GAME')}
          onCancel={() => onChangeModal(undefined)}
          className='ant-modal-users'
          footer={[
            <Popconfirm
              key='delete'
              onConfirm={() => onDeleteEvent(modalState.data?.id)}
              title={t('COMMON_PROMPT_DELETE_EVENT')}
              okText={t('COMMON_BUTTON_DELETE')}
              cancelText={t('COMMON_BUTTON_CANCEL')}>
              <Button type='primary' danger>
                {t('DELETE_EVENT_BUTTON')}
              </Button>
            </Popconfirm>,
            <div key='cancel-update'>
              <Button key='cancel' onClick={() => onChangeModal(undefined)}>
                {t('COMMON_BUTTON_CLOSE')}
              </Button>
              <Button type='primary' key='update' onClick={onSubmitModal}>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </div>,
          ]}>
          {modalState.data ? (
            <Form onFinish={onFinishForm} form={formEdit} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name='title'
                    initialValue={modalState.data.title}
                    label={t('TITLE_TEXT')}
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='time'
                    initialValue={modalState.data.time}
                    label={t('TIME_TEXT')}
                    rules={[{ required: true, message: t('COMMON_TIME_REQUIRED_ERROR') }]}>
                    <InputNumber decimalScale={0} isUnit={`${t('UNIT_TEXT')}: ${t('MINUTE_TEXT')}`} />
                  </Form.Item>
                  <Form.Item
                    name='totalAmount'
                    initialValue={modalState.data.totalAmount}
                    label={t('TOTAL_AMOUNT_TEXT')}
                    rules={[{ required: true, message: t('COMMON_TOTAL_AMOUNT_REQUIRED_ERROR') }]}>
                    <InputNumber thousandSeparator decimalScale={0} isUnit={`${t('UNIT_TEXT')}: Satoshi`} />
                  </Form.Item>
                  <Form.Item
                    name='reward'
                    initialValue={modalState.data.reward}
                    label={t('REWARD_GAME_TEXT')}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const inputValue = String(getFieldValue('totalAmount')).replaceAll(',', '');
                          if (Number(inputValue) % Number(value) !== 0 || Number(value) < 10) {
                            return Promise.reject(t('COMMON_REWARD_GAME_REQUIRED_ERROR'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <InputNumber decimalScale={0} isUnit={`${t('UNIT_TEXT')}: Satoshi`} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            '...loading'
          )}
        </Modal>
      );
    }
  }, [formAdd, formEdit, modalState, onChangeModal, onDeleteEvent, onFinishForm, onSubmitModal, t]);

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
      render: (value: string, record: ISatoshiGameItem) => (
        <>
          {record.status === STATUS_EVENT_CONFIG.NEW ? (
            <Textlink text={value} onClick={() => onEditUser(record)} />
          ) : (
            <Typography.Text type={record.status === STATUS_EVENT_CONFIG.RUNNING ? 'success' : 'danger'}>
              {value}
            </Typography.Text>
          )}
          <br />
          <Typography.Text style={{ color: 'gray', fontStyle: 'italic' }}>
            ({t('GET_TEXT')} {record.reward} Sat {t('EVERY_TEXT')} {formatter.format(record.time)} {t('MINUTES_TEXT')})
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('TOTAL_AMOUNT_TEXT'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (value: string) => formatter.format(Number(value)),
    },
    {
      title: t('TOTAL_PAID_TEXT'),
      dataIndex: 'totalPaid',
      key: 'totalPaid',
      render: (value: string) => formatter.format(Number(value)),
    },
    {
      title: t('CREATED_EVENT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (value: STATUS_EVENT_CONFIG, record: ISatoshiGameItem) => {
        const isDisable =
          eventGame.some((item) => item.status === STATUS_EVENT_CONFIG.RUNNING) &&
          record.status !== STATUS_EVENT_CONFIG.RUNNING;
        return (
          <Select
            onClick={() =>
              isDisable && record.status !== STATUS_EVENT_CONFIG.FINISH
                ? message.warn(t('RUNNING_EVENT_ERROR'))
                : () => {}
            }
            onSelect={(value) => onUpdateStatus({ id: record.id, status: value })}
            style={{ minWidth: 100 }}
            disabled={value === STATUS_EVENT_CONFIG.FINISH}
            defaultValue={value}>
            <Select.Option disabled value={STATUS_EVENT_CONFIG.NEW}>
              {STATUS_EVENT_CONFIG.NEW}
            </Select.Option>
            <Select.Option
              disabled={value === STATUS_EVENT_CONFIG.RUNNING || isDisable}
              value={STATUS_EVENT_CONFIG.RUNNING}>
              {STATUS_EVENT_CONFIG.RUNNING}
            </Select.Option>
            <Select.Option disabled={isDisable} value={STATUS_EVENT_CONFIG.FINISH}>
              {STATUS_EVENT_CONFIG.FINISH}
            </Select.Option>
          </Select>
        );
      },
    },
  ];
  return (
    <>
      <Row gutter={[5, 10]}>
        <Col span={24} textAlign='right'>
          <Button onClick={() => onChangeModal({ isOpen: true, type: 'Add' })} type='primary'>
            {t('COMMON_BUTTON_ADD_EVENT')}
          </Button>
        </Col>
      </Row>
      <Table
        pagination={false}
        showSorterTooltip={false}
        sortDirections={['descend']}
        dataSource={eventGame}
        loading={loading}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      {renderModal}
    </>
  );
};

export default Game;
