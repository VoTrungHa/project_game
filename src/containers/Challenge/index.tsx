/* eslint-disable react/display-name */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Statistic,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { GameAPI } from 'apis/game';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { TextEditor } from 'components/Texteditor';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { BIT_PLAY_CHALLENGE_STATUS, DEFAULT_PAGE_SIZE, STATUS, STATUS_GAME } from 'constants/index';
import { getListGame } from 'containers/Game/duck/thunks';
import {
  formatMoment,
  formatter,
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
import { getListChallenge } from './duck/thunks';

interface IModalState {
  type: 'Add' | 'Update';
  data?: IChallengeItem;
  isOpen: boolean;
}

const { DATE_TIME_SHORT, DATE_TIME_LONG, TIME_SHORT, DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState<{ page: number; keyword?: string }>({
    page: 1,
  });
  const {
    challenge: { data, totalRecords, loading },
    game: { data: listGame },
  } = useAppSelector((state) => state);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [totalPrize, setTotalPrize] = useState(0);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      setTotalPrize(0);
      dispatch(getListChallenge({ ...paramSearch, size: DEFAULT_PAGE_SIZE }));
    }
  }, [dispatch, formAdd, formEdit, modalState, paramSearch]);

  const listGameId = useMemo(() => {
    if (!listGame) return [];
    return listGame.map((item) => ({ value: item.id, text: item.name, status: item.status }));
  }, [listGame]);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onSearchInput = useCallback((value: string) => {
    const keyword = value.trim();
    setParamSearch((prev) => ({
      ...prev,
      keyword: keyword ? keyword : undefined,
    }));
  }, []);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }
      return Promise.resolve();
    },
    [t],
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
            free: values.type === STATUS_GAME.FREE,
            prizeRanking: values.prizeRanking.reduce((acc, cur, idx) => {
              acc[idx + 1] = Number(cur.price);
              return acc;
            }, {}),
            timeStart: parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
            timeEnd: parseGetUnixTimeValue(values.timeEnd),
          };
          const res = await GameAPI.ADD_CHALLENGE(payload);
          if (res.id) {
            message.success(t('ADD_CHALLENGE_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }

      if (modalState.type === 'Update') {
        if (!modalState.data) return;
        try {
          const payload = {
            ...values,
            free: values.type === STATUS_GAME.FREE,
            prizeRanking: values.prizeRanking.reduce((acc, cur, idx) => {
              acc[idx + 1] = Number(cur.price);
              return acc;
            }, {}),
            timeStart:
              parseIsSame(values.timeStart, modalState.data.timeStart) ||
              modalState.data?.status !== BIT_PLAY_CHALLENGE_STATUS.PENDING
                ? undefined
                : parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
            gameId: modalState.data?.status !== BIT_PLAY_CHALLENGE_STATUS.PENDING ? undefined : values.gameId,
            timeEnd: parseGetUnixTimeValue(values.timeEnd),
          };
          const res = await GameAPI.EDIT_CHALLENGE({ ...payload, id: modalState.data.id });
          if (res.id) {
            message.success(t('UPDATE_CHALLENGE_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [modalState, t, onChangeModal],
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
          title={t('ADD_CHALLENGE')}
          width={1200}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('ADD_CHALLENGE')}>
          <Form
            form={formAdd}
            onFinish={onFinishForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            onFieldsChange={(fieldChange) => {
              if (fieldChange[0].name[0] === 'prizeRanking') {
                const list = formAdd.getFieldValue('prizeRanking');
                const value = list.reduce((acc, cur) => {
                  acc += cur.price ? Number(cur.price) : 0;
                  return acc;
                }, 0);
                if (value !== totalPrize) setTotalPrize(value);
              }
            }}>
            <Row>
              <Col span={15}>
                <Form.Item
                  name='title'
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
                  <TextEditor />
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
                <Form.Item name='type' label={t('TYPE_TEXT')} initialValue={STATUS_GAME.FREE}>
                  <Radio.Group>
                    <Radio value={STATUS_GAME.FREE}>{t('FREE_TEXT')}</Radio>
                    <Radio value={STATUS_GAME.PAID}>{t('PAID_TEXT')}</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name='gameId'
                  label={t('GAME_TEXT')}
                  required
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_GAME_REQUIRED_ERROR'),
                    },
                  ]}>
                  <Select style={{ width: 180 }} placeholder='GameId'>
                    {listGameId.map((item) => (
                      <Select.Option key={item.value} value={item.value} disabled={item.status === STATUS.INACTIVE}>
                        {item.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9}>
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
                <Form.Item
                  labelAlign='left'
                  labelCol={{ span: 24 }}
                  label={
                    <>
                      <Typography.Text>{t('PRIZE_TEXT')}</Typography.Text>: {formatter.format(totalPrize)} Sat
                    </>
                  }
                  required
                />
                <Card style={{ maxHeight: 440, overflowY: 'scroll' }}>
                  <Form.List
                    name='prizeRanking'
                    initialValue={[{ price: undefined }, { price: undefined }, { price: undefined }]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space
                            key={field.key}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <Form.Item
                              {...field}
                              required={false}
                              label={`${t('POSITION')} ${index + 1}`}
                              name={[field.name, 'price']}
                              fieldKey={[field.fieldKey, 'price']}
                              rules={[{ required: true, message: t('MISSING_REWARD') }]}>
                              <InputNumber placeholder={t('REWARD_TEXT')} />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                            {t('COMMON_BUTTON_ADD')}
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
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
          title={t('UPDATE_CHALLENGE')}
          width={1200}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('UPDATE_CHALLENGE')}>
          <Form
            form={formEdit}
            onFinish={onFinishForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            onFieldsChange={(fieldChange) => {
              if (fieldChange[0].name[0] === 'prizeRanking') {
                const list = formEdit.getFieldValue('prizeRanking');
                const value = list.reduce((acc, cur) => {
                  acc += cur.price ? Number(cur.price) : 0;
                  return acc;
                }, 0);
                if (value !== totalPrize) setTotalPrize(value);
              }
            }}>
            <Row>
              <Col span={16}>
                <Form.Item
                  initialValue={modalState.data.title}
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                    { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data?.information}
                  name='information'
                  label={t('INFORMATION_TEXT')}
                  rules={[{ required: true, message: t('COMMON_INFORMATION_REQUIRED_ERROR') }]}>
                  <TextEditor />
                </Form.Item>
                <Form.Item
                  required
                  rules={[{ validator: checkValueStart }]}
                  name='timeStart'
                  label={t('TIME_START')}
                  initialValue={parseDate(timeStart, DATE_TIME_SHORT)}>
                  <DatePicker
                    disabled={modalState.data.status !== BIT_PLAY_CHALLENGE_STATUS.PENDING}
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
                <Form.Item
                  name='type'
                  label={t('TYPE_TEXT')}
                  initialValue={modalState.data?.free ? STATUS_GAME.FREE : STATUS_GAME.PAID}>
                  <Radio.Group>
                    <Radio value={STATUS_GAME.FREE}>{t('FREE_TEXT')}</Radio>
                    <Radio value={STATUS_GAME.PAID}>{t('PAID_TEXT')}</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  initialValue={modalState.data.game?.id}
                  name='gameId'
                  label={t('GAME_TEXT')}
                  required
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_GAME_REQUIRED_ERROR'),
                    },
                  ]}>
                  <Select
                    style={{ width: 180 }}
                    placeholder='GameId'
                    disabled={modalState.data.status !== BIT_PLAY_CHALLENGE_STATUS.PENDING}>
                    {listGameId.map((item) => (
                      <Select.Option key={item.value} value={item.value} disabled={item.status === STATUS.INACTIVE}>
                        {item.text}
                      </Select.Option>
                    ))}
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
                <Form.Item
                  labelAlign='left'
                  labelCol={{ span: 24 }}
                  label={
                    <>
                      <Typography.Text>{t('PRIZE_TEXT')}</Typography.Text>: {formatter.format(totalPrize)} Sat
                    </>
                  }
                  required
                />
                <Card style={{ maxHeight: 440, overflowY: 'scroll' }}>
                  <Form.List
                    name='prizeRanking'
                    initialValue={Object.keys(modalState.data.prizeRanking).map((key) => ({
                      price: modalState.data?.prizeRanking[key],
                    }))}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space
                            key={field.key}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <Form.Item
                              {...field}
                              required={false}
                              label={`${t('POSITION')} ${index + 1}`}
                              name={[field.name, 'price']}
                              fieldKey={[field.fieldKey, 'price']}
                              rules={[{ required: true, message: t('MISSING_REWARD') }]}>
                              <InputNumber placeholder={t('REWARD_TEXT')} />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                            {t('COMMON_BUTTON_ADD')}
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [
    checkValueStart,
    formAdd,
    formEdit,
    i18n.language,
    listGameId,
    modalState,
    onChangeModal,
    onFinishForm,
    onSubmitModal,
    t,
    totalPrize,
  ]);

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
      dataIndex: 'title',
      key: 'title',
      render: (value: string, record: IChallengeItem) => (
        <Textlink
          text={value}
          onClick={() => {
            setTotalPrize(record.prizePool);
            dispatch(getListGame()).then(() => {
              setModalState({ isOpen: true, type: 'Update', data: record });
            });
          }}
        />
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
      title: t('PRIZE_POOL'),
      dataIndex: 'prizePool',
      key: 'prizePool',
      render: (value) => formatter.format(value),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <>
          {status === BIT_PLAY_CHALLENGE_STATUS.PENDING && (
            <Typography.Text type='warning'>{t('PENDING_SCHEDULE_TEXT')}</Typography.Text>
          )}
          {status === BIT_PLAY_CHALLENGE_STATUS.FINISH && (
            <Typography.Text type='danger'>{t('FINISH_SCHEDULE_TEXT')}</Typography.Text>
          )}
          {status === BIT_PLAY_CHALLENGE_STATUS.RUNNING && (
            <Typography.Text type='success'>{t('RUNNING_SCHEDULE_TEXT')}</Typography.Text>
          )}
          {status === BIT_PLAY_CHALLENGE_STATUS.PAID_OUT && <Typography.Text>{t('PAID_OUT_TEXT')}</Typography.Text>}
        </>
      ),
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
      <Row gutter={[5, 5]}>
        <Col xs={24} md={8}>
          <Input.Search
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_INPUT_TEXT')}
            allowClear
          />
        </Col>
        <Col xs={24} md={16} textAlign='right'>
          <Button
            onClick={() => {
              dispatch(getListGame()).then(() => {
                setModalState({ isOpen: true, type: 'Add' });
              });
            }}
            type='primary'>
            {t('ADD_CHALLENGE')}
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <Card>
            <Statistic title='lorem ipsum' value={100} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='lorem ipsum' value={100} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='lorem ipsum' value={100} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='lorem ipsum' value={100} />
          </Card>
        </Col>
      </Row>
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
