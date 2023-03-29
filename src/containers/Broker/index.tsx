/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Modal,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { BrokerAPI } from 'apis/broker';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { DEFAULT_PAGE_SIZE, STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE } from 'constants/role';
import {
  formatMoment,
  formatter,
  FORMAT_MOMENT,
  isEditable,
  parseObjectToParam,
  parseParamToObject,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getListBroker, getListCurrency } from './duck/thunks';
interface IModalState {
  type: 'Edit' | 'Add';
  isOpen: boolean;
  data?: IBrokerItem;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const Index: React.FC = () => {
  const { t } = useTranslation();
  const inputSearchRef = useRef<Input | null>(null);
  const dispatch = useAppDispatch();
  const {
    broker: { data, totalRecords, loading, currencyList },
    auth: { user },
  } = useAppSelector((state) => state);
  const history = useHistory();
  const location = useLocation();
  const params: IGetListBrokerrequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState(params);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [formState, setFormState] = useState({ isDisable: true, src: '' });
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formEdit.resetFields();
      formAdd.resetFields();
    }
  }, [formEdit, modalState, formAdd]);

  useEffect(() => {
    dispatch(getListBroker({ page: paramSearch.page, keyword: paramSearch.keyword, size: DEFAULT_PAGE_SIZE }));
    history.push({ pathname: PATH.BROKER, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onChangeSelect = (value: number) => {
    setModalState((prev) => {
      if (prev && prev.data) {
        return { ...prev, data: { ...prev.data, status: value } };
      }
    });
  };

  const onChangeInput = (value: string) => {
    setModalState((prev) => {
      if (prev && prev.data) {
        return { ...prev, data: { ...prev.data, phone: value } };
      }
    });
  };

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig, filters: Record<string, (boolean | React.Key)[] | null>) => {
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current,
          status: filters.status && filters.status.length > 0 ? String(filters.status[0]) : undefined,
        }));
      }
    },
    [],
  );

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.BROKER);
  }, [history]);

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onCloseModal = () => setModalState(undefined);

  const onEditUser = useCallback(async (record: IBrokerItem) => {
    onOpenModal({ isOpen: true, type: 'Edit', data: undefined });
    try {
      const res = await BrokerAPI.GET_DETAIL_BROKER(record.id);
      onOpenModal({ isOpen: true, type: 'Edit', data: res });
    } catch (error) {
      onOpenModal({ isOpen: true, type: 'Edit', data: record });
    }
  }, []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
  }, [formEdit, modalState, formAdd]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState || !modalState.data) return;
      if (modalState.type === 'Edit') {
        try {
          const res = await BrokerAPI.UPDATE_BROKER({ id: modalState.data.id, ...values });
          if (res.id) {
            dispatch(getListBroker(paramSearch));
            setModalState(undefined);
            message.success(t('ADD_BROKER_SUCCESS'));
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [dispatch, modalState, paramSearch, t],
  );

  const onFinishFormAdd = useCallback(
    async (values) => {
      try {
        const res = await BrokerAPI.ADD_BROKER(values);
        if (res.id) {
          message.success(t('ADD_USER_MESSAGE_SUCCESS'));
          dispatch(getListBroker(paramSearch));
          setModalState(undefined);
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [dispatch, paramSearch, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Edit') {
      const isEditPhone = isEditable([ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR], user?.role);
      return (
        <Modal
          title={t('EDIT_TEXT')}
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          centered
          visible={modalState.isOpen}
          okText={t('COMMON_BUTTON_UPDATE')}
          cancelButtonProps={{
            style: {
              display: 'none',
            },
          }}
          width={1000}>
          {modalState.data ? (
            <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Row>
                <Col span={14}>
                  <Form.Item name='fullName' label={t('FULL_NAME_TEXT')} initialValue={modalState.data.fullName}>
                    <Input />
                  </Form.Item>
                  <Form.Item name='email' label='Email' initialValue={modalState.data.email}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='phone'
                    label={t('PHONE_TEXT')}
                    rules={
                      isEditPhone
                        ? [
                            {
                              min: 10,
                              message: t('COMMON_PHONE_LENGTH_ERROR'),
                            },
                          ]
                        : undefined
                    }
                    initialValue={modalState.data.phone}>
                    {isEditPhone ? (
                      <InputNumber maxLength={11} allowLeadingZeros onChange={(e) => onChangeInput(e.target.value)} />
                    ) : (
                      <InputNumber readOnly />
                    )}
                  </Form.Item>
                  <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={modalState.data.status}>
                    <Select onSelect={onChangeSelect}>
                      <Select.Option value={STATUS.ACTIVE}>
                        <Status active /> {t('ACTIVE_TEXT')}
                      </Select.Option>
                      <Select.Option value={STATUS.INACTIVE}>
                        <Status /> {t('INACTIVE_TEXT')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='currencyIds'
                    label={t('WALLET')}
                    initialValue={modalState.data.cbAvailable.map(({ currencyId }) => currencyId)}>
                    <Select mode='multiple' allowClear>
                      {currencyList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.code}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10} textAlign='center'>
                  <UploadImage
                    internalProps={{ isEdit: true, isRect: false }}
                    src={modalState.data.avatar}
                    onChangeImage={(url) => {
                      if (!modalState || !modalState.data) return;
                      onOpenModal({
                        ...modalState,
                        data: {
                          ...modalState.data,
                          avatar: url,
                        },
                      });
                      formEdit.setFields([
                        {
                          name: 'avatar',
                          value: url,
                          errors: [],
                        },
                      ]);
                    }}
                  />
                  <Form.Item className='hide-input' name='avatar' initialValue={modalState.data.avatar}>
                    <Input />
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
    if (modalState.type === 'Add') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={1000}
          okText={t('COMMON_BUTTON_ADD')}
          onOk={onSubmitModal}
          title={t('ADD_BROKER')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          onCancel={onCloseModal}>
          <Form
            form={formAdd}
            onFinish={onFinishFormAdd}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            onFieldsChange={(fieldChange) => {
              if (fieldChange[0].name[0] === 'email') {
                const value = formAdd.getFieldValue('email');
                const error = formAdd.getFieldError('email');
                if (value && error.length === 0) {
                  if (!formState.isDisable) return;
                  setFormState((prev) => ({
                    ...prev,
                    isDisable: false,
                  }));
                } else {
                  formAdd.setFields([{ name: 'sendEmail', value: 'sms' }]);
                  setFormState((prev) => ({
                    ...prev,
                    isDisable: true,
                  }));
                }
              }
            }}>
            <Row>
              <Col span={14}>
                <Form.Item
                  name='fullName'
                  label={t('FULL_NAME_TEXT')}
                  rules={[{ required: true, message: t('COMMON_FULLNAME_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='phone'
                  label={t('PHONE_TEXT')}
                  rules={[
                    {
                      len: 10,
                      message: t('COMMON_PHONE_LENGTH_ERROR'),
                    },
                  ]}>
                  <InputNumber maxLength={10} allowLeadingZeros />
                </Form.Item>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[{ type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={STATUS.ACTIVE}>
                  <Select>
                    <Select.Option value={STATUS.ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                    <Select.Option value={STATUS.INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name='currencyIds' label={t('WALLET')}>
                  <Select mode='multiple' allowClear>
                    {currencyList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.code}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10} textAlign='center'>
                <UploadImage
                  src={formState.src}
                  internalProps={{ isEdit: true, isRect: false }}
                  onChangeImage={(url) => {
                    formAdd.setFields([
                      {
                        name: 'avatar',
                        value: url,
                        errors: [],
                      },
                    ]);
                    setFormState((prev) => ({
                      ...prev,
                      src: url,
                    }));
                  }}
                />
                <Form.Item className='hide-input' name='avatar' initialValue={modalState.data?.avatar}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [
    modalState,
    user?.role,
    t,
    onSubmitModal,
    formEdit,
    onFinishForm,
    formAdd,
    onFinishFormAdd,
    currencyList,
    formState.src,
    formState.isDisable,
  ]);

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
      title: t('USER_NAME_TEXT'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
      render: (value: string, record: IBrokerItem) => (
        <Textlink
          text={value}
          onClick={() => {
            dispatch(getListCurrency({ status: 1 })).then(() =>
              onEditUser({ ...record, phone: record.phone && record.phone.substr(1) }),
            );
          }}
        />
      ),
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
    },
    {
      title: t('WALLET_TEXT'),
      dataIndex: 'cbAvailable',
      key: 'cbAvailable',
      width: 350,
      render: (value) => (
        <List
          grid={{
            gutter: 16,
            column: 2,
          }}
          itemLayout='horizontal'
          dataSource={value}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Typography.Title level={5}>
                    {t('WALLET_TEXT')} {item.currency.code}
                  </Typography.Title>
                }
                description={
                  <Typography.Text style={{ fontWeight: 500, fontSize: '17px' }} type='success'>
                    {formatter.format(Number(item.amount))}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (_, record: IBrokerItem) => (
        <Link style={{ marginRight: 5 }} to={`${PATH.BROKERDETAIL}/${record.id}`}>
          {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
        </Link>
      ),
    },
  ];

  return (
    <Card>
      <Row>
        <Col xs={24} md={24} textAlign='right'>
          <Button
            type='primary'
            onClick={() => {
              dispatch(getListCurrency({ status: 1 })).then(() => {
                onOpenModal({ isOpen: true, type: 'Add' });
              });
            }}>
            {t('ADD_BROKER')}
          </Button>
        </Col>
      </Row>
      <br />
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
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
