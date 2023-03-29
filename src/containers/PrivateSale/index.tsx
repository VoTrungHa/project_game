/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { ChickenSaleAPI } from 'apis/chickensale';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Status } from 'components/Status';
import { CHICKEN_GENDER, DEFAULT_PAGE_SIZE, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatMoment, FORMAT_MOMENT, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
import { addToGoldenEgg, deleteToGoldenEgg, resetToGoldenEgg, updateToGoldenEgg } from './duck/actions';
import { getList } from './duck/thunks';

interface IModalState {
  type: 'Add' | 'Edit';
  isOpen: boolean;
  data?: IReferralCounterItem;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t } = useTranslation();
  const inputSearchRef = useRef<Input | null>(null);
  const params: IMobileUserAccountRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState(params);
  const history = useHistory();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const dispatch = useAppDispatch();
  const {
    privateSale: { dataWithAmount, data, totalRecords, loading },
  } = useAppSelector((state) => state);
  const [errorField, setErrorField] = useState({});
  const [errorFromServer, setErrorFromServer] = useState<Array<{ accountId: string; totalRemainingSlots: number }>>([]);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, modalState, formEdit]);

  useEffect(() => {
    dispatch(getList(paramSearch));
    history.push({ pathname: PATH.PRIVATESALE, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.PRIVATESALE);
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

  const warningBeforeSending = useCallback(
    () =>
      Modal.warning({
        title: t('SENDING_LIST_CONTAIN_INVALID_VALUE'),
        content: t('PROMPT_BEFORE_SENDING'),
      }),
    [t],
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

  const deleteItemToReward = useCallback(
    (item: IReferralCounterItem) => {
      dispatch(deleteToGoldenEgg(item));
    },
    [dispatch],
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

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        const payload = {
          ...values,
          accounts: dataWithAmount.map((item) => ({ accountId: item.id, quantity: item.amount })),
        };
        try {
          const res = await ChickenSaleAPI.BONUS_GOLDEN(payload);
          if (res.status) {
            message.success(t('ADD_GOLDEN_EGG_SUCCESS'));
            onChangeModal(undefined);
            setErrorFromServer([]);
            dispatch(resetToGoldenEgg());
            onClearFilter();
          }
        } catch (error: any) {
          setErrorFromServer(error.response.data.message[0].data);
          message.error(t('ADD_GOLDEN_EGG_ERROR'));
          onChangeModal(undefined);
        }
      }
      if (modalState.type === 'Edit') {
        const amountAsNumber =
          typeof values.amount === 'number' ? values.amount : Number(values.amount.replaceAll(',', ''));
        const payload = {
          ...modalState.data,
          amount: amountAsNumber,
        };
        const remainSlot = await ChickenSaleAPI.CHECK_REMAINING_SLOT(modalState.data!.id);
        if (amountAsNumber > remainSlot.totalRemainingSlots) {
          formEdit.setFields([
            {
              name: 'amount',
              errors:
                remainSlot.totalRemainingSlots === 0
                  ? [t('OUT_OF_SLOT')]
                  : [`${t('ONLY_CERTAIN_SLOT')} ${remainSlot.totalRemainingSlots} slot`],
            },
          ]);
        } else {
          dispatch(addToGoldenEgg(payload));
          onChangeModal(undefined);
        }
      }
    },
    [modalState, dataWithAmount, t, onChangeModal, dispatch, onClearFilter, formEdit],
  );

  const checkValue = useCallback(
    (_, amount: number) => {
      if (!amount) {
        return Promise.reject(new Error(t('COMMON_AMOUNT_REQUIRED_ERROR')));
      }
      const amountAsString = String(amount);
      const num = Number(amountAsString.replaceAll(',', ''));
      if (num > 100) {
        return Promise.reject(new Error(t('EXCEED_AMOUNT_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
  );
  const checkErrorBeforeSending = useCallback(
    (item, amount: number) => {
      if (!amount) {
        if (!errorField[item.field]) {
          setErrorField((prev) => ({ ...prev, [item.field]: true }));
        }
        return Promise.reject(new Error(t('COMMON_AMOUNT_REQUIRED_ERROR')));
      }
      const amountAsString = String(amount);
      const num = Number(amountAsString.replaceAll(',', ''));
      if (num > 100) {
        if (!errorField[item.field]) {
          setErrorField((prev) => ({ ...prev, [item.field]: true }));
        }
        return Promise.reject(new Error(t('EXCEED_AMOUNT_ERROR')));
      }
      if (errorField[item.field]) {
        setErrorField((prev) => ({ ...prev, [item.field]: false }));
      }
      return Promise.resolve();
    },
    [errorField, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          title={t('GOLDEN_EGG')}
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_SEND')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          width={800}
          visible={modalState.isOpen}>
          <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              name='reason'
              label={t('REASON_TEXT')}
              rules={[{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
            <Form.Item name='type' label={t('TYPE_CHICKEN_TEXT')} initialValue={CHICKEN_GENDER.HEN}>
              <Select>
                <Select.Option value={CHICKEN_GENDER.HEN}>{t('HEN_TEXT')}</Select.Option>
                <Select.Option value={CHICKEN_GENDER.ROOSTER}>{t('ROOSTER_TEXT')}</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'Edit') {
      return (
        <Modal
          title={t('UPDATE_AMOUNT')}
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_SEND')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          width={600}
          visible={modalState.isOpen}>
          <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              wrapperCol={{ span: 16 }}
              name='amount'
              label={t('AMOUNT_TEXT')}
              rules={[{ validator: checkValue }]}>
              <InputNumber allowNegative={false} allowLeadingZeros={false} thousandSeparator decimalScale={0} />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [checkValue, formAdd, formEdit, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

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
            disabled={dataWithAmount.length === 0}
            onClick={() => {
              if (Object.values(errorField).includes(true)) {
                warningBeforeSending();
              } else {
                onChangeModal({ isOpen: true, type: 'Add' });
              }
            }}
            type='primary'>
            {t('SEND_THIS_LIST')}
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
                      disabled={dataWithAmount.findIndex((item) => item.id === record.id) !== -1}
                      type='primary'
                      onClick={() => {
                        onChangeModal({ data: record, isOpen: true, type: 'Edit' });
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
            dataSource={dataWithAmount}
            bordered
            columns={
              [
                ...columnsAccount,
                {
                  title: t('AMOUNT_TEXT'),
                  dataIndex: 'amount',
                  key: 'amount',
                  width: 200,
                  render: (value: number, record: IMobileUserAccount) => {
                    const [formCell] = Form.useForm();
                    errorFromServer.forEach((item) => {
                      if (item.accountId === record.id) {
                        formCell.setFields([
                          {
                            name: record.id,
                            errors:
                              item.totalRemainingSlots === 0
                                ? [t('OUT_OF_SLOT')]
                                : [`${t('ONLY_CERTAIN_SLOT')} ${item.totalRemainingSlots} slot`],
                          },
                        ]);
                      }
                    });
                    const onFinishFormCell = useCallback(
                      (values) => {
                        const amount =
                          typeof values[record.id] === 'string'
                            ? Number(values[record.id].replaceAll(',', ''))
                            : values[record.id];
                        dispatch(updateToGoldenEgg({ id: record.id, value: amount }));
                      },
                      [record.id],
                    );
                    return (
                      <Form form={formCell} onFinish={onFinishFormCell}>
                        <Form.Item
                          initialValue={value}
                          name={record.id}
                          rules={[{ validator: checkErrorBeforeSending }]}>
                          <NumberFormat
                            customInput={Input}
                            allowNegative={false}
                            allowLeadingZeros={false}
                            thousandSeparator
                            decimalScale={0}
                            onBlur={() => formCell.submit()}
                          />
                        </Form.Item>
                      </Form>
                    );
                  },
                },
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
