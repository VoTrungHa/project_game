/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
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
import vn from 'antd/es/date-picker/locale/vi_VN';
import { FriendInvitationEventAPI } from 'apis/friendInvitation';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { DEFAULT_PAGE_SIZE, EVENT_STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatDate,
  formatMoment,
  FORMAT_MOMENT,
  Moment,
  parseDate,
  parseGetUnixTimeValue,
  parseGetUnixTimeValueAddMinutes,
  parseIsAfter,
  parseIsSame,
  parseTime,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListEvent } from './duck/thunks';

const { ALL, ACTIVE, INACTIVE } = EVENT_STATUS;
const { DATE_TIME_LONG, DATE_TIME_SHORT, DATE_TIME_SLASH_LONG, TIME_SHORT } = FORMAT_MOMENT;
interface IModalState {
  type: 'Add' | 'Update';
  data?: IEventItem;
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    friendInvitationEvent: { data, loading, totalRecords },
  } = useAppSelector((state) => state);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState<IEventListRequest>({
    page: 1,
    status: ALL,
  });
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      dispatch(
        getListEvent({
          ...paramSearch,
          size: DEFAULT_PAGE_SIZE,
          status: paramSearch.status === ALL ? undefined : paramSearch.status,
        }),
      );
    }
  }, [dispatch, formAdd, modalState, paramSearch]);

  const onChangeStatus = useCallback(
    (value: number) => setParamSearch((prev) => ({ ...prev, page: 1, status: value })),
    [],
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (value: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer', width: '120px' }}
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
      width: 150,
      render: (value: string, record: IEventItem) => (
        <Textlink text={value} onClick={() => onChangeModal({ type: 'Update', isOpen: true, data: record })} />
      ),
    },
    {
      title: t('INFORMATION_TEXT'),
      dataIndex: 'information',
      key: 'information',
      width: 180,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: EVENT_STATUS) => <Status active={ACTIVE === status} />,
    },
    {
      title: t('TIME_START'),
      dataIndex: 'timeStart',
      key: 'timeStart',
      width: 150,
      render: (timeStart: string) => formatMoment(timeStart, DATE_TIME_SLASH_LONG),
    },
    {
      title: t('TIME_END'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      width: 150,
      render: (timeEnd: string) => formatMoment(timeEnd, DATE_TIME_SLASH_LONG),
    },
  ];

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      if (Number(paramSearch.page) === pagination.current) return;
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current || 1,
        }));
      }
    },
    [paramSearch.page],
  );

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (!modalState) return;
      if (modalState.data && modalState.data.timeStart) {
        const timeStartDefault = formatMoment(modalState.data.timeStart, DATE_TIME_SHORT);
        if (parseIsSame(time, timeStartDefault)) {
          return Promise.resolve();
        }
      }
      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }
      const now = formatDate(DATE_TIME_LONG);
      const value = formatMoment(time, DATE_TIME_LONG);
      const compare = parseIsAfter(value, now);
      if (!compare) {
        return Promise.reject(new Error(t('START_MUST_BE_GREATER_THAN_NOW')));
      }
      return Promise.resolve();
    },
    [modalState, t],
  );

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
          const payload = {
            ...values,
            timeStart: parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
            timeEnd: parseGetUnixTimeValue(values.timeEnd),
          };
          const res = await FriendInvitationEventAPI.ADD_EVENT(payload);
          if (res.id) {
            message.success(t('ADD_HOMEPAGE_CONFIG_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }

      if (modalState.type === 'Update') {
        if (!modalState.data) return;
        const timeStartDefault = formatMoment(modalState.data.timeStart, DATE_TIME_SHORT);
        try {
          const payload = {
            ...values,
            timeStart: parseIsSame(values.timeStart, timeStartDefault)
              ? undefined
              : parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
            timeEnd: parseGetUnixTimeValue(values.timeEnd),
          };
          const res = await FriendInvitationEventAPI.EDIT_EVENT({ ...payload, id: modalState.data?.id });
          if (res.id) {
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

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('COMMON_BUTTON_ADD_EVENT')}
          width={800}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_ADD_EVENT')}>
          <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
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
                  name='information'
                  label={t('INFORMATION_TEXT')}
                  rules={[{ required: true, message: t('COMMON_INFORMATION_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={ACTIVE}>
                  <Select>
                    <Select.Option value={ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                    <Select.Option value={INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item required rules={[{ validator: checkValueStart }]} name='timeStart' label={t('TIME_START')}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  required
                  name='timeEnd'
                  label={t('TIME_END')}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }
                        const start = formatMoment(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = formatMoment(time, DATE_TIME_LONG);
                        const compare = parseIsAfter(end, start);
                        if (!compare) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        return Promise.resolve();
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
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    if (modalState.type === 'Update') {
      if (!modalState.data) return null;
      const timeStart = parseTime(modalState.data?.timeStart, DATE_TIME_SHORT);
      const timeEnd = parseTime(modalState.data?.timeEnd, DATE_TIME_SHORT);
      return (
        <Modal
          centered
          onCancel={() => onChangeModal(undefined)}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('UPDATE_EVENT')}
          width={800}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('UPDATE_EVENT')}>
          <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='name'
                  initialValue={modalState.data.name}
                  label={t('TITLE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                    { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='information'
                  initialValue={modalState.data.information}
                  label={t('INFORMATION_TEXT')}
                  rules={[{ required: true, message: t('COMMON_INFORMATION_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={modalState.data.status}>
                  <Select>
                    <Select.Option value={ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                    <Select.Option value={INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  required
                  rules={[{ validator: checkValueStart }]}
                  name='timeStart'
                  label={t('TIME_START')}
                  initialValue={parseDate(timeStart, DATE_TIME_SHORT)}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                  />
                </Form.Item>
                <Form.Item
                  initialValue={parseDate(timeEnd, DATE_TIME_SHORT)}
                  required
                  name='timeEnd'
                  label={t('TIME_END')}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }
                        const start = formatMoment(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = formatMoment(time, DATE_TIME_LONG);
                        const compare = parseIsAfter(end, start);
                        if (!compare) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        return Promise.resolve();
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
                <Link style={{ marginRight: 5 }} to={`${PATH.FRIENDINVITATIONEVENTDETAIL}/${modalState.data.id}`}>
                  {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
                </Link>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [checkValueStart, formAdd, formEdit, i18n.language, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col span={8}>
          <Select style={{ width: 170 }} onChange={onChangeStatus} defaultValue={ALL}>
            <Select.Option value={ALL}>{t('ALL_TEXT')}</Select.Option>
            <Select.Option value={ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
            <Select.Option value={INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
          </Select>
        </Col>
        <Col span={16} textAlign='right'>
          <Button type='primary' onClick={() => onChangeModal({ type: 'Add', isOpen: true })}>
            {t('COMMON_BUTTON_ADD_EVENT')}
          </Button>
        </Col>
      </Row>
      <Divider />
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page),
          showSizeChanger: false,
        }}
        onChange={onChangeTable}
        loading={loading}
        dataSource={data}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='createdAt'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
