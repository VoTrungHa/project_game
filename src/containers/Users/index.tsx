/* eslint-disable react/display-name */
import { Button, Card, Form, Input, message, Popconfirm, Select, Table, TablePaginationConfig, Typography } from 'antd';
import { UserAPI } from 'apis/user';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Modal } from 'components/Modal';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { DEFAULT_PAGE_SIZE, STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE, ROLE_TYPE_LABEL } from 'constants/role';
import { generateSelect, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getListUser } from './duck/thunks';

const { ADMIN, MANAGER, EDITOR, USER } = ROLE_TYPE;
interface IModalState {
  type: 'Add' | 'Edit';
  data?: IUser | Partial<IAddUserRequest>;
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const clearFiltersRef = useRef(() => {});
  const inputSearchRef = useRef<Input | null>(null);
  const history = useHistory();
  const location = useLocation();
  const params: IListUserRequest = parseParamToObject(location.search);
  const dispatch = useAppDispatch();
  const {
    user: { data, totalRecords, loading },
    auth: { user: currentUser },
  } = useAppSelector((state) => state);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState(params);
  const [isDisableButton, setDisableButton] = useState({});
  const [confirmDeleteUser, setConfirmDeleteUser] = useState('');
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState]);

  useEffect(() => {
    dispatch(getListUser(paramSearch));
    history.push({ pathname: PATH.USERS, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  useEffect(() => {
    if (!modalState || !modalState.data) return;
    if (confirmDeleteUser !== modalState.data.userName) {
      if (isDisableButton['deleteUserInModalButton']) return;
      setDisableButton((prev) => ({
        ...prev,
        deleteUserInModalButton: true,
      }));
    } else {
      if (!isDisableButton['deleteUserInModalButton']) return;
      setDisableButton((prev) => ({
        ...prev,
        deleteUserInModalButton: false,
      }));
    }
  }, [confirmDeleteUser, isDisableButton, modalState]);

  const dataSource = useMemo(() => data.filter(({ id }) => id !== currentUser?.id), [currentUser, data]);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    clearFiltersRef.current();
    setParamSearch({});
    history.push(PATH.USERS);
  }, [history]);

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onEditUser = useCallback(async (record: IUser) => {
    onOpenModal({ isOpen: true, type: 'Edit', data: undefined });
    try {
      const res = await UserAPI.GET_USER_BY_ID(record.id);
      onOpenModal({ isOpen: true, type: 'Edit', data: res });
    } catch (error) {
      onOpenModal({ isOpen: true, type: 'Edit', data: record });
    }
  }, []);

  const onCloseModal = () => setModalState(undefined);

  const onDeleteUser = useCallback(
    async (idUser: number) => {
      try {
        const res = await UserAPI.DELETE_USER_BY_ID(idUser);
        if (res.status) {
          dispatch(getListUser(paramSearch));
        }
      } catch (error) {
        message.error(t('COMMON_DELETE_USER_ERROR'));
      }
      setModalState(undefined);
    },
    [dispatch, paramSearch, t],
  );

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
  }, [formAdd, formEdit, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        try {
          const res = await UserAPI.ADD_USER({ ...values, status: 1 });
          if (res.id) {
            dispatch(getListUser(paramSearch));
          }
          setModalState(undefined);
          message.success(t('ADD_USER_MESSAGE_SUCCESS'));
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message.length > 0) {
            const errorFromServer = error.response.data.message.map((item) => ({
              name: item.field,
              errors: [item.field === 'userName' ? t('USERNAME_IS_USDED') : t('EMAIL_IS_USDED')],
            }));
            formAdd.setFields(errorFromServer);
          } else {
            message.error(t('COMMON_ADD_USER_ERROR'));
          }
        }
      }
      if (modalState.type === 'Edit') {
        try {
          const payload =
            modalState.data?.email?.trim() === values.email.trim() ? { ...values, email: undefined } : values;
          const res = await UserAPI.UPDATE_USER({ id: (modalState.data as IUser).id, ...payload });
          if (res.id) {
            dispatch(getListUser(paramSearch));
          }
          setModalState(undefined);
          message.success(t('EDIT_USER_MESSAGE_SUCCESS'));
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message.length > 0) {
            const errorFromServer = error.response.data.message.map((item) => ({
              name: item.field,
              errors: [item.field === 'email' ? t('EMAIL_IS_USDED') : item.message],
            }));
            formEdit.setFields(errorFromServer);
          } else {
            message.error(t('COMMON_UPDATE_USER_ERROR'));
          }
        }
      }
    },
    [dispatch, formAdd, formEdit, modalState, paramSearch, t],
  );

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig, filters: Record<string, (boolean | React.Key)[] | null>) => {
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current,
          role: filters.role && filters.role.length > 0 ? String(filters.role[0]) : undefined,
        }));
      }
    },
    [],
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
      dataIndex: 'userName',
      key: 'userName',
      render: (value: string, record: IUser) => <Textlink text={value} onClick={() => onEditUser(record)} />,
    },
    {
      title: t('FULL_NAME_TEXT'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: t('ROLE_TEXT'),
      dataIndex: 'role',
      key: 'role',
      render: (role: ROLE_TYPE) => <>{ROLE_TYPE_LABEL[role]}</>,
      filters: [
        {
          text: ROLE_TYPE_LABEL[1],
          value: ROLE_TYPE['ADMIN'],
        },
        {
          text: ROLE_TYPE_LABEL[2],
          value: ROLE_TYPE['MANAGER'],
        },
        {
          text: ROLE_TYPE_LABEL[3],
          value: ROLE_TYPE['EDITOR'],
        },
        {
          text: ROLE_TYPE_LABEL[4],
          value: ROLE_TYPE['USER'],
        },
      ],
      filterMultiple: false,
      filteredValue: paramSearch.role ? [paramSearch.role] : null,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string) => <>{value || '--'}</>,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={!!status} />,
    },
  ];

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Edit') {
      const isCurrentUserCanModify =
        modalState.data && modalState.data.role && currentUser && currentUser.role <= modalState.data.role;
      return (
        <Modal
          title={t('EDIT_TEXT')}
          centered
          visible={modalState.isOpen}
          onCancel={onCloseModal}
          width={1000}
          okText={t('COMMON_BUTTON_UPDATE')}
          okButtonProps={{
            disabled: isDisableButton['editButton'],
          }}
          className='ant-modal-users'
          footer={[
            <Popconfirm
              key='delete'
              onConfirm={() => onDeleteUser((modalState.data as IUser).id)}
              okButtonProps={{ disabled: isDisableButton['deleteUserInModalButton'] }}
              title={
                <>
                  {t('COMMON_PROMPT_DELETE_USER')}
                  <br />
                  <Input
                    onChange={(e) => {
                      const value = e.currentTarget.value.trim();
                      setConfirmDeleteUser(value);
                    }}
                  />
                </>
              }
              okText={t('COMMON_BUTTON_DELETE')}
              cancelText={t('COMMON_BUTTON_CANCEL')}>
              {isCurrentUserCanModify && (
                <Button type='primary' danger>
                  {t('DELETE_USER_BUTTON')}
                </Button>
              )}
            </Popconfirm>,
            <div key='cancel-update'>
              <Button key='cancel' onClick={onCloseModal}>
                {t('COMMON_BUTTON_CANCEL')}
              </Button>
              <Button type='primary' key='update' onClick={onSubmitModal} disabled={!isCurrentUserCanModify}>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </div>,
          ]}>
          {modalState.data ? (
            <Form
              form={formEdit}
              onFinish={onFinishForm}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              onFieldsChange={(_, allFields) => {
                const index = allFields.findIndex((ele) => ele.errors!.length > 0);
                if (index !== -1) {
                  if (isDisableButton['editButton']) return;
                  setDisableButton((prev) => ({
                    ...prev,
                    editButton: true,
                  }));
                } else {
                  if (!isDisableButton['editButton']) return;
                  setDisableButton((prev) => ({
                    ...prev,
                    editButton: false,
                  }));
                }
              }}>
              <Row>
                <Col span={14}>
                  <Form.Item label={t('USER_NAME_TEXT')}>
                    <Input defaultValue={modalState.data.userName} readOnly />
                  </Form.Item>
                  <Form.Item
                    name='fullName'
                    label={t('FULL_NAME_TEXT')}
                    rules={[{ required: true, message: t('COMMON_FULLNAME_REQUIRED_ERROR') }]}
                    initialValue={modalState.data.fullName}>
                    <Input readOnly={!isCurrentUserCanModify} />
                  </Form.Item>
                  <Form.Item
                    name='email'
                    label='Email'
                    rules={[
                      { required: true, message: t('COMMON_EMAIL_REQUIRED_ERROR') },
                      { type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') },
                    ]}
                    initialValue={modalState.data.email}>
                    <Input readOnly={!isCurrentUserCanModify} />
                  </Form.Item>
                  <Form.Item
                    name='phone'
                    label={t('PHONE_TEXT')}
                    initialValue={modalState.data.phone}
                    rules={[
                      { required: true, message: t('COMMON_PHONE_REQUIRED_ERROR') },
                      {
                        len: 10,
                        message: t('COMMON_PHONE_LENGTH_ERROR'),
                      },
                    ]}>
                    <InputNumber maxLength={10} allowLeadingZeros readOnly={!isCurrentUserCanModify} />
                  </Form.Item>
                  <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={modalState.data.status}>
                    <Select disabled={!isCurrentUserCanModify}>
                      <Select.Option value={STATUS.ACTIVE}>
                        <Status active /> {t('ACTIVE_TEXT')}
                      </Select.Option>
                      <Select.Option value={STATUS.INACTIVE}>
                        <Status /> {t('INACTIVE_TEXT')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='role' label={t('ROLE_TEXT')} initialValue={modalState.data.role}>
                    {isCurrentUserCanModify ? (
                      <Select>
                        {generateSelect(currentUser!.role).map((i) => (
                          <Select.Option key={i} value={i}>
                            {ROLE_TYPE_LABEL[i]}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Select disabled>
                        <Select.Option value={ADMIN}>{ROLE_TYPE_LABEL[1]}</Select.Option>
                        <Select.Option value={MANAGER}>{ROLE_TYPE_LABEL[2]}</Select.Option>
                        <Select.Option value={EDITOR}>{ROLE_TYPE_LABEL[3]}</Select.Option>
                        <Select.Option value={USER}>{ROLE_TYPE_LABEL[4]}</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={10} textAlign='center'>
                  <UploadImage
                    src={modalState.data.avatar}
                    internalProps={{ isEdit: !!isCurrentUserCanModify, isRect: false }}
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
          title={t('ADD_NEW_USER')}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          onCancel={onCloseModal}>
          <Form
            form={formAdd}
            onFinish={onFinishForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            initialValues={{
              userName: '',
              password: '',
            }}>
            <Row>
              <Col span={14}>
                <Form.Item
                  name='userName'
                  label={t('USER_NAME_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_USERNAME_REQUIRED_ERROR') },
                    { pattern: /^[a-zA-Z][\w_.]*$/gi, message: t('COMMON_USERNAME_INVALID_PATTERN') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='fullName'
                  label={t('FULL_NAME_TEXT')}
                  rules={[{ required: true, message: t('COMMON_FULLNAME_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='password'
                  label={t('PASSWORD_TEXT')}
                  rules={[{ required: true, message: t('COMMON_PASSWORD_REQUIRED_ERROR') }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name='confirm'
                  label={t('COMMON_RENEWPASSWORD_SECONDLABEL')}
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_PASSWORD_REQUIRED_ERROR'),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('COMMON_RENEWPASSWORD_ERRORMATCH')));
                      },
                    }),
                  ]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                    { required: true, message: t('COMMON_EMAIL_REQUIRED_ERROR') },
                    { type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
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
                <Form.Item name='role' label={t('ROLE_TEXT')} initialValue={ROLE_TYPE.USER}>
                  <Select>
                    {generateSelect(currentUser!.role).map((i) => (
                      <Select.Option key={i} value={i}>
                        {ROLE_TYPE_LABEL[i]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10} textAlign='center'>
                <UploadImage
                  src={modalState.data?.avatar}
                  internalProps={{ isEdit: true, isRect: false }}
                  onChangeImage={(url) => {
                    onOpenModal({
                      ...modalState,
                      data: {
                        ...modalState.data,
                        avatar: url,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'avatar',
                        value: url,
                        errors: [],
                      },
                    ]);
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
  }, [currentUser, formAdd, formEdit, isDisableButton, modalState, onDeleteUser, onFinishForm, onSubmitModal, t]);

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_EMAIL_OR_PHONE_TEXT')}
            allowClear
          />
        </Col>
        <Col xs={24} md={12}>
          <Row justify='space-between'>
            <Col>
              <Button disabled={Object.keys(paramSearch).length === 0} onClick={onClearFilter}>
                {t('COMMON_BUTTON_FILTER')}
              </Button>
            </Col>
            <Col>
              <Button
                style={{ padding: '4px 10px' }}
                onClick={() =>
                  onOpenModal({
                    isOpen: true,
                    type: 'Add',
                  })
                }
                type='primary'>
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
        }}
        onChange={onChangeTable}
        showSorterTooltip={false}
        sortDirections={['descend']}
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
