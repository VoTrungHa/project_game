/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Statistic,
  Table,
  TablePaginationConfig,
  Tabs,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { StatisticAPI } from 'apis/statistic';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import { Textlink } from 'components/Textlink';
import { DEFAULT_PAGE_SIZE, SELECT_REFERRAL_ACCOUNT, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  convertToVNDC,
  downloadCSV,
  formatDateNowMoment,
  formatMoment,
  formatSubtractCountDays,
  formatter,
  FORMAT_MOMENT,
  Moment,
  parseMoment,
  parseObjectToParam,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getListAmountCounter, getListReferralCounter } from './duck/thunks';

const { DD_MM_YYYY, DATE_LONG, DATE_TIME_SLASH_LONG, DATE_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'View';
  isOpen: boolean;
  data?: IReferralCounterItem;
}

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const params: IListReferralCounterRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState({
    ...params,
    tab: 'ACCOUNT',
  });
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    referralCounter: { data, totalRecords, loading, dataWithAmount, totalAmount },
    systemconfig: { rate },
  } = useAppSelector((state) => state);
  const [datePicker, setDatePicker] = useState<{ dateFrom?: string; dateTo?: string }>({
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useDidMount(() => {
    if (paramSearch.dateFrom || paramSearch.dateTo) return;
    setParamSearch((prev) => ({
      ...prev,
      dateFrom: formatSubtractCountDays(7, DATE_LONG),
      dateTo: formatDateNowMoment(DATE_LONG),
    }));
  });

  useEffect(() => {
    if (paramSearch.tab === 'ACCOUNT') {
      const isPartnerValue = Number(paramSearch.isPartner);
      const payload = {
        ...paramSearch,
        tab: undefined,
        isPartner:
          isPartnerValue === SELECT_REFERRAL_ACCOUNT.PARTNER
            ? true
            : isPartnerValue === SELECT_REFERRAL_ACCOUNT.MOBILE_USER
            ? false
            : undefined,
      };
      dispatch(getListReferralCounter(payload));
      const { tab, ...rest } = paramSearch;
      history.push({ pathname: PATH.STATISTIC, search: parseObjectToParam(rest) });
    }
    if (paramSearch.tab === 'WITHDRAWAL') {
      dispatch(getListAmountCounter({ page: paramSearch.page }));
    }
  }, [dispatch, history, paramSearch]);

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setDatePicker({
      dateFrom: value ? value[0]?.format(DATE_LONG) : undefined,
      dateTo: value ? value[1]?.format(DATE_LONG) : undefined,
    });
  }, []);

  const onSearch = useCallback(() => {
    setParamSearch((prev) => ({
      ...prev,
      dateFrom: datePicker.dateFrom,
      dateTo: datePicker.dateTo,
    }));
  }, [datePicker]);

  const onChangeStatusSelect = useCallback((value: number) => {
    setParamSearch((prev) => ({ ...prev, isPartner: value }));
  }, []);

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      if (Number(paramSearch.page) === pagination.current) return;
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current,
        }));
      }
    },
    [paramSearch.page],
  );

  const onChangeTab = useCallback(
    (activeTab: string) => {
      if (activeTab === paramSearch.tab) return;
      setParamSearch((prev) => ({
        ...prev,
        page: 1,
        tab: activeTab,
      }));
    },
    [paramSearch.tab],
  );

  const onDownloadReferralCSV = useCallback(async () => {
    try {
      const res = await StatisticAPI.DOWNLOAD_REFERRAL_CSV({
        isPartner: paramSearch.isPartner,
        dateFrom: paramSearch.dateFrom,
        dateTo: paramSearch.dateTo,
      });
      downloadCSV(
        res,
        `accounts_referral_${formatMoment(paramSearch.dateFrom as string, DD_MM_YYYY)}_${formatMoment(
          paramSearch.dateTo as string,
          DD_MM_YYYY,
        )}.csv`,
      );
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

  const onDownloadAmountCSV = useCallback(async () => {
    try {
      const res = await StatisticAPI.DOWNLOAD_AMOUNT_CSV({});
      downloadCSV(res, `accounts_amount_${formatDateNowMoment(DD_MM_YYYY)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [t]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const renderModal = useMemo(() => {
    if (!modalState || !modalState.data) return null;
    if (modalState.type === 'View') {
      return (
        <Modal
          cancelText={t('COMMON_BUTTON_CLOSE')}
          width={800}
          centered
          visible={modalState.isOpen}
          okButtonProps={{ style: { display: 'none' } }}
          title={t('INFO_TEXT')}
          onCancel={() => onChangeModal(undefined)}>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={24}>
                <Form.Item name='fullName' label={t('USER_NAME_TEXT')} initialValue={modalState.data.fullName}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='email' label='Email' initialValue={modalState.data.email}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='phone' label={t('PHONE_TEXT')} initialValue={modalState.data.phone}>
                  <InputNumber readOnly />
                </Form.Item>
                <Form.Item
                  name='role'
                  label={t('ROLE_TEXT')}
                  initialValue={modalState.data.isPartner ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')}>
                  <Input readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Link
            style={{ marginRight: 5 }}
            to={`${modalState.data.isPartner ? PATH.PARTNERDETAIL : PATH.MOBILEUSERDETAIL}/${modalState.data.id}`}>
            {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
          </Link>
        </Modal>
      );
    }
  }, [modalState, onChangeModal, t]);

  const columnsAccount = [
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
      render: (value: string, record: IReferralCounterItem) => (
        <Textlink
          text={value}
          onClick={() =>
            onChangeModal({
              isOpen: true,
              type: 'View',
              data: record,
            })
          }
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span>{email || '--'}</span>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string) => value || '--',
    },
    {
      title: t('ACCOUNT_REFERRED_BY_YOU_TEXT'),
      dataIndex: 'totalReferrals',
      key: 'totalReferrals',
      sorter: (a, b) => a.totalReferrals - b.totalReferrals,
      width: 180,
      render: (value: number) => (
        <Typography.Title style={{ textAlign: 'center' }} type='success' level={5}>
          {value}
        </Typography.Title>
      ),
    },
    {
      title: t('ROLE_TEXT'),
      dataIndex: 'isPartner',
      key: 'isPartner',
      render: (value: boolean) => (value ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')),
    },
    {
      title: t('VERIFY_KYC_TEXT'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (value: number) =>
        value === STATUS_KYC.APPROVED ? (
          <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>
        ) : (
          <Typography.Text type='warning'>{t('NON_APPROVED_TEXT')}</Typography.Text>
        ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={!!status} />,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
  ];

  const columnsWithdrawal = [
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
      render: (value: string, record: IReferralCounterItem) => (
        <Textlink
          text={value}
          onClick={() =>
            onChangeModal({
              isOpen: true,
              type: 'View',
              data: record,
            })
          }
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span>{email || '--'}</span>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string) => value || '--',
    },
    {
      title: t('MONEY_TEXT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      sorter: (a, b) => a.totalReferrals - b.totalReferrals,
      render: (value: number) => {
        const vndc = convertToVNDC(value, rate?.SATVNDC.bid);
        return (
          <Typography.Text style={{ textAlign: 'center' }} type='success'>
            {`${formatter.format(value)} Sat`}
            <br />
            {`( ${formatter.format(Number(vndc))} đ )`}
          </Typography.Text>
        );
      },
    },
    {
      title: t('ROLE_TEXT'),
      dataIndex: 'isPartner',
      key: 'isPartner',
      render: (value: boolean) => (value ? t('MENU_PARTNER') : t('MENU_MOBILE_USER')),
    },
    {
      title: t('VERIFY_KYC_TEXT'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (value: number) =>
        value === STATUS_KYC.APPROVED ? (
          <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>
        ) : (
          <Typography.Text type='warning'>{t('NON_APPROVED_TEXT')}</Typography.Text>
        ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => <Status active={!!status} />,
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
      <Tabs tabBarGutter={5} type='card' activeKey={paramSearch.tab} onChange={onChangeTab}>
        <Tabs.TabPane tab={t('STATISTIC_ACCOUNT_TEXT')} key='ACCOUNT'>
          <Row gutter={[5, 20]}>
            <Col xs={24} md={18}>
              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    defaultValue={SELECT_REFERRAL_ACCOUNT.ALL}
                    style={{ minWidth: 150 }}
                    onChange={onChangeStatusSelect}>
                    <Select.Option value={SELECT_REFERRAL_ACCOUNT.ALL}>{t('ALL_TEXT')}</Select.Option>
                    <Select.Option value={SELECT_REFERRAL_ACCOUNT.PARTNER}>{t('MENU_PARTNER')}</Select.Option>
                    <Select.Option value={SELECT_REFERRAL_ACCOUNT.MOBILE_USER}>{t('MENU_MOBILE_USER')}</Select.Option>
                  </Select>
                </Col>
                <Col>
                  <DatePicker.RangePicker
                    format={DATE_SLASH_LONG}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    allowClear={false}
                    ranges={
                      {
                        [t('TODAY_TEXT')]: parseRangesToday(),
                        [t('THIS_WEEK_TEXT')]: parseRanges(7),
                        [t('THIS_MONTH_TEXT')]: parseRangesThisMonth(),
                      } as any
                    }
                    onChange={onChangeDatePicker}
                    value={[
                      datePicker.dateFrom
                        ? parseMoment(datePicker.dateFrom)
                        : paramSearch.dateFrom
                        ? parseMoment(paramSearch.dateFrom)
                        : null,
                      datePicker.dateTo
                        ? parseMoment(datePicker.dateTo)
                        : paramSearch.dateTo
                        ? parseMoment(paramSearch.dateTo)
                        : null,
                    ]}
                  />
                </Col>
                <Col>
                  <Button onClick={onSearch}>{t('COMMON_BUTTON_SEARCH')}</Button>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6} textAlign='right'>
              <Button onClick={onDownloadReferralCSV} type='primary'>
                {t('EXPORT_CSV_TEXT')}
              </Button>
            </Col>
          </Row>

          <Table
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
            columns={columnsAccount}
            scroll={{ x: 700 }}
            rowKey='id'
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('WITHDRAWAL_STATISTIC_TEXT')} key='WITHDRAWAL'>
          <Row gutter={[5, 20]}>
            <Col xs={24} md={20}>
              <Row gutter={[5, 0]}>
                <Col xs={24} md={8}>
                  <Card hoverable>
                    <Statistic title={t('TOTAL_ACCOUNT')} value={totalRecords} />
                  </Card>
                </Col>
                <Col xs={24} md={16}>
                  <Card hoverable>
                    <Statistic
                      suffix={`Sat / ${formatter.format(Number(convertToVNDC(totalAmount, rate?.SATVNDC.bid)))} đ`}
                      title={t('TOTAL_MONEY')}
                      value={totalAmount}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={4} textAlign='right'>
              <Button onClick={onDownloadAmountCSV} type='primary'>
                {t('EXPORT_CSV_TEXT')}
              </Button>
            </Col>
          </Row>

          <Table
            pagination={{
              total: totalRecords,
              pageSize: DEFAULT_PAGE_SIZE,
              current: Number(paramSearch.page) || 1,
              showSizeChanger: false,
            }}
            showSorterTooltip={false}
            onChange={onChangeTable}
            loading={loading}
            dataSource={dataWithAmount}
            columns={columnsWithdrawal}
            scroll={{ x: 700 }}
            rowKey='id'
          />
        </Tabs.TabPane>
      </Tabs>
      {renderModal}
    </Card>
  );
};

export default Index;
