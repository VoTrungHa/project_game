/* eslint-disable react/display-name */
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { FriendInvitationEventAPI } from 'apis/friendInvitation';
import { Col, Row } from 'components/Container';
import { DEFAULT_PAGE_SIZE, EVENT_STATUS } from 'constants/index';
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
import { useParams } from 'react-router-dom';
import { getEventById, getRanking } from './duck/thunks';

const { DATE_TIME_SHORT, TIME_SHORT, DATE_TIME_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { eventId: id } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();
  const {
    friendInvitationEventDetail: { loading, listRanking, event },
  } = useAppSelector((state) => state);
  const [paramSearch, setParamSearch] = useState<IEventListRequest>({
    page: 1,
  });

  useEffect(() => {
    if (!id) return;
    dispatch(getRanking({ ...paramSearch, id, size: DEFAULT_PAGE_SIZE }));
    dispatch(getEventById(id));
  }, [dispatch, id, paramSearch]);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (event) {
        const timeStartDefault = formatMoment(event.timeStart, DATE_TIME_SHORT);
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
    [event, t],
  );

  const onFinishForm = useCallback(
    async (values) => {
      if (!event) return;
      const timeStartDefault = formatMoment(event.timeStart, DATE_TIME_SHORT);
      try {
        const payload = {
          ...values,
          timeStart: parseIsSame(values.timeStart, timeStartDefault)
            ? undefined
            : parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
          timeEnd: parseGetUnixTimeValue(values.timeEnd),
        };
        const res = await FriendInvitationEventAPI.EDIT_EVENT({ ...payload, id });
        if (res.id) {
          message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
          dispatch(getEventById(id));
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [event, id, t, dispatch],
  );

  const renderForm = useMemo(() => {
    if (!id || !event) return null;
    const timeStart = parseTime(event.timeStart, DATE_TIME_SHORT);
    const timeEnd = parseTime(event.timeEnd, DATE_TIME_SHORT);
    return (
      <Form onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Row>
          <Col span={10}>
            <Form.Item
              name='name'
              initialValue={event.name}
              label={t('TITLE_TEXT')}
              rules={[
                { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              name='information'
              initialValue={event.information}
              label={t('INFORMATION_TEXT')}
              rules={[{ required: true, message: t('COMMON_INFORMATION_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
            <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={event.status}>
              <Select>
                <Select.Option value={EVENT_STATUS.ACTIVE}>{t('ACTIVE_TEXT')}</Select.Option>
                <Select.Option value={EVENT_STATUS.INACTIVE}>{t('INACTIVE_TEXT')}</Select.Option>
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='submit'>
                {t('UPDATE_EVENT')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [checkValueStart, event, i18n.language, id, onFinishForm, t]);

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
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'value',
      key: 'value',
    },
  ];

  if (!id) return <Empty />;

  return (
    <Card>
      {renderForm}
      <Divider />
      <Table
        pagination={{
          total: listRanking.totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page),
          showSizeChanger: false,
        }}
        onChange={onChangeTable}
        loading={loading}
        dataSource={listRanking.data}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
    </Card>
  );
};

export default Index;
