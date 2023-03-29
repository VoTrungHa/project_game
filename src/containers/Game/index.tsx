/* eslint-disable react/display-name */
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { GameAPI } from 'apis/game';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { TextEditor } from 'components/Texteditor';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { DEFAULT_PAGE_SIZE, STATUS } from 'constants/index';
import { formatMoment, FORMAT_MOMENT } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListGame } from './duck/thunks';

interface IModalState {
  type: 'Add' | 'Update';
  data?: IGameItem;
  isOpen: boolean;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const Index: React.FC = () => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const dispatch = useAppDispatch();
  const {
    game: { data, totalRecords, loading },
  } = useAppSelector((state) => state);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [paramSearch, setParamSearch] = useState({
    page: 1,
  });

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      dispatch(getListGame({ ...paramSearch, size: DEFAULT_PAGE_SIZE }));
    }
  }, [dispatch, formAdd, formEdit, modalState, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Update') {
      formEdit.submit();
    }
  }, [modalState, formAdd, formEdit]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        try {
          const res = await GameAPI.ADD_GAME(values);
          if (res.id) {
            message.success(t('ADD_GAME_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          if (error.response.data.message[0].field === 'source') {
            message.error(t('SOURCE_INVALID'));
          } else {
            message.error(t('ADD_GAME_ERROR'));
          }
        }
      }

      if (modalState.type === 'Update') {
        if (!modalState.data) return;
        try {
          const res = await GameAPI.EDIT_GAME({ ...values, id: modalState.data.id });
          if (res.updatedAt) {
            message.success(t('EDIT_GAME_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          if (error.response.data.message[0].field === 'source') {
            message.error(t('SOURCE_INVALID'));
          } else {
            message.error(t('EDIT_GAME_ERROR'));
          }
        }
      }
    },
    [modalState, onChangeModal, t],
  );

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('ADD_GAME_TEXT')}
          width={1200}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('ADD_GAME_TEXT')}>
          <Form onFinish={onFinishForm} form={formAdd} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={16}>
                <Form.Item
                  name='name'
                  label={t('TITLE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                    { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='description'
                  label={t('DESCRIPTION_TEXT')}
                  rules={[{ required: true, message: t('COMMON_DESCRIPTION_REQUIRED_ERROR') }]}>
                  <TextEditor />
                </Form.Item>
                <Form.Item
                  name='source'
                  label='Source'
                  rules={[{ required: true, message: t('COMMON_SOURCE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={STATUS.ACTIVE}>
                  <Select>
                    <Select.Option value={STATUS.ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                    <Select.Option value={STATUS.INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <UploadImage
                  src={modalState.data?.banner}
                  internalProps={{ isEdit: true, isRect: true }}
                  onChangeImage={(url) => {
                    onChangeModal({
                      ...modalState,
                      data: {
                        ...modalState.data!,
                        banner: url,
                      },
                    });
                    formAdd.setFields([
                      {
                        name: 'banner',
                        value: url,
                        errors: [],
                      },
                    ]);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  name='banner'
                  initialValue={modalState.data?.banner}
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_BANNER_REQUIRED_ERROR'),
                    },
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    if (modalState.type === 'Update') {
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('EDIT_GAME_TEXT')}
          width={1200}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('EDIT_GAME_TEXT')}>
          <Row>
            <Col span={16}>
              <Form onFinish={onFinishForm} form={formEdit} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                <Form.Item
                  initialValue={modalState.data?.name}
                  name='name'
                  label={t('TITLE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                    { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data?.description}
                  name='description'
                  label={t('DESCRIPTION_TEXT')}
                  rules={[{ required: true, message: t('COMMON_DESCRIPTION_REQUIRED_ERROR') }]}>
                  <TextEditor />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data?.source}
                  name='source'
                  label='Source'
                  rules={[{ required: true, message: t('COMMON_SOURCE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={modalState.data?.status}>
                  <Select>
                    <Select.Option value={STATUS.ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                    <Select.Option value={STATUS.INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <UploadImage
                src={modalState.data?.banner}
                internalProps={{ isEdit: true, isRect: true }}
                onChangeImage={(url) => {
                  onChangeModal({
                    ...modalState,
                    data: {
                      ...modalState.data!,
                      banner: url,
                    },
                  });
                  formAdd.setFields([
                    {
                      name: 'banner',
                      value: url,
                      errors: [],
                    },
                  ]);
                }}
              />
            </Col>
          </Row>
        </Modal>
      );
    }
  }, [formAdd, formEdit, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
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
      dataIndex: 'name',
      key: 'name',
      render: (value: string, record: IGameItem) => (
        <Textlink text={value} onClick={() => onChangeModal({ type: 'Update', isOpen: true, data: record })} />
      ),
    },
    {
      title: t('BANNER_TEXT'),
      dataIndex: 'banner',
      key: 'banner',
      width: 400,
      render: (src: string) => <Image src={src} width={100} height={50} />,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 400,
      render: (src: string) => (
        <Link to={src} target='_blank'>
          {src}
        </Link>
      ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={status === STATUS.ACTIVE} />,
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
      <Row gutter={[5, 10]}>
        <Col span={24} textAlign='right'>
          <Button onClick={() => onChangeModal({ isOpen: true, type: 'Add' })} type='primary'>
            {t('ADD_GAME_TEXT')}
          </Button>
        </Col>
      </Row>
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        sortDirections={['descend']}
        onChange={onChangeTable}
        dataSource={data}
        loading={loading}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
