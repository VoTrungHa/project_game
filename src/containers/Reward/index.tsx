/* eslint-disable react/display-name */
import { Button, Card, Divider, Form, Input, message, Modal, Table, TablePaginationConfig, Typography } from 'antd';
import { StatisticAPI } from 'apis/statistic';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Status } from 'components/Status';
import { DEFAULT_PAGE_SIZE, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import { addToReward, deleteToReward, resetReward } from 'containers/Statistic/duck/actions';
import { getListReward } from 'containers/Statistic/duck/thunks';
import { formatMoment, FORMAT_MOMENT, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberFormatValues } from 'react-number-format';
import { useHistory } from 'react-router-dom';

interface IModalState {
  type: 'Add';
  isOpen: boolean;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const Index: React.FC = () => {
  const { t } = useTranslation();
  const inputSearchRef = useRef<Input | null>(null);
  const params: IMobileUserAccountRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState(params);
  const history = useHistory();
  const [formAdd] = Form.useForm();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const dispatch = useAppDispatch();
  const {
    referralCounter: { data, totalRecords, loading, rewardData },
  } = useAppSelector((state) => state);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
    }
  }, [formAdd, modalState]);

  useEffect(() => {
    dispatch(getListReward(paramSearch));
    history.push({ pathname: PATH.REWARD, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.REWARD);
  }, [history]);

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      if (Number(paramSearch.page) === pagination.current) return;
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current,
        }));
      }
    },
    [paramSearch.page],
  );

  const onSearchInput = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (keyword) {
        setParamSearch((prev) => ({
          ...prev,
          keyword,
          page: 1,
        }));
      } else {
        onClearFilter();
      }
    },
    [onClearFilter],
  );

  const addItemToReward = useCallback(
    (item: IReferralCounterItem) => {
      dispatch(addToReward(item));
    },
    [dispatch],
  );

  const deleteItemToReward = useCallback(
    (item: IReferralCounterItem) => {
      dispatch(deleteToReward(item));
    },
    [dispatch],
  );

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
  }, [formAdd, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        try {
          const res = await StatisticAPI.BONUS_ACCOUNT({
            title: values.title,
            amount: values.amount,
            reason: values.reason,
            users: rewardData.map((item) => item.id),
          });
          if (res.status) {
            message.success(t('COMMON_ADD_REWARD_SUCCESS'));
            setModalState(undefined);
            dispatch(resetReward());
            onClearFilter();
          }
        } catch (error) {
          message.error(t('COMMON_ADD_REWARD_ERROR'));
        }
      }
    },
    [dispatch, modalState, onClearFilter, rewardData, t],
  );

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          title={t('MENU_REWARD')}
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_SEND')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          width={800}
          visible={modalState.isOpen}>
          <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              name='title'
              label={t('TITLE_TEXT')}
              rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name='reason'
              label={t('REASON_TEXT')}
              rules={[{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 16 }}
              name='amount'
              label={t('VALUE_TEXT')}
              rules={[{ required: true, message: t('COMMON_VALUE_REQUIRED_ERROR') }]}>
              <InputNumber
                allowNegative={false}
                allowLeadingZeros={false}
                decimalScale={0}
                isAllowed={({ value }: NumberFormatValues) => {
                  if (Number(value) <= 10000000) return true;
                  return false;
                }}
                isUnit={`${t('UNIT_TEXT')}: Satoshi`}
              />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [formAdd, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

  const columnsAccount = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
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
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span>{email || '--'}</span>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string) => value || '--',
    },
    {
      title: t('ROLE_TEXT'),
      dataIndex: 'isPartner',
      key: 'isPartner',
      render: (value: boolean) => (value ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')),
    },
    {
      title: t('VERIFY_KYC_TEXT'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (value: number) =>
        value === STATUS_KYC.APPROVED ? (
          <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>
        ) : (
          <Typography.Text type='warning'>{t('NON_APPROVED_TEXT')}</Typography.Text>
        ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={!!status} />,
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
      <Row gutter={10}>
        <Col xs={24} md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_TEXT')}
            allowClear
          />
        </Col>
        <Col xs={24} md={12} textAlign='right'>
          <Button
            disabled={rewardData.length === 0}
            onClick={() => {
              if (rewardData.length > 0) {
                onChangeModal({ isOpen: true, type: 'Add' });
              }
            }}
            type='primary'>
            {t('COMMON_BUTTON_REWARD')}
          </Button>
        </Col>
      </Row>
      <br />
      <Row gutter={10}>
        <Col>
          <Table
            pagination={{
              total: totalRecords,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page) || 1,
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            onChange={onChangeTable}
            bordered
            loading={loading}
            dataSource={data}
            columns={
              [
                ...columnsAccount,
                {
                  key: 'operation',
                  fixed: 'right',
                  width: 100,
                  render: (_, record: IReferralCounterItem) => (
                    <Button
                      disabled={record.isDisabled || rewardData.findIndex((item) => item.id === record.id) !== -1}
                      type='primary'
                      onClick={() => {
                        if (record.isDisabled) return;
                        addItemToReward(record);
                      }}>
                      {t('COMMON_BUTTON_ADD')}
                    </Button>
                  ),
                },
              ] as any
            }
            scroll={{ x: 1200, y: 400 }}
            rowKey='id'
          />
        </Col>
      </Row>
      <Divider orientation='left'>{t('SENDING_LIST')}</Divider>
      <Row>
        <Col>
          <Table
            showSorterTooltip={false}
            pagination={false}
            dataSource={rewardData}
            bordered
            columns={
              [
                ...columnsAccount,
                {
                  key: 'operation',
                  fixed: 'right',
                  width: 80,
                  render: (_, record: IReferralCounterItem) => (
                    <Button type='primary' danger onClick={() => deleteItemToReward(record)}>
                      {t('COMMON_BUTTON_DELETE')}
                    </Button>
                  ),
                },
              ] as any
            }
            scroll={{ x: 1200, y: 400 }}
            rowKey='id'
          />
        </Col>
      </Row>
      {renderModal}
    </Card>
  );
};

export default Index;
