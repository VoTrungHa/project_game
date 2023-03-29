/* eslint-disable react/display-name */
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Switch,
  Table,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import {
  formatCountMinutes,
  formatDate,
  formatMomentUTC,
  FORMAT_MOMENT,
  Moment,
  parseDate,
  parseIsBefore,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHomePageBannerConfig } from './duck/thunks';

const { DATE_TIME_LONG, DATE_TIME_SHORT, DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Add' | 'Delete' | 'Edit';
  isOpen: boolean;
  data?: IHomepageBannerItem;
  id?: string;
}

const { TIME_SHORT } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.homepageBanner);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  useDidMount(() => {
    dispatch(getHomePageBannerConfig());
  });

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState]);

  const isInteract = useMemo(() => {
    if (modalState && modalState.data) {
      return modalState.data.interact;
    }
    return false;
  }, [modalState]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [modalState, formEdit, formAdd]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        const payload = {
          title: values.title,
          url: values.url,
          startAt: formatCountMinutes(values.startAt, 1, DATE_TIME_LONG),
          stopAt: formatDate(values.stopAt, DATE_TIME_LONG),
          externalLink: isInteract && values.externalLink ? values.externalLink : null,
          buttonTitle: isInteract ? values.buttonTitle : null,
          status: values.status ? 1 : 0,
        };
        try {
          const res = await SystemConfigAPI.ADD_HOMEPAGE_BANNER_CONFIG(payload);
          if (res.id) {
            message.success(t('ADD_HOMEPAGE_CONFIG_SUCCESS'));
            dispatch(getHomePageBannerConfig());
            onChangeModal(undefined);
          }
        } catch (error) {
          message.error(t('EXTERNAL_LINK_INVALD'));
        }
      }

      if (modalState.type === 'Edit') {
        if (!modalState.data) return;
        const startAtDefault = parseDate(modalState.data.startAt as string, DATE_TIME_LONG);
        const startAt = parseDate(values.startAt, DATE_TIME_LONG);
        const stopAtDefault = parseDate(modalState.data.stopAt as string, DATE_TIME_LONG);
        const stopAt = parseDate(values.stopAt, DATE_TIME_LONG);

        const payload = {
          title: values.title,
          url: values.url,
          startAt: startAtDefault.isSame(startAt) ? undefined : formatCountMinutes(values.startAt, 1, DATE_TIME_LONG),
          stopAt: stopAtDefault.isSame(stopAt) ? undefined : formatDate(values.stopAt, DATE_TIME_LONG),
          externalLink: isInteract && values.externalLink ? values.externalLink : null,
          buttonTitle: isInteract ? values.buttonTitle : null,
          status: values.status ? 1 : 0,
        };
        try {
          const res = await SystemConfigAPI.UPDATE_HOMEPAGE_BANNER_BY_ID({ id: modalState.data.id!!, ...payload });
          if (res.updatedAt) {
            message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
            dispatch(getHomePageBannerConfig());
            onChangeModal(undefined);
          }
        } catch (error) {
          message.error(t('EXTERNAL_LINK_INVALD'));
        }
      }
    },
    [dispatch, isInteract, modalState, onChangeModal, t],
  );

  const onUpdateStatus = useCallback(
    async (id: string, status: number) => {
      const res = await SystemConfigAPI.UPDATE_HOMEPAGE_BANNER_BY_ID({ id, status });
      if (res.updatedAt) {
        dispatch(getHomePageBannerConfig());
      }
    },
    [dispatch],
  );

  const onDeleteImage = useCallback(
    async (id: string) => {
      try {
        const res = await SystemConfigAPI.DELETE_HOMEPAGE_BANNER_CONFIG(id);
        if (res.id) {
          message.success(t('DELETE_IMAGE_SUCCESS'));
          dispatch(getHomePageBannerConfig());
          onChangeModal(undefined);
        }
      } catch (error) {
        message.error(t('DELETE_IMAGE_ERROR'));
      }
    },
    [dispatch, onChangeModal, t],
  );

  const onUpdateAds = useCallback(
    async (record: IHomepageBannerItem) => {
      onChangeModal({
        isOpen: true,
        type: 'Edit',
        data: undefined,
      });
      try {
        const res = await SystemConfigAPI.GET_HOMEPAGE_BANNER_BY_ID(record.id!!);
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: { ...res, interact: !!(res.buttonTitle || res.externalLink) },
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

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }
      const now = formatDate();
      const value = formatDate(time, DATE_TIME_LONG);
      const compare = parseIsBefore(now, value);
      if (compare) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(t('START_MUST_BE_GREATER_THAN_NOW')));
    },
    [t],
  );

  const checkValueStartWhenEdit = useCallback(
    (_, time: Moment) => {
      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }
      const startAtDefault = parseDate(modalState!.data!.startAt as string, DATE_TIME_LONG);
      const startAt = parseDate(time, DATE_TIME_LONG);
      if (startAtDefault.isSame(startAt)) {
        return Promise.resolve();
      }
      const now = formatDate();
      const value = formatDate(time, DATE_TIME_LONG);
      const compare = parseIsBefore(now, value);
      if (compare) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(t('START_MUST_BE_GREATER_THAN_NOW')));
    },
    [modalState, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Delete') {
      return (
        <Modal
          onOk={() => onDeleteImage(modalState.id as string)}
          visible={modalState.isOpen}
          onCancel={() => onChangeModal(undefined)}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          okText='Ok'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ fontSize: 30, color: 'yellow', marginRight: 5 }} />
            {t('COMMON_PROMPT_DELETE_BANNER')}
          </div>
        </Modal>
      );
    }

    if (modalState.type === 'Edit') {
      if (!modalState.data) return null;
      formEdit.setFields([
        {
          name: 'url',
          value: modalState.data.url,
          errors: [],
        },
      ]);
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('HOMEPAGE_BANNER')}
          width={1000}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_UPDATE')}>
          {modalState.data ? (
            <Form onFinish={onFinishForm} form={formEdit} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Row>
                <Col span={16}>
                  <Form.Item
                    name='title'
                    label={t('TITLE_TEXT')}
                    initialValue={modalState.data.title}
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    required
                    rules={[{ validator: checkValueStartWhenEdit }]}
                    name='startAt'
                    initialValue={parseDate(modalState.data.startAt as string, DATE_TIME_SHORT)}
                    label={t('TIME_START')}>
                    <DatePicker
                      showNow={false}
                      showTime={{ format: TIME_SHORT }}
                      format={DATE_TIME_SHORT}
                      locale={i18n.language === 'vn' ? vn : undefined}
                    />
                  </Form.Item>
                  <Form.Item
                    required
                    name='stopAt'
                    initialValue={parseDate(modalState.data.stopAt as string, DATE_TIME_SHORT)}
                    label={t('TIME_END')}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, time: Moment) {
                          if (!time) {
                            return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                          }
                          const start = formatDate(getFieldValue('startAt'), DATE_TIME_SHORT);
                          const end = formatDate(time, DATE_TIME_SHORT);
                          const compare = parseIsBefore(start, end);
                          if (compare) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
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
                  <Form.Item label={t('STATUS_TEXT')} name='status' initialValue={modalState.data.status === 1}>
                    <Switch
                      defaultChecked={modalState.data.status === 1}
                      checkedChildren={t('SHOW_TEXT')}
                      unCheckedChildren={t('HIDE_TEXT')}
                    />
                  </Form.Item>
                  <Form.Item label={t('INTERACT_TEXT')} initialValue={!!modalState.data?.interact}>
                    <Checkbox
                      defaultChecked={modalState.data.interact}
                      onChange={(e) =>
                        onChangeModal({
                          isOpen: true,
                          type: 'Edit',
                          data: { ...(modalState.data ? modalState.data : {}), interact: e.target.checked },
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    initialValue={modalState.data.buttonTitle}
                    style={{ opacity: isInteract ? 1 : 0 }}
                    name='buttonTitle'
                    label={t('BUTTON_TITLE_TEXT')}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    initialValue={modalState.data.externalLink}
                    style={{ opacity: isInteract ? 1 : 0 }}
                    name='externalLink'
                    label={t('EXTERNAL_LINK_TEXT')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <UploadImage
                    src={modalState.data?.url}
                    internalProps={{ isEdit: true, isSquare: true }}
                    onChangeImage={(url) => {
                      onChangeModal({
                        ...modalState,
                        data: {
                          ...modalState.data!,
                          url,
                        },
                      });
                      formAdd.setFields([
                        {
                          name: 'url',
                          value: url,
                          errors: [],
                        },
                      ]);
                    }}
                  />
                  <Form.Item
                    className='hide-input'
                    rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                    name='url'>
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
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('HOMEPAGE_BANNER')}
          width={1000}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_ADD')}>
          <Form onFinish={onFinishForm} form={formAdd} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={16}>
                <Form.Item
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item required rules={[{ validator: checkValueStart }]} name='startAt' label={t('TIME_START')}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  required
                  name='stopAt'
                  label={t('TIME_END')}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }
                        const start = formatDate(getFieldValue('startAt'), DATE_TIME_SHORT);
                        const end = formatDate(time, DATE_TIME_SHORT);
                        const compare = parseIsBefore(start, end);
                        if (compare) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
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
                <Form.Item label={t('STATUS_TEXT')} name='status'>
                  <Switch checkedChildren={t('SHOW_TEXT')} unCheckedChildren={t('HIDE_TEXT')} />
                </Form.Item>
                <Form.Item label={t('INTERACT_TEXT')} initialValue={!!modalState.data?.interact}>
                  <Checkbox
                    defaultChecked={!!modalState.data?.interact}
                    onChange={(e) =>
                      onChangeModal({
                        isOpen: true,
                        type: 'Add',
                        data: { ...(modalState.data ? modalState.data : {}), interact: e.target.checked },
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data?.buttonTitle}
                  style={{ opacity: isInteract ? 1 : 0 }}
                  name='buttonTitle'
                  label={t('BUTTON_TITLE_TEXT')}>
                  <Input />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data?.externalLink}
                  style={{ opacity: isInteract ? 1 : 0 }}
                  name='externalLink'
                  label={t('EXTERNAL_LINK_TEXT')}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <UploadImage
                  fileSizeLimit={2500}
                  src={modalState.data?.url}
                  internalProps={{ isEdit: true, isSquare: true }}
                  onChangeImage={(url) => {
                    onChangeModal({
                      ...modalState,
                      data: {
                        ...modalState.data!,
                        url,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'url',
                        value: url,
                        errors: [],
                      },
                    ]);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                  name='url'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [
    checkValueStart,
    checkValueStartWhenEdit,
    formAdd,
    formEdit,
    i18n.language,
    isInteract,
    modalState,
    onChangeModal,
    onDeleteImage,
    onFinishForm,
    onSubmitModal,
    t,
  ]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
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
      render: (value: string, record: IHomepageBannerItem) => (
        <Textlink text={value} onClick={() => onUpdateAds(record)} />
      ),
    },
    {
      title: t('IMAGE_TEXT'),
      dataIndex: 'url',
      key: 'url',
      width: 400,
      render: (src: string) => <Image src={src} width={86} height={86} />,
    },
    {
      title: t('TIME_START'),
      dataIndex: 'startAt',
      key: 'startAt',
      render: (value: string) => formatMomentUTC(value, DATE_TIME_SLASH_LONG),
    },
    {
      title: t('TIME_END'),
      dataIndex: 'stopAt',
      key: 'stopAt',
      render: (value: string) => formatMomentUTC(value, DATE_TIME_SLASH_LONG),
    },
    {
      key: 'operation',
      width: 150,
      render: (_, record: IHomepageBannerItem) => (
        <>
          <Switch
            checked={record.status === 1}
            checkedChildren={t('SHOW_TEXT')}
            unCheckedChildren={t('HIDE_TEXT')}
            style={{ marginRight: '10px' }}
            onChange={(value) => onUpdateStatus(record.id as string, value ? 1 : 0)}
          />
          <DeleteOutlined
            onClick={() => onChangeModal({ type: 'Delete', isOpen: true, id: record.id })}
            style={{ color: 'red' }}
          />
        </>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <Row justify='space-between'>
            <Col>
              <Button
                onClick={() =>
                  onChangeModal({
                    isOpen: true,
                    type: 'Add',
                  })
                }
                type='primary'>
                {t('COMMON_BUTTON_ADD_HOMEPAGE_BANNER')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Table
        pagination={false}
        showSorterTooltip={false}
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
