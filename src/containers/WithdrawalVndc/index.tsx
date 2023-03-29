/* eslint-disable react/display-name */
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Statistic,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { BitfarmAPI } from 'apis/bitfarm';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { CHICKEN_FARM_TRANSACTION_STATUS, COIN_TYPE, DEFAULT_PAGE_SIZE, STATUS_CASHBACK } from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE } from 'constants/role';
import {
  downloadCSV,
  endOfDay,
  formatDateNowMoment,
  formatMoment,
  formatter,
  FORMAT_MOMENT,
  isEditable,
  Moment,
  parseGetUnixTimeValue,
  parseMoment,
  parseObjectToParam,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseUnixTimeValueToEndOfDay,
  parseUnixTimeValueToStartOfDay,
  startOfDay,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getListWithdrawalVndc, getStatWithdrawalVndc } from './duck/thunks';

const { DATE_TIME_SLASH_LONG, DATE_SLASH_LONG, TIME_SHORT } = FORMAT_MOMENT;
const { SUCCESS, FAILED, PROCESSING } = CHICKEN_FARM_TRANSACTION_STATUS;

interface IModalState {
  type: 'Success' | 'Failure';
  data?: IWithdrawalVndcItem;
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const params: IWithdrawalVndcRequest = parseParamToObject(location.search);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState<IWithdrawalVndcRequest>({
    ...params,
    from: startOfDay(),
    to: endOfDay(),
    size: DEFAULT_PAGE_SIZE,
    walletType: 1,
    coinType: 1,
  });
  const {
    withdrawalVndc: { data, totalRecords, loading, stat },
    auth: { user },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [formSuccess] = Form.useForm();
  const [formFailure] = Form.useForm();

  useEffect(() => {
    const param = {
      ...paramSearch,
      status: paramSearch.status !== STATUS_CASHBACK.ALL ? paramSearch.status : undefined,
      from: paramSearch.from ? parseUnixTimeValueToStartOfDay(paramSearch.from) : undefined,
      to: paramSearch.to ? parseUnixTimeValueToEndOfDay(paramSearch.to) : undefined,
      walletType: typeof paramSearch.walletType === 'number' ? undefined : paramSearch.walletType,
      coinType: typeof paramSearch.coinType === 'number' ? undefined : paramSearch.coinType,
    };
    dispatch(getListWithdrawalVndc(param));
    dispatch(getStatWithdrawalVndc(param));
    history.push({ pathname: PATH.WITHDRAWALVNDC, search: parseObjectToParam(param) });
  }, [dispatch, history, paramSearch]);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Success') {
      formSuccess.submit();
    }
    if (modalState.type === 'Failure') {
      formFailure.submit();
    }
  }, [modalState, formSuccess, formFailure]);

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

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : null,
      to: value ? parseGetUnixTimeValue(value[1]) : null,
    }));
  }, []);

  const onSearchInput = useCallback((value: string) => {
    const keyword = value.trim();
    setParamSearch((prev) => ({
      ...prev,
      keyword: keyword ? keyword : undefined,
      page: 1,
    }));
  }, []);

  const onChangeStatus = useCallback(
    (value: number) => setParamSearch((prev) => ({ ...prev, page: 1, status: value })),
    [],
  );

  const columns = [
    {
      title: 'TransactionID',
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
      title: t('WITHDRAWER_TEXT'),
      dataIndex: 'senderName',
      key: 'senderName',
      width: 120,
      render: (senderName, record: IWithdrawalVndcItem) => (
        <>
          <Link target='_blank' to={`${PATH.MOBILEUSERDETAIL}/${record.senderId}`}>
            {senderName}
          </Link>
          <br />
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.phone}
          </Typography.Text>
          <br />
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.email}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('FULLNAME_ONUS'),
      dataIndex: 'fullNameONUS',
      key: 'fullNameONUS',
      width: 150,
    },
    {
      title: t('ACCOUNT_ONUS'),
      dataIndex: 'accountONUS',
      key: 'accountONUS',
      width: 150,
    },
    {
      title: t('TRANSACTION_ONUS'),
      dataIndex: 'transactionONUS',
      key: 'transactionONUS',
      width: 150,
    },
    {
      title: t('TITLE_AND_DESCRIPTION'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      className: 'text-normal',
      render: (value: string, record: IWithdrawalVndcItem) => (
        <>
          <Typography.Title level={5} style={{ fontSize: '15px' }}>
            {value}
          </Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.description}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('AMOUNT_OF_MONEY'),
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      width: 150,
      render: (value: number, record: IWithdrawalVndcItem) => `${formatter.format(value)} ${record.coinType}`,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record: IWithdrawalVndcItem) => (
        <>
          {Number(status) === SUCCESS && <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>}
          {Number(status) === FAILED && <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>}
          {Number(status) === PROCESSING &&
            (isEditable([ROLE_TYPE.MANAGER], user?.role) ? (
              <Popconfirm
                onConfirm={() => onChangeModal({ type: 'Success', isOpen: true, data: record })}
                onCancel={() => onChangeModal({ type: 'Failure', isOpen: true, data: record })}
                title={t('COMMON_PROMPT_APPROVE_TRANSACTION')}
                cancelButtonProps={{ danger: true }}
                okText={t('SUCCESS_TEXT')}
                cancelText={t('FAILURE_TEXT')}>
                <Button type='primary'>{t('PROCESSING_TEXT')}</Button>
              </Popconfirm>
            ) : (
              <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
            ))}
        </>
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
      sorter: (a, b) => parseGetUnixTimeValue(a.createdAt) - parseGetUnixTimeValue(b.createdAt),
    },
    {
      title: t('UPDATED_AT_TEXT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
  ];

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onDownloadCSV = useCallback(async () => {
    try {
      const param = {
        ...paramSearch,
        status: paramSearch.status !== STATUS_CASHBACK.ALL ? paramSearch.status : undefined,
        from: paramSearch.from ? parseUnixTimeValueToStartOfDay(paramSearch.from) : undefined,
        to: paramSearch.to ? parseUnixTimeValueToEndOfDay(paramSearch.to) : undefined,
        walletType: typeof paramSearch.walletType === 'number' ? undefined : paramSearch.walletType,
        coinType: typeof paramSearch.coinType === 'number' ? undefined : paramSearch.coinType,
      };
      const res = await BitfarmAPI.DOWNLOAD_CSV(param);
      downloadCSV(res, `withdrawal-vndc_${formatDateNowMoment(DATE_SLASH_LONG)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Success') {
        try {
          const res = await BitfarmAPI.UPDATE_TRANSACTION_STATUS({
            ...values,
            id: modalState.data?.id as string,
            status: SUCCESS,
          });
          if (res.status) {
            message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
      if (modalState.type === 'Failure') {
        try {
          const res = await BitfarmAPI.UPDATE_TRANSACTION_STATUS({
            ...values,
            id: modalState.data?.id as string,
            status: FAILED,
          });
          if (res.status) {
            message.success(t('UPDATE_HOMEPAGE_CONFIG_SUCCESS'));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [, modalState, t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Success') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={500}
          onOk={onSubmitModal}
          onCancel={() => onChangeModal(undefined)}
          title={t('CONFIRM_SUCCESS_TRANSACTION')}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_SEND')}>
          <Form
            form={formSuccess}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout='vertical'
            onFinish={onFinishForm}>
            <Form.Item
              name='transactionNumber'
              label={t('TRANSACTION_CODE')}
              rules={[{ required: true, message: t('COMMON_TRANSACTION_CODE_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'Failure') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={500}
          onOk={onSubmitModal}
          onCancel={() => onChangeModal(undefined)}
          title={t('CONFIRM_FAILURE_TRANSACTION')}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_BUTTON_SEND')}>
          <Form
            form={formFailure}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout='vertical'
            onFinish={onFinishForm}>
            <Form.Item
              name='reason'
              label={t('REASON_TEXT')}
              rules={[{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [modalState, onSubmitModal, t, formSuccess, onFinishForm, onChangeModal, formFailure]);

  return (
    <Card>
      <Row gutter={[5, 20]}>
        <Col xs={24} md={8}>
          <Input.Search
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_TEXT')}
            allowClear
          />
        </Col>
        <Col>
          <DatePicker.RangePicker
            showTime={{ format: TIME_SHORT }}
            format={DATE_SLASH_LONG}
            locale={i18n.language === 'vn' ? vn : undefined}
            allowClear={true}
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
            onChange={onChangeDatePicker}
          />
        </Col>
        <Col>
          <Select style={{ width: 120 }} onChange={onChangeStatus} defaultValue={STATUS_CASHBACK.ALL}>
            <Select.Option value={STATUS_CASHBACK.ALL}>{t('ALL_TEXT')}</Select.Option>
            <Select.Option value={STATUS_CASHBACK.SUCCESS}>{t('SUCCESS_TEXT')}</Select.Option>
            <Select.Option value={STATUS_CASHBACK.PROCESSING}>{t('PROCESSING_TEXT')}</Select.Option>
            <Select.Option value={STATUS_CASHBACK.FAILURE}>{t('FAILURE_TEXT')}</Select.Option>
          </Select>
        </Col>
        {/* TODO: Uncomment later */}
        {/* <Col>
          <Select
            style={{ width: 120 }}
            onChange={(value) => setParamSearch((prev) => ({ ...prev, walletType: value }))}
            defaultValue={WALLET_TYPE.ALL}>
            <Select.Option value={WALLET_TYPE.ALL}>{t('ALL_TEXT')}</Select.Option>
            <Select.Option value={WALLET_TYPE.VNDC}>{t('WALLET_TEXT')} VNDC</Select.Option>
            <Select.Option value={WALLET_TYPE.KAI}>{t('WALLET_TEXT')} KAI</Select.Option>
          </Select>
        </Col> */}
        <Col>
          <Select
            style={{ width: 130 }}
            onChange={(value) => setParamSearch((prev) => ({ ...prev, coinType: value }))}
            defaultValue={COIN_TYPE.ALL}>
            <Select.Option value={COIN_TYPE.ALL}>{t('ALL_TEXT')}</Select.Option>
            <Select.Option value={COIN_TYPE.VNDC}>{t('UNIT_TEXT')} VNDC</Select.Option>
            <Select.Option value={COIN_TYPE.SAT}>{t('UNIT_TEXT')} SAT</Select.Option>
          </Select>
        </Col>
        <Col>
          <Button type='primary' onClick={onDownloadCSV}>
            {t('EXPORT_CSV_TEXT')}
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card>
            <Statistic
              title={t('TOTAL_SATOSHI')}
              value={stat?.totalWithdrawalAmount ? stat?.totalWithdrawalAmount : 0}
            />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_NUMBER_OF_WITHDRAWAL')} value={stat?.totalRecords} />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_NUMBER_OF_WITHDRAWAL_SUCCESS')} value={stat?.totalSuccess} />
          </Card>
        </Col>
        <Col xxl={5} xl={6} md={12} xs={24}>
          <Card>
            <Statistic
              title={
                paramSearch.status === STATUS_CASHBACK.PROCESSING
                  ? t('TOTAL_NUMBER_OF_WITHDRAWAL_PENDING')
                  : t('TOTAL_NUMBER_OF_WITHDRAWAL_FAIL')
              }
              value={stat?.totalFailed}
            />
          </Card>
        </Col>
        <Col xxl={4} xl={6} md={12} xs={24}>
          <Card>
            <Statistic title={t('TOTAL_NUMBER_OF_USES_WITHDRAWING')} value={stat?.totalUsers} />
          </Card>
        </Col>
      </Row>
      <Table
        className='custom-table'
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
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
