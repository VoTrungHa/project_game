/* eslint-disable react/display-name */
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Checkbox, Form, Input, message, Modal, Select, Table, Typography } from 'antd';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Textlink } from 'components/Textlink';
import { DAILY_LUCKY_WHEEL_TYPE, DAILY_LUCKY_WHEEL_TYPE_UNIT } from 'constants/index';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDailySpin } from './duck/thunks';

const { SATOSHI, PAYMENT, NONE } = DAILY_LUCKY_WHEEL_TYPE;

interface IModalState {
  type: 'Add' | 'Edit';
  data?: ISpinItem;
  isOpen: boolean;
  limit: number;
}

const Index: React.FC = () => {
  const idTypeNone = useRef('');
  const { t } = useTranslation();
  const [formDaily] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.spin);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useDidMount(() => {
    dispatch(getDailySpin());
  });

  useEffect(() => {
    if (!modalState) {
      formDaily.resetFields();
    }
  }, [formDaily, modalState]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      idTypeNone.current = data.find((item) => item.type === NONE)?.id || '';
    }
  }, [data, loading]);

  const checkValue = useCallback(
    (_, value: string | number) => {
      const valueInput = String(value).replace(/,/gi, '');
      if (Number(valueInput) > 100) {
        return Promise.reject(new Error(t('LIMIT_NUMBER_SPIN_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (value: string) => (
        <Typography.Text
          style={{ cursor: 'pointer' }}
          copyable
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
      render: (value: string, record: ISpinItem) => {
        const total = data.reduce((acc: number, cur: ISpinItem) => {
          acc += cur.id === idTypeNone.current ? 0 : cur.rate;
          return acc;
        }, 0);

        return (
          <Textlink
            text={value}
            onClick={() =>
              onOpenModal({
                type: 'Edit',
                isOpen: true,
                data: record,
                limit: 100 - total + record.rate,
              })
            }
          />
        );
      },
    },
    {
      title: t('RATE_WHEEL_TEXT'),
      dataIndex: 'rate',
      key: 'rate',
      render: (value: string) =>
        `${parseFloat(value)
          .toFixed(5)
          .replace(/(\.0*|(?<=(\..*))0*)$/, '')}`,
    },
    {
      title: t('TYPE_TEXT'),
      dataIndex: 'type',
      key: 'type',
      render: (value: DAILY_LUCKY_WHEEL_TYPE) => `${DAILY_LUCKY_WHEEL_TYPE[value]}`,
    },
    {
      title: t('REWARD_TEXT'),
      dataIndex: 'reward',
      key: 'reward',
      render: (value: string, record: ISpinItem) =>
        `${value}${record.type ? DAILY_LUCKY_WHEEL_TYPE_UNIT[record.type] : ''}`,
    },
    {
      title: t('APPROVAL_TEXT'),
      dataIndex: 'approval',
      key: 'approval',
      render: (value: boolean) => (
        <>
          {value ? (
            <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ fontSize: 20, color: 'red' }} />
          )}
        </>
      ),
    },
  ];

  const onOpenModal = (payload: IModalState) => setModalState(payload);
  const onCloseModal = () => setModalState(undefined);

  const onChangeSelect = useCallback(
    (value: number) => {
      setModalState((prev) => {
        if (prev && prev.data) {
          return { ...prev, data: { ...prev.data, type: value } };
        }
      });
      if (value === 3) {
        formDaily.setFields([{ name: 'reward', value: '0' }]);
      }
      if (value !== 2) {
        formDaily.setFields([{ name: 'reward', errors: [] }]);
      }
    },
    [formDaily],
  );

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Edit') {
      formDaily.submit();
    }
  }, [formDaily, modalState]);

  const onFinishForm = useCallback(
    async (values, remain: number) => {
      if (!modalState || !modalState.data) return;
      const reward = values.reward.replace(/,/g, '');
      const payload = data.map((item) => {
        if (item.id === modalState.data?.id) {
          return {
            ...values,
            id: modalState.data?.id,
            rate: values.rate ? Number(values.rate) : 0,
            reward: values.reward ? Number(reward) : 0,
          };
        } else {
          return {
            id: item.id,
            rate: item.id === idTypeNone.current ? remain : item.rate ? Number(item.rate) : 0,
            type: item.type,
            title: item.title,
            reward: item.reward ? Number(item.reward) : 0,
            approval: item.approval,
          };
        }
      });

      try {
        await SystemConfigAPI.UPDATE_DAILY_SPIN({ configs: payload });
        dispatch(getDailySpin());
        message.success(t('UPDATE_DAILY_SPIN_SUCCESS'));
        onCloseModal();
      } catch (error) {
        message.error(t('UPDATE_DAILY_SPIN_ERROR'));
      }
    },
    [data, dispatch, modalState, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState || !modalState.data) return null;

    if (modalState.type === 'Edit') {
      return (
        <Modal
          title={t('EDIT_TEXT')}
          centered
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_UPDATE')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          width={650}
          visible={modalState.isOpen}>
          <Form
            form={formDaily}
            onFinish={(values) => onFinishForm(values, Number(modalState.limit) - Number(values.rate))}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFieldsChange={(currents) => {
              const currentField = currents[0];
              if (currentField.name[0] === 'rate' && Number(currentField.value) > modalState.limit) {
                formDaily.setFields([{ name: 'rate', value: modalState.limit }]);
              }
            }}>
            <Form.Item
              name='title'
              label={t('TITLE_TEXT')}
              initialValue={modalState.data.title}
              rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name='rate'
                  label={t('RATE_WHEEL_TEXT')}
                  rules={[{ required: true, message: t('COMMON_RATE_REQUIRED_ERROR') }, { validator: checkValue }]}
                  initialValue={modalState.data.rate}>
                  <InputNumber
                    isUnit={`${t('UNIT_TEXT')}: %`}
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator
                    readOnly={modalState.data.id === idTypeNone.current}
                    decimalScale={5}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='type'
                  label={t('TYPE_TEXT')}
                  initialValue={modalState.data ? modalState.data.type : SATOSHI}>
                  <Select onChange={onChangeSelect} disabled={modalState.data.id === idTypeNone.current}>
                    <Select.Option value={SATOSHI}>{DAILY_LUCKY_WHEEL_TYPE[1]}</Select.Option>
                    <Select.Option value={PAYMENT}>{DAILY_LUCKY_WHEEL_TYPE[2]}</Select.Option>
                    <Select.Option value={NONE}>{DAILY_LUCKY_WHEEL_TYPE[3]}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='reward'
                  label={t('REWARD_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_REWARD_REQUIRED_ERROR') },
                    modalState.data?.type === 2 ? { validator: checkValue } : {},
                  ]}
                  initialValue={`${modalState.data.reward}`}>
                  <InputNumber
                    readOnly={modalState.data.type === 3}
                    isUnit={`${t('UNIT_TEXT')}: ${
                      modalState.data && DAILY_LUCKY_WHEEL_TYPE_UNIT[modalState.data.type]
                    }`}
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator
                    decimalScale={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name='approval'
              valuePropName='checked'
              label={t('APPROVAL_TEXT')}
              initialValue={modalState.data.approval}
              labelAlign='left'
              labelCol={{ span: 4 }}>
              <Checkbox />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [checkValue, formDaily, modalState, onChangeSelect, onFinishForm, onSubmitModal, t]);

  return (
    <Card>
      <Table
        pagination={false}
        showSorterTooltip={false}
        loading={loading}
        sortDirections={['descend']}
        dataSource={data}
        columns={columns}
        rowKey='id'
        scroll={{ x: 700 }}
      />
      {renderModal}
    </Card>
  );
};

export default Index;
