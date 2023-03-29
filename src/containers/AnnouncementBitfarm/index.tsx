/* eslint-disable react/display-name */
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Switch,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { AnnouncementBitfarmAPI } from 'apis/announcementbitfarm';
import { Col, Row } from 'components/Container';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { formatMoment, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAnnouncementBitfarm } from './duck/thunks';

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Add' | 'Delete' | 'Edit';
  isOpen: boolean;
  data?: IAnnouncementBitfarmItem;
  id?: string;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, loading, totalRecords } = useAppSelector((state) => state.announcementBitfarm);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      dispatch(getAnnouncementBitfarm({ page: 1, size: DEFAULT_PAGE_SIZE }));
    }
  }, [dispatch, formAdd, formEdit, modalState]);

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
        try {
          const res = await AnnouncementBitfarmAPI.ADD_ANNOUNCEMENT({ ...values });
          if (res.id) {
            message.success(t('ADD_HOMEPAGE_CONFIG_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }

      if (modalState.type === 'Edit') {
        if (!modalState.data) return;
        try {
          const res = await AnnouncementBitfarmAPI.UPDATE_ANNOUNCEMENT({ ...values, id: modalState.data.id });
          if (res.status) {
            message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [modalState, onChangeModal, t],
  );

  const onDeleteImage = useCallback(
    async (id: string) => {
      try {
        const res = await AnnouncementBitfarmAPI.DELETE_ANNOUNCEMENT(id);
        if (res.status) {
          onChangeModal(undefined);
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [onChangeModal],
  );

  const onUpdateStatus = useCallback(
    async (id: string, status: number) => {
      const res = await AnnouncementBitfarmAPI.UPDATE_ANNOUNCEMENT({ id, status });
      if (res.status) {
        dispatch(getAnnouncementBitfarm({ page: 1, size: DEFAULT_PAGE_SIZE }));
      }
    },
    [dispatch],
  );

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      if (pagination.current) {
        dispatch(getAnnouncementBitfarm({ page: pagination.current, size: DEFAULT_PAGE_SIZE }));
      }
    },
    [dispatch],
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
            <ExclamationCircleOutlined style={{ fontSize: 30, marginRight: 5 }} />
            {t('COMMON_PROMPT_DELETE_BANNER')}
          </div>
        </Modal>
      );
    }

    if (modalState.type === 'Edit') {
      if (!modalState.data) return null;
      formEdit.setFields([
        {
          name: 'banner',
          value: modalState.data.banner,
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
                  <Form.Item label={t('STATUS_TEXT')} name='status' initialValue={modalState.data.status}>
                    <Switch
                      defaultChecked={modalState.data.status === 1}
                      checkedChildren={t('SHOW_TEXT')}
                      unCheckedChildren={t('HIDE_TEXT')}
                    />
                  </Form.Item>
                  <Form.Item label={t('INTERACT_TEXT')}>
                    <Checkbox
                      defaultChecked={!!modalState.data?.interact}
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
                    initialValue={modalState.data?.buttonTitle}
                    style={{ opacity: isInteract ? 1 : 0 }}
                    name='buttonTitle'
                    label={t('BUTTON_TITLE_TEXT')}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    initialValue={modalState.data?.link}
                    style={{ opacity: isInteract ? 1 : 0 }}
                    name='link'
                    label={t('EXTERNAL_LINK_TEXT')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <UploadImage
                    fileSizeLimit={2500}
                    src={modalState.data?.banner}
                    internalProps={{ isEdit: true, isSquare: true }}
                    onChangeImage={(banner) => {
                      onChangeModal({
                        ...modalState,
                        data: {
                          ...modalState.data!,
                          banner,
                        },
                      });
                      formAdd.setFields([
                        {
                          name: 'banner',
                          value: banner,
                          errors: [],
                        },
                      ]);
                    }}
                  />
                  <Form.Item
                    className='hide-input'
                    rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                    name='banner'>
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
          title={t('ANNOUNCEMENT_BITFARM')}
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
                <Form.Item label={t('STATUS_TEXT')} name='status'>
                  <Switch checkedChildren={t('SHOW_TEXT')} unCheckedChildren={t('HIDE_TEXT')} />
                </Form.Item>
                <Form.Item label={t('INTERACT_TEXT')}>
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
                  initialValue={modalState.data?.link}
                  style={{ opacity: isInteract ? 1 : 0 }}
                  name='link'
                  label={t('EXTERNAL_LINK_TEXT')}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <UploadImage
                  src={modalState.data?.banner}
                  internalProps={{ isEdit: true, isSquare: true }}
                  onChangeImage={(banner) => {
                    onChangeModal({
                      ...modalState,
                      data: {
                        ...modalState.data!,
                        banner,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'banner',
                        value: banner,
                        errors: [],
                      },
                    ]);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                  name='banner'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [formAdd, formEdit, isInteract, modalState, onChangeModal, onDeleteImage, onFinishForm, onSubmitModal, t]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
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
      width: 400,
      render: (title: string, record: IAnnouncementBitfarmItem) => (
        <List.Item>
          <List.Item.Meta
            className='ant-list-item-meta-title-blue'
            avatar={<Image src={record.banner} width={86} height={86} />}
            title={
              <Textlink
                text={title}
                onClick={() =>
                  onChangeModal({
                    data: { ...record, interact: !!(record.buttonTitle || record.link) },
                    isOpen: true,
                    type: 'Edit',
                  })
                }
              />
            }
            description={record.buttonTitle}
          />
        </List.Item>
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatMoment(time, DATE_TIME_SLASH_LONG),
    },
    {
      title: t('UPDATED_AT_TEXT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      key: 'operation',
      width: 150,
      render: (_, record: IAnnouncementBitfarmItem) => (
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
                {t('ADD_ANNOUNCEMENT')}
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
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        sortDirections={['descend']}
        onChange={onChangeTable}
        loading={loading}
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
