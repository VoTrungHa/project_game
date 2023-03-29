/* eslint-disable react/display-name */
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Statistic,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { MobileUserDetailAPI } from 'apis/mobileuserdetail';
import { PartnerAPI } from 'apis/partner';
import { Col, Row } from 'components/Container';
import { Currency } from 'components/Currency';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Textlink } from 'components/Textlink';
import { APPROVE_SPIN, DEFAULT_PAGE_SIZE, REWARD_STATUS, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE } from 'constants/role';
import { PageHeaderCustom } from 'containers/PageHeader';
import {
  convertArrayToObject,
  convertToVNDC,
  formatDateNowMoment,
  formatMoment,
  formatter,
  FORMAT_MOMENT,
  isEditable,
  Moment,
  momentNow,
  parseGetUnixTimeValue,
  parseMoment,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseUnixTimeValueToEndOfDay,
  parseUnixTimeValueToStartOfDay,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import JSEncrypt from 'jsencrypt';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  getAccountReferred,
  getCashbackTransaction,
  getCashbackWallet,
  getCommissionPartner,
  getDailySpin,
  getNotification,
  getPartnerDetail,
  getWalletInfo,
} from './duck/thunks';

const { YES, NO } = APPROVE_SPIN;
const { DATE_TIME_SLASH_LONG, DATE_LONG, DATE_SLASH_LONG } = FORMAT_MOMENT;
const { EMPTY, PENDING, APPROVED, REJECTED } = STATUS_KYC;

export interface IParamSearch {
  tab?: string;
  page?: number;
  size?: string | number;
  date?: string;
  received?: boolean;
  needApproval?: number;
  from?: number;
  to?: number;
  kycStatus?: number;
}
interface IModalState {
  type: 'Info' | 'ResetPasscode';
  data?: IAccountReferredInfo;
  isOpen: boolean;
}

const initialParam = {
  tab: 'COMMISSION',
  page: 1,
  size: DEFAULT_PAGE_SIZE,
  date: formatDateNowMoment(DATE_LONG),
};

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formResetPasscode] = Form.useForm();

  const { userId: id } = useParams<{ userId: string }>();
  const history = useHistory();
  const { state } = history.location;
  const isXs = useBreakpoint().xs;

  const dispatch = useAppDispatch();
  const {
    partnerdetail: {
      partnerInformation,
      commission,
      loading,
      cashbackWallet,
      cashbackTransaction,
      notifications,
      accountReferred,
      dailySpin,
      walletInfo,
    },
    auth: { user },
    broker: { currencyList },
    systemconfig: { rate },
  } = useAppSelector((state) => state);

  const [paramSearch, setParamSearch] = useState<IParamSearch>(initialParam);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [token, setToken] = useState(currencyList[0]?.code);
  const currencyArrayToObj = convertArrayToObject(currencyList, 'code');
  const codeCurrency = token ? token : currencyList[0]?.code;

  useEffect(() => {
    if (!modalState) {
      formResetPasscode.resetFields();
    }
  }, [formResetPasscode, modalState]);

  useDidMount(() => {
    dispatch(getPartnerDetail(id));
  });

  useEffect(() => {
    if (paramSearch.tab === 'COMMISSION') {
      const { tab, ...rest } = paramSearch;
      dispatch(getCommissionPartner({ ...rest, id }));
    }
    if (paramSearch.tab === 'WALLET') {
      dispatch(getCashbackWallet({ id, page: paramSearch.page, size: DEFAULT_PAGE_SIZE, currency: codeCurrency }));
      dispatch(getWalletInfo({ id }));
    }
    if (paramSearch.tab === 'CASHBACK_TRANSACTION') {
      dispatch(
        getCashbackTransaction({
          id,
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          received: paramSearch.received || undefined,
        }),
      );
    }
    if (paramSearch.tab === 'NOTIFICATION') {
      dispatch(
        getNotification({
          id,
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          received: paramSearch.received || undefined,
        }),
      );
    }
    if (paramSearch.tab === 'ACCOUNTS_REFERRED') {
      dispatch(
        getAccountReferred({
          id,
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          from: paramSearch.from ? parseUnixTimeValueToStartOfDay(paramSearch.from) : undefined,
          to: paramSearch.to ? parseUnixTimeValueToEndOfDay(paramSearch.to) : undefined,
          kycStatus:
            typeof paramSearch.kycStatus === 'number'
              ? paramSearch.kycStatus === STATUS_KYC.ALL
                ? undefined
                : paramSearch.kycStatus
              : undefined,
        }),
      );
    }
    if (paramSearch.tab === 'DAILY_SPIN') {
      dispatch(
        getDailySpin({
          page: paramSearch.page,
          size: DEFAULT_PAGE_SIZE,
          needApproval: paramSearch.needApproval ? paramSearch.needApproval === YES : undefined,
          accountId: id,
        }),
      );
    }
  }, [codeCurrency, dispatch, id, paramSearch]);

  const onChangeTab = useCallback(
    (tab: string) => {
      if (tab === paramSearch.tab) return;
      if (tab === 'COMMISSION') {
        setParamSearch(initialParam);
      } else {
        setParamSearch((prev) => ({ ...prev, tab, page: 1, received: false }));
      }
    },
    [paramSearch.tab],
  );

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'ResetPasscode') {
      formResetPasscode.submit();
    }
  }, [formResetPasscode, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'ResetPasscode') {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(`${process.env.PUBLIC_KEY}`);
        try {
          const res = await MobileUserDetailAPI.RESET_PASSCODE({
            id,
            passcode: encrypt.encrypt(values.passcode).toString(),
          });
          if (res.status) {
            message.success(t('SUCCESS_PASSCODE_MESSAGE'));
            setModalState(undefined);
          }
        } catch (error) {
          message.error(t('ERROR_PASSCODE_MESSAGE'));
        }
      }
    },
    [id, modalState, t],
  );

  const onChangeKycStatus = useCallback((kycStatus: number) => setParamSearch((prev) => ({ ...prev, kycStatus })), []);

  const onChangeCreatedatPicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : undefined,
      to: value ? parseGetUnixTimeValue(value[1]) : undefined,
    }));
  }, []);

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'ResetPasscode') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          width={500}
          onOk={onSubmitModal}
          onCancel={() => onChangeModal(undefined)}
          title={t('RESET_PASSCODE_TEXT')}
          cancelText={t('COMMON_BUTTON_CLOSE')}>
          <Form form={formResetPasscode} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinishForm}>
            <Form.Item
              name='passcode'
              label={t('PASSCODE_TEXT')}
              rules={[
                { required: true, message: t('COMMON_PASSCODE_REQUIRED_ERROR') },
                {
                  len: 6,
                  message: t('COMMON_6_LENGTH_ERROR'),
                },
              ]}>
              <InputNumber allowLeadingZeros maxLength={6} isPassword />
            </Form.Item>
            <Form.Item
              name='confirm'
              label={t('CONFIRM_PASSCODE_TEXT')}
              dependencies={['passcode']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('COMMON_PASSCODE_REQUIRED_ERROR'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('passcode') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('COMMON_RENEWPASSCODE_ERRORMATCH')));
                  },
                }),
              ]}>
              <InputNumber allowLeadingZeros maxLength={6} isPassword />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'Info') {
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okButtonProps={{ style: { display: 'none' } }}
          centered
          title={t('INFO_TEXT')}
          width={1000}
          visible={modalState.isOpen}
          onCancel={() => onChangeModal(undefined)}>
          <Row>
            <Col span={14}>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                <Form.Item name='fullName' label={t('FULL_NAME_TEXT')} initialValue={modalState.data?.fullName}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='email' label='Email' initialValue={modalState.data?.email}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='phone' label={t('PHONE_TEXT')} initialValue={modalState.data?.phone}>
                  <InputNumber readOnly />
                </Form.Item>
                <Form.Item
                  name='role'
                  label={t('ROLE_TEXT')}
                  initialValue={modalState.data?.isPartner ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')}>
                  <Input readOnly />
                </Form.Item>
              </Form>
              <Link
                target='_blank'
                style={{ marginRight: 5 }}
                to={`${modalState.data?.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${modalState.data?.id}`}
                state={paramSearch}>
                {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
              </Link>
            </Col>
            <Col span={10} textAlign='center'>
              <Avatar size={250} src={modalState.data?.avatar} />
            </Col>
          </Row>
        </Modal>
      );
    }
  }, [formResetPasscode, modalState, onChangeModal, onFinishForm, onSubmitModal, paramSearch, t]);

  const onApproveComission = useCallback(
    async (idCommission: string) => {
      try {
        const res = await PartnerAPI.APPROVE_COMMISSION({ accountId: id, idCommission: [idCommission] });
        if (res.status) {
          message.success(t('APPROVE_SUCCESS_TEXT'));
        }
      } catch (error) {
        message.error(t('APPROVE_ERROR_TEXT'));
      }
    },
    [id, t],
  );

  const onOpenModalPartner = useCallback(
    (id: string) => {
      Modal.confirm({
        title: t('APPROVE_COMMISSION_TEXT'),
        icon: <ExclamationCircleOutlined />,
        content: t('CONTENT_APPROVE_COMMISSION_PARTNER'),
        okText: t('COMMON_BUTTON_APPROVE'),
        cancelText: t('COMMON_BUTTON_CLOSE'),
        onOk: () => onApproveComission(id),
      });
    },
    [t, onApproveComission],
  );

  const onVerifyKyc = useCallback(async () => {
    try {
      const res = await MobileUserDetailAPI.APPROVE_KYC(id);
      if (res.status) {
        message.success(t('APPROVE_KYC_SUCCESS'));
        dispatch(getPartnerDetail(id));
      }
    } catch (error) {
      message.error(t('APPROVE_KYC_ERROR'));
    }
  }, [dispatch, id, t]);

  const onApproveKyc = useCallback(() => {
    Modal.confirm({
      title: t('VERIFY_KYC_TEXT'),
      icon: <ExclamationCircleOutlined />,
      content: t('CONTENT_APPROVE_KYC'),
      okText: t('COMMON_BUTTON_APPROVE'),
      cancelText: t('COMMON_BUTTON_CLOSE'),
      onOk: onVerifyKyc,
    });
  }, [t, onVerifyKyc]);

  const onChangeDatePicker = useCallback((value: Moment | null) => {
    setParamSearch((prev) => ({
      ...prev,
      date: value ? value.format(DATE_LONG) : undefined,
    }));
  }, []);

  const onApproveSelectedRow = useCallback(async () => {
    try {
      const res = await PartnerAPI.APPROVE_COMMISSION({ accountId: id, idCommission: selectedRowKeys });
      if (res.status) {
        message.success(t('APPROVE_SUCCESS_TEXT'));
      }
    } catch (error) {
      message.error(t('APPROVE_ERROR_TEXT'));
    }
    setSelectedRowKeys([]);
  }, [id, selectedRowKeys, t]);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (row) => setSelectedRowKeys(row),
      getCheckboxProps: (record: ICommissionItem) => ({ disabled: record.isApproved }),
    }),
    [selectedRowKeys],
  );

  const commissionColumn = [
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
      title: t('TOTAL_VALUE_TEXT'),
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      render: (value: number) => formatter.format(value),
    },
    {
      title: t('COMMISSION_TEXT'),
      dataIndex: 'commission',
      key: 'commission',
      width: 120,
      render: (value: number) => formatter.format(value),
    },
    {
      title: 'Access Trade Id',
      dataIndex: 'accessTradeId',
      key: 'accessTradeId',
      width: 120,
      render: (_, record: ICommissionItem) => record.transaction.accessTradeId,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: ICommissionItem) => formatMoment(record.transaction.createdAt, DATE_TIME_SLASH_LONG),
    },
    {
      key: 'view',
      render: (_, record: ICommissionItem) =>
        record.isApproved || selectedRowKeys.length > 0 ? null : (
          <Textlink text={t('COMMON_BUTTON_APPROVE')} onClick={() => onOpenModalPartner(record.id)} />
        ),
    },
  ];

  const columnsCashbackWallet = [
    {
      title: t('DESCRIPTON_TEXT'),
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: t('TITLE_TEXT'),
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 300,
      render: (amount: number, record: ICashbackWalletITem) => (
        <Currency icon={currencyArrayToObj[record.currency.code]?.icon} amount={formatter.format(amount)} />
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (createdAt: string) => `${formatMoment(createdAt, DATE_TIME_SLASH_LONG)}`,
    },
  ];

  const columnsCashbackTransaction = [
    {
      title: t('DESCRIPTON_TEXT'),
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
    {
      title: t('CURRENCY_TEXT'),
      dataIndex: 'currency',
      key: 'currency',
      width: 120,
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number) => formatter.format(amount),
    },
    {
      title: t('FEE_TEXT'),
      dataIndex: 'fee',
      key: 'fee',
      width: 150,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  const columnsNotification = [
    {
      title: t('TITLE_TEXT'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: t('DESCRIPTON_TEXT'),
      dataIndex: 'description',
      key: 'description',
      width: 400,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatMoment(createdAt, DATE_TIME_SLASH_LONG),
    },
  ];

  const columnsAccountReferred = [
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
      width: 150,
      render: (value: string, record: IAccountReferredInfo) => (
        <Textlink text={value} onClick={() => onChangeModal({ isOpen: true, type: 'Info', data: record })} />
      ),
    },
    {
      title: t('AMOUNT_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (value: string) => <>{value || '--'}</>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (value: string) => <>{value || '--'}</>,
    },
    {
      title: t('VERIFY_KYC_TEXT'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 120,
      render: (value: number) =>
        value === STATUS_KYC.APPROVED ? (
          <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>
        ) : (
          <Typography.Text type='warning'>{t('NON_APPROVED_TEXT')}</Typography.Text>
        ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatMoment(createdAt, DATE_TIME_SLASH_LONG),
    },
  ];

  const dailySpinColumns = [
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
      title: t('TITLE_TEXT'),
      dataIndex: 'rewardTitle',
      key: 'rewardTitle',
      width: 150,
    },
    {
      title: t('REWARD_TEXT'),
      dataIndex: 'reward',
      key: 'reward',
      width: 120,
      render: (value: number) => `${value} Sat`,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record: IDailySpinInformationItem) => (
        <>
          {Number(record.rewardStatus) === REWARD_STATUS.NOT_USED && (
            <Typography.Text type='success'>{t('NOT_USED_TEXT')}</Typography.Text>
          )}
          {Number(record.rewardStatus) === REWARD_STATUS.USED && (
            <Typography.Text type='danger'>{t('USED_TEXT')}</Typography.Text>
          )}
          {Number(record.rewardStatus) === REWARD_STATUS.EXPIRED && (
            <Typography.Text type='warning'>{t('EXPIRED_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('NOTE_TEXT'),
      dataIndex: 'note',
      key: 'note',
      width: 200,
    },
    {
      title: t('APPROVAL_TEXT'),
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (value: boolean) => (
        <>
          {value ? (
            <CheckCircleOutlined style={{ fontSize: 20, color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ fontSize: 20, color: 'red' }} />
          )}
        </>
      ),
    },
    {
      title: t('UPDATED_AT_TEXT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => formatMoment(updatedAt, DATE_TIME_SLASH_LONG),
    },
  ];

  const cashbackTransactionData = useMemo(() => {
    if (paramSearch.tab !== 'CASHBACK_TRANSACTION' || !cashbackTransaction) return [];
    return cashbackTransaction.data.map((item) => ({
      description: item.description,
      createdAt: formatMoment(item.createdAt, DATE_TIME_SLASH_LONG),
      currency: item.currency && item.currency.name,
      amount: item.amount && item.amount.value,
      fee: item.fee && item.fee.value,
    }));
  }, [paramSearch.tab, cashbackTransaction]);

  if (!partnerInformation) return loading ? <Spin /> : <Empty />;

  const redirectToBack = () => {
    if (
      !(state as IRankRouter)?.hasRank &&
      !(state as IStatisticStackingRouter)?.hasStatisticStacking &&
      !(state as IStatisticGameRouter)?.hasStatisticGame
    ) {
      return history.push(PATH.ACCOUNT);
    }
    if ((state as IRankRouter)?.hasRank) {
      return history.push(`${PATH.RANKDETAIL}/${(state as IRankRouter)?.id}`);
    }
    if ((state as IStatisticStackingRouter)?.hasStatisticStacking) {
      return history.push(`${PATH.STATISTIC_STACKING_DETAIL}/${(state as IStatisticStackingRouter)?.id}`);
    }
    if ((state as IStatisticGameRouter)?.hasStatisticGame) {
      return history.push(PATH.SATOSHIGAME);
    }
  };

  return (
    <Card>
      <ArrowLeftOutlined onClick={redirectToBack} style={{ fontSize: 20 }} />
      <PageHeaderCustom
        avatar={partnerInformation.avatar}
        name={partnerInformation.fullName}
        tags={
          <>
            <Tag color={partnerInformation.status ? 'green' : 'red'}>{STATUS[`${partnerInformation.status}`]}</Tag>
            <Tag
              style={{ textTransform: 'uppercase' }}
              color={partnerInformation.kycStatus === STATUS_KYC.APPROVED ? 'green' : 'yellow'}>
              {partnerInformation.kycStatus === STATUS_KYC.APPROVED ? t('APPROVED_TEXT') : t('NON_APPROVED_TEXT')} kyc
            </Tag>
          </>
        }
        extra={
          <>
            {isEditable([ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR], user?.role) && (
              <Button
                style={{ marginRight: '5px', marginBottom: '1px' }}
                key='1'
                type='primary'
                onClick={() => onChangeModal({ isOpen: true, type: 'ResetPasscode' })}>
                {t('RESET_PASSCODE_TEXT')}
              </Button>
            )}
            {partnerInformation.kycStatus !== STATUS_KYC.APPROVED && isEditable([ROLE_TYPE.MANAGER], user?.role) && (
              <Button key='3' onClick={onApproveKyc}>
                {t('APPROVE_KYC_TEXT')}
              </Button>
            )}
          </>
        }>
        <Descriptions column={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} layout={isXs ? 'vertical' : 'horizontal'}>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('PHONE_TEXT')}>
            {partnerInformation.phone}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label='Email'>
            {partnerInformation.email}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('REFERRAL_CODE_TEXT')}>
            {partnerInformation.referralCode}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('REFERRED_BY')}>
            {partnerInformation.parent ? (
              <Link
                target='_blank'
                to={`${partnerInformation.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${
                  partnerInformation.parent.id
                }`}>
                {partnerInformation.parent.fullName} <ArrowRightOutlined />
              </Link>
            ) : null}
          </Descriptions.Item>
        </Descriptions>
      </PageHeaderCustom>
      <Tabs tabBarGutter={5} defaultActiveKey={paramSearch.tab} type='card' onChange={onChangeTab}>
        <Tabs.TabPane tab={t('COMMISSION_TEXT')} key='COMMISSION'>
          {commission ? (
            <>
              <Row justify='space-between'>
                <Col>
                  <DatePicker
                    style={{ marginBottom: 5 }}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    format={DATE_SLASH_LONG}
                    defaultValue={momentNow()}
                    onChange={onChangeDatePicker}
                  />
                  <br />
                  {selectedRowKeys.length > 0 && (
                    <Button type='primary' onClick={onApproveSelectedRow}>
                      {t('ARPPROVE_SELECTED_TEXT')}
                    </Button>
                  )}
                </Col>
                <Col>
                  <Row gutter={[30, 20]}>
                    <Col>
                      <Statistic
                        suffix='đ'
                        title={t('TOTAL_COMMISSION_TEXT')}
                        value={formatter.format(commission.data.totalCommission)}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        title={t('TOTAL_REWARD_TEXT')}
                        suffix='đ'
                        value={formatter.format(commission.data.totalReward)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Table
                pagination={false}
                showSorterTooltip={false}
                sortDirections={['descend']}
                dataSource={commission.data.commissionHistories}
                columns={commissionColumn}
                rowSelection={rowSelection}
                scroll={{ x: 700 }}
                rowKey='id'
                loading={loading}
              />
            </>
          ) : (
            <Empty />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('CASHBACK_WALLET')} key='WALLET'>
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <Form.Item label={t('TOKEN_TYPE')}>
                <Select
                  style={{ width: 160 }}
                  onChange={(token) => setToken(token as string)}
                  defaultValue={codeCurrency}>
                  {currencyList.map((token) => (
                    <Select.Option key={token?.code} value={token?.code}>
                      {token?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Statistic
                suffix={codeCurrency}
                title={t('AMOUNT_AVAILABLE_TEXT')}
                value={
                  walletInfo && walletInfo[codeCurrency]
                    ? Number(walletInfo[codeCurrency].amountAvailable).toFixed()
                    : 0
                }
              />
              {codeCurrency !== 'VNDC' && !!codeCurrency && (
                <Statistic
                  prefix='('
                  valueStyle={{ color: 'gray', fontSize: 20 }}
                  suffix='VNDC )'
                  value={convertToVNDC(
                    walletInfo && walletInfo[codeCurrency] ? walletInfo[codeCurrency].amountAvailable : 0,
                    rate?.[`${codeCurrency}VNDC`]?.bid,
                  )}
                />
              )}
            </Col>
            <Col>
              <Statistic
                title={t('AMOUNT_PENDING_TEXT')}
                suffix={codeCurrency}
                value={
                  walletInfo && walletInfo[codeCurrency] ? Number(walletInfo[codeCurrency].amountPending).toFixed() : 0
                }
              />
              {codeCurrency !== 'VNDC' && !!codeCurrency && (
                <Statistic
                  prefix='('
                  valueStyle={{ color: 'gray', fontSize: 20 }}
                  suffix='VNDC )'
                  value={convertToVNDC(
                    walletInfo && walletInfo[codeCurrency] ? walletInfo[codeCurrency].amountPending : 0,
                    rate?.[`${codeCurrency}VNDC`]?.bid,
                  )}
                />
              )}
            </Col>
          </Row>
          <Table
            pagination={{
              total: cashbackWallet?.totalRecords,
              pageSize: DEFAULT_PAGE_SIZE,
              current: cashbackWallet?.page,
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={cashbackWallet ? cashbackWallet.data : []}
            columns={columnsCashbackWallet}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('CASHBACK_TRANSACTION_TEXT')} key='CASHBACK_TRANSACTION'>
          <Switch
            checkedChildren={t('RECEIVED_TEXT')}
            unCheckedChildren={t('SENT_TEXT')}
            checked={paramSearch.received}
            onChange={(received) => {
              setParamSearch((prev) => ({ ...prev, received }));
            }}
            style={{ marginLeft: 5, marginBottom: 5 }}
          />
          <Table
            pagination={{
              total: cashbackTransaction ? cashbackTransaction.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page),
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={cashbackTransactionData}
            columns={columnsCashbackTransaction}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('NOTIFICATION_TEXT')} key='NOTIFICATION'>
          <Table
            pagination={{
              total: notifications ? notifications.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page),
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={notifications ? notifications.data : []}
            columns={columnsNotification}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('ACCOUNT_REFERRED_BY_YOU_TEXT')} key='ACCOUNTS_REFERRED'>
          <Row>
            <Col xxl={7} xl={10} lg={14} md={24} xs={24}>
              <Form.Item label={t('CREATED_AT_TEXT')}>
                <DatePicker.RangePicker
                  format={DATE_SLASH_LONG}
                  locale={i18n.language === 'vn' ? vn : undefined}
                  allowClear={true}
                  onChange={onChangeCreatedatPicker}
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
              </Form.Item>
            </Col>
            <Col xxl={7} xl={10} lg={10} md={24} xs={24}>
              <Form.Item label={t('KYC_STATUS_TEXT')}>
                <Select onChange={onChangeKycStatus} style={{ width: 160 }} defaultValue={STATUS_KYC.ALL}>
                  <Select.Option value={STATUS_KYC.ALL}>{t('ALL_TEXT')}</Select.Option>
                  <Select.Option value={EMPTY}>{t('NON_KYC_TEXT')}</Select.Option>
                  <Select.Option value={PENDING}>{t('PENDING_TEXT')}</Select.Option>
                  <Select.Option value={APPROVED}>{t('APPROVED_TEXT')}</Select.Option>
                  <Select.Option value={REJECTED}>{t('REJECTED_TEXT')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col>
              <Statistic
                title={t('TOTAL_ACCOUNT_REFFERD')}
                value={accountReferred ? accountReferred.totalRecords : 0}
              />
            </Col>
            <Col>
              <Statistic
                title={t('TOTAL_ACCOUNT_REFFERD_KYC')}
                value={accountReferred ? accountReferred.totalKyc : 0}
              />
            </Col>
            <Col>
              <Statistic
                title={t('TOTAL_ACCOUNT_REFFERD_NON_KYC')}
                value={accountReferred ? accountReferred.totalRecords - accountReferred.totalKyc : 0}
              />
            </Col>
          </Row>
          <Divider />
          <Table
            pagination={{
              total: accountReferred ? accountReferred.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page),
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={accountReferred ? accountReferred.data : []}
            columns={columnsAccountReferred}
            scroll={{ x: 700 }}
            onChange={onChangeTable}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('DAILY_SPIN_TEXT')} key='DAILY_SPIN'>
          <Select
            style={{ width: 200, marginBottom: 10 }}
            allowClear
            value={paramSearch.needApproval}
            onChange={(value: number) => {
              setParamSearch((prev) => ({ ...prev, needApproval: value }));
            }}>
            <Select.Option value={YES}>{t('NEED_APPROVAL_TEXT')}</Select.Option>
            <Select.Option value={NO}>{t('NON_NEED_APPROVAL_TEXT')}</Select.Option>
          </Select>
          <Table
            pagination={{
              total: dailySpin ? dailySpin.totalRecords : 0,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page),
            }}
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={dailySpin ? dailySpin.data : []}
            columns={dailySpinColumns}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
            rowKey='id'
            loading={loading}
          />
        </Tabs.TabPane>
      </Tabs>
      {renderModal}
    </Card>
  );
};

export default Index;
