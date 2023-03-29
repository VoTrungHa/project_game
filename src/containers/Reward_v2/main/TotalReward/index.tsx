/* eslint-disable react/display-name */
import { DownOutlined } from '@ant-design/icons';
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
import { SatoshiGameAPI } from 'apis/satoshigame';
import { icBbc } from 'assets/images';
import sat from 'assets/images/sat.png';
import vndc from 'assets/images/vndc.png';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import MenuComponent from 'components/Menu';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  FORMAT_MOMENT,
  Moment,
  parseGetUnixTimeValue,
  parseMoment,
  parseObjectToParam,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getAccount } from '../../duck/thunks';
import '../../index.scss';

interface IModalState {
  type: 'Add';
  data?: IAccount[];
  isOpen: boolean;
  from?: number | Moment;
  to?: number | Moment;
}

const { DATE_SLASH_LONG } = FORMAT_MOMENT;
const TotalReward = () => {
  const inputSearchRef = useRef<Input | null>(null);
  const { t, i18n } = useTranslation();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [rowkeys, setRowKeys] = useState({
    selectedRowKeys: [],
    loading: false,
  });

  const {
    reward: { list, loading },
  } = useAppSelector((state) => state);

  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);

  const [paramSearch, setParamSearch] = useState<IAccountRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    status: null,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : undefined,
    to: params.to ? parseGetUnixTimeValue(params.to as string) : undefined,
  });

  const dispatch = useAppDispatch();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useEffect(() => {
    dispatch(getAccount(paramSearch));
    history.push({ pathname: PATH.REWARD, search: parseObjectToParam(paramSearch) });
  }, [paramSearch, dispatch, history, t]);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

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
        try {
          const res = await SatoshiGameAPI.ADD_EVENT({
            ...values,
            totalAmount: values.totalAmount.replaceAll(',', ''),
          });
          if (res.currency.id) {
            message.success(t('COMMON_ADD_REWARD_GAME_SUCCESS'));
            onChangeModal(undefined);
          }
        } catch (error) {
          message.error(t('COMMON_ADD_REWARD_GAME_ERROR'));
        }
      }
    },
    [modalState, onChangeModal, t],
  );

  const onSelectChange = (selectedRowKeys) => {
    setRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: rowkeys.selectedRowKeys,
    onChange: onSelectChange,
  };
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

  const onChangeStatus = useCallback((value: number) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      status: value,
    }));
  }, []);

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
          keyword,
          page: 1,
        }));
      } else {
        onClearFilter();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClearFilter],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Add') {
      return (
        <Modal
          okText={t('CREATE')}
          onOk={onSubmitModal}
          width={343}
          style={{ borderRadius: '5px' }}
          className='create-reward personal-reward'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          title={t('PERSONAL_REWARD')}
          onCancel={() => onChangeModal(undefined)}>
          <Form
            onFinish={onFinishForm}
            form={formAdd}
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <Form.Item name='title' label='Tiêu đề' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input placeholder='Vd: Phần thưởng BitArcade' />
            </Form.Item>
            <Form.Item name='title1' label='Link' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input placeholder='Vd: Nhận thưởng 500 BBC từ BitArcade' />
            </Form.Item>
            <Form.Item name='status' label={t('REWARD_TOKEN')} initialValue={1}>
              <Select>
                <Select.Option value={1}>
                  <Avatar
                    shape='square'
                    src={icBbc}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  BBC
                </Select.Option>
                <Select.Option value={2}>
                  <Avatar
                    shape='square'
                    src={sat}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  SAT
                </Select.Option>
                <Select.Option value={3}>
                  <Avatar
                    shape='square'
                    src={vndc}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  VNDC
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name='title2' label='Phần thưởng' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input className='BBC' placeholder='BBC' />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [formAdd, modalState, onChangeModal, onFinishForm, onSubmitModal, t]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40,
      fixed: 'left',
      render: (value: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          className='text-content01'
          ellipsis={{
            tooltip: value,
          }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t('ACCOUNT_TEXT'),
      dataIndex: 'fullName',
      key: 'account',
      width: 70,
      render: (value: string, record: IAccount) => (
        <Typography.Text className='text-content01'>{value}</Typography.Text>
      ),
    },
    {
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
      width: 100,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'totalPaid',
      width: 60,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: (
        <MenuComponent
          menu={[
            {
              name: t('KYC_ACCOUNTS_TEXT'),
              value: 1,
            },
            {
              name: t('NON_KYC_ACCOUNTS_TEXT'),
              value: 0,
            },
          ]}
          title={t('STATUS_TEXT')}
          icon={<DownOutlined className='icon_size' />}
          onChangeStatus={onChangeStatus}
        />
      ),
      dataIndex: 'status',
      key: 'status',
      width: 60,
      render: (value: number) => (
        <Typography.Text className='text-content01' type={value === 1 ? 'success' : 'danger'}>
          {value === 1 ? 'Đã KYC' : 'Chưa KYC'}
        </Typography.Text>
      ),
    },
    {
      title: (
        <Button className='button-reward' onClick={() => onChangeModal({ isOpen: true, type: 'Add' })}>
          <Link to={'/'}>{t('ALL_REWARD')}</Link>
        </Button>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 80,
      render: () => (
        <Button
          style={{ width: '100%', borderRadius: '4px' }}
          className='text-content01 text-center'
          onClick={() => onChangeModal({ isOpen: true, type: 'Add' })}>
          {t('PERSONAL_REWARD')}
        </Button>
      ),
    },
  ];
  return (
    <>
      <Row className='mb-16'>
        <Typography.Text className='headline-04 '>{t('LIST_REWARD')}</Typography.Text>
      </Row>

      <Row justify='space-between' gutter={[0, 7]}>
        <Col span={12}>
          <Input.Search
            className='icon-search form-search'
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_KEYWORD_TEXT')}
            allowClear
          />
        </Col>
        <Col span={6} className='ps-r'>
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
      </Row>
      <div className='mod-table'>
        <Table
          pagination={{
            total: list ? list.totalRecords : 0,
            pageSize: DEFAULT_PAGE_SIZE,
            current: Number(paramSearch.page) || 1,
            showSizeChanger: false,
          }}
          showSorterTooltip={false}
          sortDirections={['descend']}
          onChange={onChangeTable}
          dataSource={list ? list.data : []}
          rowSelection={rowSelection}
          loading={loading}
          columns={[...columns] as any}
          scroll={{ x: 750 }}
          rowKey='id'
        />
      </div>
      {renderModal}
    </>
  );
};

export default TotalReward;
