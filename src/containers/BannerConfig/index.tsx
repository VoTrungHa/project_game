/* eslint-disable react/display-name */
import { DeleteOutlined, EditTwoTone, ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Input, message, Modal, Table, Tooltip, Typography } from 'antd';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { DragableBodyRow } from 'components/DraggableBodyRow';
import { UploadImage } from 'components/UploadImage';
import { formatMoment, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { getBannerConfig } from './duck/thunks';

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Delete' | 'Add' | 'Edit';
  isOpen: boolean;
  data?: BannerConfigItem;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.banner);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [dataSource, setDataSource] = useState<Array<BannerConfigItem>>(data);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  useDidMount(() => {
    dispatch(getBannerConfig());
  });

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState]);

  const onOpenModal = useCallback((payload: IModalState) => setModalState(payload), []);
  const onCloseModal = useCallback(() => setModalState(undefined), []);

  const onDeleteBanner = useCallback(
    async (id: string) => {
      try {
        const res = await SystemConfigAPI.DELETE_BANNER_CONFIG(id);
        if (res.status) {
          message.success(t('DELETE_BANNER_SUSCESS'));
          dispatch(getBannerConfig());
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
      onCloseModal();
    },
    [dispatch, onCloseModal, t],
  );

  const onMoveRow = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === hoverIndex) return;
      const dragRow = dataSource[dragIndex];
      const temp = dataSource.map((item) => item);
      temp.splice(dragIndex, 1);
      temp.splice(hoverIndex, 0, dragRow);
      const arr = temp.map((item, idx) => SystemConfigAPI.EDIT_BANNER_CONFIG({ id: item.id, position: idx }));
      try {
        await Promise.all(arr);
        dispatch(getBannerConfig());
        message.success(t('UPDATE_POSITION_SUSCESS'));
      } catch (error) {
        message.error(t('UPDATE_POSITION_ERROR'));
      }
    },
    [dataSource, dispatch, t],
  );

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
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
      title: t('IMAGE_TEXT'),
      dataIndex: 'urlContent',
      key: 'urlContent',
      width: 400,
      render: (src: string) => <Image src={src} width={86} height={36} />,
    },
    {
      title: t('EXTERNAL_LINK_TEXT'),
      dataIndex: 'link',
      key: 'link',
      width: 400,
      render: (link: string) => (
        <a target='_blank' rel='noreferrer' href={link}>
          {link}
        </a>
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      key: 'delete',
      render: (_, record: BannerConfigItem) => (
        <>
          <Tooltip title={t('COMMON_BUTTON_DELETE')}>
            <DeleteOutlined
              style={{ color: 'red', marginRight: '15px' }}
              onClick={() => onOpenModal({ type: 'Delete', isOpen: true, data: record })}
            />
          </Tooltip>
          <Tooltip title={t('INFODETAIL_TEXT')}>
            <EditTwoTone onClick={() => onChangeModal({ data: record, isOpen: true, type: 'Edit' })} />
          </Tooltip>
        </>
      ),
    },
  ];

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [modalState, formAdd, formEdit]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;

      if (modalState.type === 'Add') {
        const payload = {
          urlContent: values.urlContent,
          link: values.link,
        };
        try {
          const res = await SystemConfigAPI.ADD_BANNER_CONFIG(payload);
          if (res.id) {
            message.success(t('ADD_BANNER_SUSCESS'));
            dispatch(getBannerConfig());
            onChangeModal(undefined);
          }
        } catch (error) {
          message.error(t('EXTERNAL_LINK_INVALD'));
        }
      }

      if (modalState.type === 'Edit') {
        const payload = {
          urlContent: values.urlContent,
          link: values.link,
        };
        try {
          const res = await SystemConfigAPI.EDIT_BANNER_CONFIG({ id: modalState.data!.id, ...payload });
          if (res.id) {
            message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
            dispatch(getBannerConfig());
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [dispatch, modalState, onChangeModal, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Delete') {
      return (
        <Modal
          onOk={() => onDeleteBanner((modalState.data as BannerConfigItem).id)}
          visible={modalState.isOpen}
          onCancel={onCloseModal}
          cancelText={t('COMMON_BUTTON_CANCEL')}
          okText='Ok'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ fontSize: 30, color: 'yellow', marginRight: 5 }} />
            {t('COMMON_PROMPT_DELETE_BANNER')}
          </div>
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
          title={t('BANNER_TEXT')}
          width={1000}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_ADD')}>
          <Form onFinish={onFinishForm} form={formAdd} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={15}>
                <Form.Item initialValue={modalState.data?.link} name='link' label={t('EXTERNAL_LINK_TEXT')}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <UploadImage
                  fileSizeLimit={2500}
                  src={modalState.data?.urlContent}
                  internalProps={{ isEdit: true, isRect: true }}
                  bannerRatio
                  onChangeImage={(urlContent) => {
                    onChangeModal({
                      ...modalState,
                      data: {
                        ...modalState.data!,
                        urlContent,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'urlContent',
                        value: urlContent,
                        errors: [],
                      },
                    ]);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                  name='urlContent'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    if (modalState.type === 'Edit') {
      if (!modalState.data) return null;
      formEdit.setFields([
        {
          name: 'urlContent',
          value: modalState.data.urlContent,
          errors: [],
        },
      ]);
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('BANNER_TEXT')}
          width={1000}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_UPDATE')}>
          <Form onFinish={onFinishForm} form={formEdit} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={15}>
                <Form.Item initialValue={modalState.data?.link} name='link' label={t('EXTERNAL_LINK_TEXT')}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <UploadImage
                  fileSizeLimit={2500}
                  src={modalState.data?.urlContent}
                  internalProps={{ isEdit: true, isRect: true }}
                  bannerRatio
                  onChangeImage={(urlContent) => {
                    onChangeModal({
                      ...modalState,
                      data: {
                        ...modalState.data!,
                        urlContent,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'urlContent',
                        value: urlContent,
                        errors: [],
                      },
                    ]);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  rules={[{ required: true, message: t('COMMON_IMAGE_REQUIRED_ERROR') }]}
                  name='urlContent'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [formAdd, formEdit, modalState, onChangeModal, onCloseModal, onDeleteBanner, onFinishForm, onSubmitModal, t]);

  return (
    <Card>
      <Row gutter={5} justify='space-between'>
        <Col>
          <Button
            onClick={() =>
              onChangeModal({
                isOpen: true,
                type: 'Add',
              })
            }
            type='primary'>
            {t('ADD_BANNER_TEXT')}
          </Button>
        </Col>
      </Row>
      <br />
      <DndProvider backend={HTML5Backend}>
        <Table
          pagination={false}
          showSorterTooltip={false}
          loading={loading}
          sortDirections={['descend']}
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 700 }}
          onRow={(_, index) =>
            ({
              index,
              onMoveRow,
            } as any)
          }
          components={{
            body: {
              row: DragableBodyRow,
            },
          }}
          rowKey='id'
        />
      </DndProvider>
      {renderModal}
    </Card>
  );
};

export default Index;
