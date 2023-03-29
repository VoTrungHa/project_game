/* eslint-disable react/display-name */
import { ArrowRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { MobileUserAPI } from 'apis/mobileuser';
import { MobileUserDetailAPI } from 'apis/mobileuserdetail';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { DEFAULT_PAGE_SIZE, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE } from 'constants/role';
import { isEditable, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getListMobileUser } from './duck/thunks';

interface IModalState {
  type: 'Edit' | 'Add';
  isOpen: boolean;
  data?: IMobileUserDetailResponse | IMobileUserAccount;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const inputSearchRef = useRef<Input | null>(null);
  const dispatch = useAppDispatch();
  const {
    mobileuser: { data, totalRecords, loading },
    auth: { user },
  } = useAppSelector((state) => state);
  const history = useHistory();
  const location = useLocation();
  const params: IMobileUserAccountRequest = parseParamToObject(location.search);
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
    dispatch(getListMobileUser(paramSearch));
    history.push({ pathname: PATH.MOBILEUSER, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const isUpdatingStatus = useMemo(() => {
    if (modalState && modalState.data) {
      const ele: IMobileUserAccount = data.find((item) => item.id === modalState.data?.id);
      if (ele) {
        return ele.status !== modalState.data.status;
      }
    }
  }, [data, modalState]);

  const isUpdatingPhone = useMemo(() => {
    if (modalState && modalState.data) {
      const ele: IMobileUserAccount = data.find((item) => item.id === modalState.data?.id);
      if (ele.phone) {
        return ele.phone.substr(1) !== modalState.data.phone;
      }
      return Boolean(ele.phone) !== Boolean(modalState.data.phone);
    }
  }, [data, modalState]);

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
    history.push(PATH.MOBILEUSER);
  }, [history]);

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

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onCloseModal = () => setModalState(undefined);

  const onEditUser = useCallback(async (record: IMobileUserAccount) => {
    onOpenModal({ isOpen: true, type: 'Edit', data: undefined });
    try {
      const res = await MobileUserAPI.GET_DETAIL_MOBILE_USER(record.id);
      onOpenModal({ isOpen: true, type: 'Edit', data: { ...res, phone: res.phone && res.phone.substr(1) } });
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
          const res = await MobileUserAPI.UPDATE_STATUS({
            id: modalState.data.id,
            status: isUpdatingStatus ? values.status : undefined,
            phone: isUpdatingPhone ? values.phone : undefined,
            reason: values.reason,
          });
          if (res.status) {
            dispatch(getListMobileUser(paramSearch));
            setModalState(undefined);
          }
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message.length > 0) {
            const errorFromServer = error.response.data.message[0];
            if (errorFromServer.message === 'PHONE_INVALID') {
              message.error(t('UPDATE_PHONE_INVALID_ERROR'));
            } else {
              message.error(t('UPDATE_PHONE_USED_ERROR'));
            }
          } else {
            message.error(t('COMMON_UPDATE_STATUS_ERROR'));
          }
        }
      }
    },
    [dispatch, isUpdatingPhone, isUpdatingStatus, modalState, paramSearch, t],
  );

  const onFinishFormAdd = useCallback(
    async (values) => {
      try {
        const { confirm, ...temp } = values;
        const payload = {
          ...temp,
          sendEmail: temp.sendEmail === 'email',
          email: temp.email || undefined,
          referralBy: temp.referralBy || undefined,
          avatar: temp.avatar || undefined,
        };
        const res = await MobileUserAPI.ADD_MOBILE_USER(payload);
        if (res.id) {
          dispatch(getListMobileUser(paramSearch));
          setModalState(undefined);
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [dispatch, paramSearch],
  );

  const onUpgradePartner = useCallback(
    async (id: string) => {
      try {
        const res = await MobileUserDetailAPI.UPGRADE_PARTNER(id);
        if (res.status) {
          message.success(t('UPGRADE_PARTNER_SUCCESS'));
          dispatch(getListMobileUser(paramSearch));
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
          okButtonProps={{
            disabled: !isUpdatingStatus && !isUpdatingPhone,
          }}
          width={1000}>
          {modalState.data ? (
            <Row>
              <Col span={14}>
                <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  <Form.Item name='fullName' label={t('FULL_NAME_TEXT')} initialValue={modalState.data.fullName}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item name='email' label='Email' initialValue={modalState.data.email}>
                    <Input readOnly />
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
                  <Form.Item name='avatar' label={t('AVATAR_TEXT')} initialValue={modalState.data.avatar}>
                    <Input readOnly />
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
                    style={{ visibility: isUpdatingStatus || isUpdatingPhone ? 'visible' : 'hidden' }}
                    name='reason'
                    label={t('REASON_TEXT')}
                    rules={
                      isUpdatingStatus || isUpdatingPhone
                        ? [{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]
                        : undefined
                    }>
                    <Input />
                  </Form.Item>
                </Form>
                <Link
                  style={{ marginRight: 5 }}
                  to={`${PATH.MOBILEUSERDETAIL}/${modalState.data.id}`}
                  state={paramSearch}>
                  {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
                </Link>
              </Col>
              <Col span={10} textAlign='center'>
                <Avatar size={250} src={modalState.data.avatar} />
              </Col>
            </Row>
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
          title={t('ADD_NEW_ACCOUNT')}
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
                  name='phone'
                  label={t('PHONE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_PHONE_REQUIRED_ERROR') },
                    {
                      len: 10,
                      message: t('COMMON_PHONE_LENGTH_ERROR'),
                    },
                  ]}>
                  <InputNumber maxLength={10} allowLeadingZeros />
                </Form.Item>
                <Form.Item
                  name='fullName'
                  label={t('FULL_NAME_TEXT')}
                  rules={[{ required: true, message: t('COMMON_FULLNAME_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='passcode'
                  label={t('PASSCODE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_PASSCODE_REQUIRED_ERROR') },
                    {
                      len: 6,
                      message: t('COMMON_6_LENGTH_ERROR'),
                    },
                  ]}>
                  <InputNumber allowLeadingZeros maxLength={6} isPassword />
                </Form.Item>
                <Form.Item
                  name='confirm'
                  label={t('CONFIRM_PASSCODE_TEXT')}
                  dependencies={['passcode']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_PASSCODE_REQUIRED_ERROR'),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('passcode') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('COMMON_RENEWPASSCODE_ERRORMATCH')));
                      },
                    }),
                  ]}>
                  <InputNumber allowLeadingZeros maxLength={6} isPassword />
                </Form.Item>
                <Form.Item
                  name='referralBy'
                  label={t('REFERRAL_BY_TEXT')}
                  rules={[
                    {
                      len: 6,
                      message: t('COMMON_8_LENGTH_ERROR'),
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[{ type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='sendEmail' label={t('SEND_IT_BY')} initialValue='sms'>
                  <Radio.Group>
                    <Radio value='sms'>{t('SEND_BY_SMS')}</Radio>
                    <Radio disabled={formState.isDisable} value='email'>
                      {t('SEND_BY_EMAIL')}
                    </Radio>
                  </Radio.Group>
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
                <Form.Item className='hide-input' name='avatar'>
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
    user,
    t,
    onSubmitModal,
    isUpdatingStatus,
    isUpdatingPhone,
    formEdit,
    onFinishForm,
    paramSearch,
    formAdd,
    onFinishFormAdd,
    formState,
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
      render: (value: string, record: IMobileUserAccount) => (
        <Textlink
          text={value}
          onClick={() => onEditUser({ ...record, phone: record.phone && record.phone.substr(1) })}
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
      filters: [
        {
          text: 'Inactive',
          value: STATUS.INACTIVE,
        },
        {
          text: 'Active',
          value: STATUS.ACTIVE,
        },
      ],
      filterMultiple: false,
      filteredValue: paramSearch.status ? [paramSearch.status] : null,
      render: (status: STATUS) => <Status active={!!status} />,
    },
    {
      dataIndex: 'becomepartner',
      key: 'becomepartner',
      render: (_, record: IMobileUserAccount) => (
        <Button onClick={() => onOpenModalPartner(record.id)}>{t('COMMON_BUTTON_UPGRADE')}</Button>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_TEXT')}
            allowClear
          />
        </Col>
        <Col xs={24} md={12}>
          <Row justify='space-between'>
            <Col>
              <Button onClick={onClearFilter} disabled={Object.keys(paramSearch).length === 0}>
                {t('COMMON_BUTTON_FILTER')}
              </Button>
            </Col>
            <Col>
              <Button type='primary' onClick={() => onOpenModal({ isOpen: true, type: 'Add' })}>
                {t('BUTTON_ADD_ACCOUNT')}
              </Button>
            </Col>
          </Row>
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
