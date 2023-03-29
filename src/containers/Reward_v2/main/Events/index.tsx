/* eslint-disable react/display-name */
import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import Modal from 'antd/lib/modal/Modal';
import { rewardApi } from 'apis/reward';
import { icBbc } from 'assets/images';
import add from 'assets/images/add.png';
import broker from 'assets/images/broker.png';
import component from 'assets/images/component.png';
import main from 'assets/images/main.png';
import sat from 'assets/images/sat.png';
import setting from 'assets/images/setting.png';
import trash from 'assets/images/trash.png';
import vndc from 'assets/images/vndc.png';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import MenuComponent from 'components/Menu';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatter,
  FORMAT_MOMENT,
  Moment,
  parseGetUnixTimeValue,
  parseMoment,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseTime,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getBrokers, getEventsReward } from '../../duck/thunks';
import '../../index.scss';
interface IModalState {
  type: 'Add' | 'Detail';
  data?: IEventReward;
  isOpen: boolean;
  from?: number | Moment;
  to?: number | Moment;
}

const { DATE_SLASH_LONG, DATE_SLASH_SHORT } = FORMAT_MOMENT;
const EventReward = () => {
  const inputSearchRef = useRef<Input | null>(null);
  const { t, i18n } = useTranslation();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const location = useLocation();
  const params = parseParamToObject(location.search);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<Messages[]>([]);
  const [brokerDetail, setBrokerDetail] = useState<IBorker[]>([]);
  const [keyError, setKeyError] = useState<string[]>();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState<IEventRewardRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : undefined,
    to: params.to ? parseGetUnixTimeValue(params.to as string) : undefined,
    name: '',
  });
  const [eventDetail, setEventDetail] = useState<IDetailEventReward>();
  const {
    reward: { listEvent, loading, brokers },
  } = useAppSelector((state) => state);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      dispatch(getEventsReward(paramSearch));
      dispatch(getBrokers());
    }
    if (modalState?.type === 'Detail') {
      formAdd.setFieldsValue({
        id: eventDetail?.id,
        name: eventDetail?.name,
        link: eventDetail?.link,
        prizePool: eventDetail?.prizePool,
        status: eventDetail?.status,
        broker: eventDetail?.broker,
        paidOut: eventDetail?.paidOut,
      });
    }
    if (modalState?.type === 'Add') {
      formAdd.setFieldsValue({
        id: '',
        name: '',
        prizePool: '',
        status: '',
        broker: '',
        paidOut: '',
      });
    }
  }, [dispatch, formAdd, formEdit, modalState, eventDetail, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.REWARD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const onSearchInput = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (keyword) {
        setParamSearch((prev) => ({
          ...prev,
          name: keyword,
          page: 1,
        }));
      } else {
        onClearFilter();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClearFilter],
  );
  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
  }, [formAdd, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        const payload: IEventReward = {
          name: values.name,
          link: values.link,
          timeStart: parseGetUnixTimeValue(values.time[0]),
          timeEnd: parseGetUnixTimeValue(values.time[1]),
          prizePool: values.prizePool,
          currency: values.currency,
          brokerId: values.brokerId,
        };
        await rewardApi
          .CREATE_EVENT_REWARD(payload)
          .then((res) => {
            console.log(res);
            onChangeModal(undefined);
            message.success(t('ADD_EVENT_SUCCESS'));
          })
          .catch((error) => {
            const errors: Messages[] = error.response.data.message;
            setError(errors);
            const err: string[] = [];
            errors.map((item, index) => {
              err.push(item.field);
            });
            setKeyError(err);
            message.error(t('ADD_EVENT_STATUS_ERROR'));
          });
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

  const onChangeDatePicker = useCallback((value: any) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : undefined,
      to: value ? parseGetUnixTimeValue(value[1]) : undefined,
    }));
  }, []);

  const hanldeFindWalletById = useCallback(
    (id: string) => {
      const result: IBorker[] =
        brokers?.filter((item: IBorker, idnex) => {
          return item.id === id;
        }) || [];
      setBrokerDetail(result);
    },
    [setBrokerDetail, brokers],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Add' || modalState.type === 'Detail') {
      return (
        <Modal
          okText={t('CREATE')}
          onOk={onSubmitModal}
          width={343}
          className='create-reward  personal-reward'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          onCancel={() => onChangeModal(undefined)}
          title={t('CREATE_EVENT')}>
          <Form
            onFinish={onFinishForm}
            form={formAdd}
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <Form.Item
              name='name'
              label='Name'
              help={
                keyError?.includes('name')
                  ? error.map((item, index) => {
                      if (item.field === 'name') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('name') ? 'error' : 'success'}
              initialValue={modalState.data?.name}
              rules={[{ required: true, message: t('EVENTREWAR_NAME_REQUIRED_ERROR') }]}>
              <Input placeholder='Vd: Đua xe tuyển ref' />
            </Form.Item>

            <Form.Item
              name='link'
              label='Link'
              help={
                keyError?.includes('link')
                  ? error.map((item, index) => {
                      if (item.field === 'link') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('link') ? 'error' : 'success'}
              initialValue={modalState.data?.link}
              rules={[
                {
                  required: true,
                  message: t('EVENTREWAR_LINK_REQUIRED_ERROR'),
                },
              ]}>
              <Input placeholder='Vd: www.bitback.community' />
            </Form.Item>
            <Form.Item
              name='time'
              help={
                keyError?.includes('timeStart') && keyError?.includes('timeEnd')
                  ? error.map((item, index) => {
                      if (item.field === 'timeStart' || item.field === 'timeEnd') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('timeStart') && keyError?.includes('timeEnd') ? 'error' : 'success'}
              rules={[{ required: true, message: t('EVENTREWAR_TIME_REQUIRED_ERROR') }]}
              label='Thời gian'>
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                format={DATE_SLASH_LONG}
                locale={i18n.language === 'vn' ? vn : undefined}
                allowClear={true}
                defaultValue={[
                  eventDetail?.timeStart ? parseMoment(eventDetail.timeStart) : null,
                  eventDetail?.timeEnd ? parseMoment(eventDetail.timeEnd) : null,
                ]}
                ranges={
                  {
                    [t('TODAY_TEXT')]: parseRangesToday(),
                    [t('YESTERDAY_TEXT')]: parseRanges(1),
                    [t('THIS_WEEK_TEXT')]: parseRanges(7),
                    [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                    [t('LAST_MONTH_TEXT')]: parseRanges(30),
                  } as any
                }
              />
            </Form.Item>
            <Form.Item
              name='brokerId'
              help={
                keyError?.includes('brokerId')
                  ? error.map((item, index) => {
                      if (item.field === 'brokerId') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('brokerId') ? 'error' : 'success'}
              label='Ví Broker'
              rules={[{ required: true, message: t('EVENTREWAR_CURRENCY_REQUIRED_ERROR') }]}
              initialValue={brokers && brokers[0]?.id}>
              <Select onChange={(value: string) => hanldeFindWalletById(value)}>
                {brokers &&
                  brokers.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      <Avatar
                        shape='square'
                        src={item.fullName === 'BitArcade' ? component : item.fullName === 'ONUS' ? main : broker}
                        alt='ic-partner'
                        style={{ width: '24px', height: '24px', marginRight: '7px' }}
                      />
                      {item.fullName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='currency'
              help={
                keyError?.includes('currency')
                  ? error.map((item, index) => {
                      if (item.field === 'currency') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('currency') ? 'error' : 'validating'}
              label={t('REWARD_TOKEN')}
              rules={[{ required: true, message: t('EVENTREWAR_CURRENCY_REQUIRED_ERROR') }]}
              initialValue={modalState.data?.currency || 'BBC'}>
              <Select>
                {brokerDetail[0]?.wallet.map((item, index) => (
                  <Select.Option value={item.code} key={index}>
                    <Avatar
                      shape='square'
                      src={item.name === 'SAT' ? sat : item.name === 'BBC' ? icBbc : vndc}
                      alt='ic-partner'
                      style={{ width: '24px', height: '24px', marginRight: '7px' }}
                    />
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='prizePool'
              label='prizePool'
              help={
                keyError?.includes('prizePool')
                  ? error.map((item, index) => {
                      if (item.field === 'prizePool') return item.message;
                    })
                  : null
              }
              validateStatus={keyError?.includes('prizePool') ? 'error' : 'success'}
              rules={[{ required: true, message: t('EVENTREWAR_PRIZE_POOL_REQUIRED_ERROR') }]}>
              <Input className='BBC' placeholder='BBC' />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [
    formAdd,
    modalState,
    onChangeModal,
    brokerDetail,
    onFinishForm,
    onSubmitModal,
    t,
    hanldeFindWalletById,
    i18n,
    eventDetail,
    brokers,
    keyError,
    error,
  ]);

  const columns = [
    {
      title: (
        <Row align='middle'>
          <Typography.Text className='text-content03' style={{ marginRight: '10', marginBottom: 0 }}>
            STT
          </Typography.Text>
          <ArrowUpOutlined className='icon_size' />
        </Row>
      ),
      dataIndex: 'id',
      key: 'stt',
      width: 80,
      fixed: 'left',
      render: (value: string, record: IDetailEventReward) => (
        <Typography.Text
          copyable
          className='text-content01'
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: value,
          }}>
          {record.id}
        </Typography.Text>
      ),
    },
    {
      title: <Typography.Text className='text-content03'>{t('NAME_EVENT')}</Typography.Text>,
      dataIndex: 'name',
      key: 'nameEvent',
      width: 120,
      render: (value: string, record: IDetailEventReward) => (
        <Link className='text-content01' to={`/reward/event/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: <Typography.Text className='text-content03'>{t('TIME')}</Typography.Text>,
      dataIndex: 'timeStart',
      key: 'prizePool',
      width: 110,
      render: (value: string, record: IDetailEventReward) => (
        <Typography.Text className='text-content01'>
          {parseTime(record.timeStart, DATE_SLASH_SHORT)} - {parseTime(record.timeEnd, DATE_SLASH_SHORT)}
        </Typography.Text>
      ),
    },
    {
      title: (
        <Row align='middle'>
          <Typography.Text className='text-content03' style={{ marginRight: '10', marginBottom: 0 }}>
            Prize pool
          </Typography.Text>
          <ArrowDownOutlined className='icon_size' />
        </Row>
      ),
      dataIndex: 'totalAmount',
      key: 'prizePool',
      width: 100,
      render: (value: string, record: IDetailEventReward) => (
        <Typography.Text className='text-content01'>{formatter.format(Number(record.prizePool))}</Typography.Text>
      ),
    },

    {
      title: <Typography.Text className='text-content03'>{t('TOTAL_PRIZE_POOL')}</Typography.Text>,
      dataIndex: 'totalPaid',
      key: 'totalPaid',
      width: 140,
      render: (value: string, record: IDetailEventReward) => (
        <Typography.Text className='text-content01'>{formatter.format(Number(record.paidOut))}</Typography.Text>
      ),
    },
    {
      title: (
        <div className='text-content03'>
          <MenuComponent
            menu={[
              {
                name: t('GLOBAL_CONFIG'),
              },
              {
                name: t('GLOBAL_CONFIG'),
              },
            ]}
            title={t('STATUS_TEXT')}
            icon={<DownOutlined className='icon_size' />}
            onChangeStatus={onChangeDatePicker}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (value: string, record: IDetailEventReward) => (
        <Typography.Text className='text-content01'>{record.status}</Typography.Text>
      ),
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 118,
      render: (value: string, record: IDetailEventReward) => (
        <Row gutter={[9, 1]} justify='space-between' align='middle'>
          <Col span={12}>
            <Button
              className='text-content01 btn-detail'
              onClick={() => {
                onChangeModal({ isOpen: true, type: 'Detail' });
                setEventDetail(record);
              }}>
              {t('DETAIL')}
            </Button>
          </Col>
          <Col span={6} textAlign='right'>
            <Avatar shape='square' src={trash} alt='ic-partner' style={{ width: '22px', height: '19px' }} />
          </Col>
          <Col span={6}>
            <Avatar shape='square' src={setting} alt='ic-partner' style={{ width: '22px', height: '19px' }} />
          </Col>
        </Row>
      ),
    },
  ];
  console.log(listEvent);
  return (
    <>
      <Row className='mb-32 mt-20'>
        <Typography.Text className='headline-07'>{t('MENU_REWARD')}</Typography.Text>
      </Row>
      <Row className='mb-16 '>
        <Typography.Text className='headline-04'>{t('LIST_EVENT')}</Typography.Text>
      </Row>
      <Row justify='space-between' className='reward-body' gutter={[0, 7]}>
        <Col span={12}>
          <Input.Search
            ref={inputSearchRef}
            className='icon-search form-search-envetReward'
            defaultValue={paramSearch.name}
            onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_KEYWORD_TEXT')}
            allowClear
          />
        </Col>
        <Col span={12} className='ps-r'>
          <Row gutter={[5, 5]} justify='end'>
            <Col span={12}>
              <DatePicker.RangePicker
                className='mod-datepicker'
                format={DATE_SLASH_LONG}
                locale={i18n.language === 'vn' ? vn : undefined}
                allowClear={true}
                onChange={onChangeDatePicker}
                value={[
                  paramSearch.from ? parseMoment(paramSearch.from) : null,
                  paramSearch.to ? parseMoment(paramSearch.to) : null,
                ]}
                ranges={
                  {
                    [t('TODAY_TEXT')]: parseRangesToday(),
                    [t('YESTERDAY_TEXT')]: parseRanges(1),
                    [t('THIS_WEEK_TEXT')]: parseRanges(7),
                    [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                    [t('LAST_MONTH_TEXT')]: parseRanges(30),
                  } as any
                }
              />
            </Col>
            <Col span={7}>
              <Button className='btn_event bg-gray' onClick={() => onChangeModal({ isOpen: true, type: 'Add' })}>
                <Avatar
                  shape='square'
                  src={add}
                  alt='ic-partner'
                  style={{ width: '22px', height: '19px', marginRight: '7px' }}
                />
                <Typography.Text className='btn_event_link'>Tạo sự kiện</Typography.Text>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className='mod-table'>
        <Table
          pagination={{
            total: listEvent?.totalRecords,
            pageSize: DEFAULT_PAGE_SIZE,
            current: Number(paramSearch.page) || 1,
          }}
          showSorterTooltip={false}
          sortDirections={['descend']}
          onChange={onChangeTable}
          dataSource={listEvent ? listEvent.data : []}
          loading={loading}
          columns={[...columns] as any}
          scroll={{ x: 850 }}
          rowKey='id'
        />
      </div>
      {renderModal}
    </>
  );
};

export default EventReward;
