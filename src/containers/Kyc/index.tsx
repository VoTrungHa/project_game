/* eslint-disable react/display-name */
import { CalendarFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { KycAPI } from 'apis/kyc';
import { Col, Row } from 'components/Container';
import { Image } from 'components/Image';
import { Textlink } from 'components/Textlink';
import { DEFAULT_PAGE_SIZE, KYC_DOC_TYPE, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  formatMoment,
  FORMAT_MOMENT,
  Moment,
  parseArrayToStringWithComma,
  parseDate,
  parseObjectToParam,
  parseParamToObject,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getListKyc } from './duck/thunks';

interface IModalState {
  type: 'Info';
  data: IKyc;
  kycDetail?: IKycDetailResponse;
  isOpen: boolean;
}

const { DATE_TIME_SLASH_LONG, DATE_SLASH_LONG, DATE_LONG } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const inputSearchRef = useRef<Input | null>(null);
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const params: IListKycRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState(params);
  const dispatch = useAppDispatch();
  const { data, loading, totalRecords } = useAppSelector((state) => state.kyc);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [formUpdate] = Form.useForm();
  const [isReject, setReject] = useState({ photo: false, video: false });

  useEffect(() => {
    dispatch(getListKyc(paramSearch));
    history.push({ pathname: PATH.KYC, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  useEffect(() => {
    if (!modalState) {
      formUpdate.resetFields();
      setReject({ photo: false, video: false });
    }
  }, [formUpdate, modalState]);

  const dataSource = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        createdAt: formatMoment(item.createdAt, DATE_TIME_SLASH_LONG),
        fullName: item.accKyc.fullName,
        email: item.accKyc.email,
        phone: item.accKyc.phone,
        status: STATUS_KYC.PENDING,
      })),
    [data],
  );

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onCloseModal = () => setModalState(undefined);

  const onChangeTable = useCallback(
    (pagination: TablePaginationConfig, filters: Record<string, (boolean | React.Key)[] | null>) => {
      if (pagination.current) {
        setParamSearch((prev) => ({
          ...prev,
          page: pagination.current,
          status:
            filters.status && filters.status.length > 0
              ? parseArrayToStringWithComma(filters.status as string[])
              : undefined,
        }));
      }
    },
    [],
  );

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.KYC);
  }, [history]);

  const onSearchInput = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (keyword) {
        setParamSearch((prev) => ({
          ...prev,
          keyword,
        }));
      } else {
        onClearFilter();
      }
    },
    [onClearFilter],
  );

  const onChangeDatePicker = (value: Moment | null) => {
    if (value) {
      setParamSearch((prev) => ({
        ...prev,
        createdAt: value.format(DATE_LONG),
      }));
    }
  };

  const onResetDatePicker = () =>
    setParamSearch((prev) => ({
      ...prev,
      createdAt: undefined,
    }));

  const onChangeSelect = useCallback((e: RadioChangeEvent, field: 'photo' | 'video') => {
    setReject((prev) => ({
      ...prev,
      [field]: e.target.value === STATUS_KYC.REJECTED,
    }));
  }, []);

  const onFinishForm = useCallback(
    async (values) => {
      const { photoStatus, videoStatus, reason } = values;
      try {
        if (modalState) {
          const payload: IUpdateKYCRequest = {
            id: modalState.data.id,
            accountId: modalState.data.accKyc.id,
            photoStatus: photoStatus || modalState.data.photoStatus,
            videoStatus: videoStatus || modalState.data.videoStatus,
            reason: reason || 'approved',
          };
          const res = await KycAPI.UPDATE_KYC(payload);
          if (res.id) {
            dispatch(getListKyc(paramSearch));
            setModalState(undefined);
            message.success(t('COMMON_UPDATE_STATUS_KYC_SUCCESS'));
          }
        }
      } catch (error: any) {
        message.error(error.response.data.message[0].message);
      }
    },
    [dispatch, modalState, paramSearch, t],
  );

  const onSubmitModal = useCallback(() => {
    formUpdate.submit();
  }, [formUpdate]);

  const getColumnSearchProps = useCallback(
    (dataIndex: string) => ({
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <DatePicker
            locale={i18n.language === 'vn' ? vn : undefined}
            format={DATE_SLASH_LONG}
            placeholder={DATE_SLASH_LONG}
            style={{ marginBottom: 5, display: 'block' }}
            onChange={onChangeDatePicker}
            value={paramSearch.createdAt ? parseDate(paramSearch.createdAt, DATE_LONG) : undefined}
          />
          <Button size='small' style={{ width: 90 }} onClick={onResetDatePicker}>
            {t('COMMON_BUTTON_RESET')}
          </Button>
        </div>
      ),
      filterIcon: () => <CalendarFilled style={{ color: paramSearch.createdAt ? '#1890ff' : undefined }} />,
    }),
    [i18n.language, paramSearch.createdAt, t],
  );

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
      render: (value: string, record: IKyc) => (
        <Textlink
          text={value}
          onClick={async () => {
            try {
              const res = await KycAPI.GET_KYC_DETAIL_BY_ID(record.id);
              if (res) {
                onOpenModal({ isOpen: true, type: 'Info', data: record, kycDetail: res });
              }
            } catch (error) {
              onOpenModal({ isOpen: true, type: 'Info', data: record });
            }
          }}
        />
      ),
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
      render: (value: string) => <>{value || '--'}</>,
    },
    {
      title: 'DocType',
      dataIndex: 'docType',
      key: 'docType',
      render: (docType: KYC_DOC_TYPE) => (
        <>
          {Number(docType) === KYC_DOC_TYPE.IDENTITY_CARD && t('IDENTITY_CARD_TEXT')}
          {Number(docType) === KYC_DOC_TYPE.CITIZEN_IDENTIFICATION && t('CITIZEN_IDENTIFICATION_TEXT')}
          {Number(docType) === KYC_DOC_TYPE.PASSPORT && t('PASSPORT_TEXT')}
          {!docType && '--'}
        </>
      ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS_KYC) => (
        <>
          {Number(status) === STATUS_KYC.PENDING && (
            <Typography.Text type='warning'>{t('PENDING_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_KYC.APPROVED && (
            <Typography.Text type='success'>{t('APPROVED_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_KYC.REJECTED && (
            <Typography.Text type='danger'>{t('REJECTED_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      ...getColumnSearchProps('createdAt'),
    },
  ];

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Info') {
      const { data, kycDetail, isOpen } = modalState;
      return (
        <Modal
          okText={t('COMMON_BUTTON_UPDATE')}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          title={t('COMMON_UPDATE_STATUS_LABEL')}
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          centered
          width={1000}
          okButtonProps={{
            style: {
              display:
                data.photoStatus === STATUS_KYC.PENDING || data.videoStatus === STATUS_KYC.PENDING ? 'initial' : 'none',
            },
          }}
          visible={isOpen}>
          <Descriptions column={2}>
            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('FULL_NAME_TEXT')}>
              {data.accKyc.fullName}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label='Email'>
              {data.accKyc.email}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('PHONE_TEXT')}>
              {data.accKyc.phone}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('CREATED_AT_TEXT')}>
              {data.createdAt}
            </Descriptions.Item>
          </Descriptions>
          {kycDetail && (
            <>
              <Descriptions column={2} layout='vertical'>
                <Descriptions.Item label={t('FRONT_TEXT')} labelStyle={{ fontWeight: 'bold' }}>
                  <Image width={300} className='ant-image-show-mask' height={200} src={kycDetail.photoFront} />
                </Descriptions.Item>
                <Descriptions.Item label={t('BACK_TEXT')} labelStyle={{ fontWeight: 'bold' }}>
                  <Image width={300} className='ant-image-show-mask' height={200} src={kycDetail.photoBack} />
                </Descriptions.Item>
              </Descriptions>
              <Descriptions column={2} layout='vertical'>
                <Descriptions.Item label='Video' labelStyle={{ fontWeight: 'bold' }}>
                  <video width={300} height={200} controls>
                    <source type='video/mp4' src={kycDetail.selfieVideo} />
                  </video>
                </Descriptions.Item>
                <Descriptions.Item label={t('VERIFY_KYC_TEXT')} labelStyle={{ fontWeight: 'bold' }}>
                  <Form onFinish={onFinishForm} form={formUpdate}>
                    {data.photoStatus === STATUS_KYC.PENDING && (
                      <Form.Item name='photoStatus' label='Photo' initialValue={STATUS_KYC.APPROVED}>
                        <Radio.Group onChange={(e: RadioChangeEvent) => onChangeSelect(e, 'photo')}>
                          <Radio value={STATUS_KYC.APPROVED}>{t('APPROVE_TEXT')}</Radio>
                          <Radio value={STATUS_KYC.REJECTED}>{t('REJECT_TEXT')}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    {data.videoStatus === STATUS_KYC.PENDING && (
                      <Form.Item name='videoStatus' label='Video' initialValue={STATUS_KYC.APPROVED}>
                        <Radio.Group onChange={(e: RadioChangeEvent) => onChangeSelect(e, 'video')}>
                          <Radio value={STATUS_KYC.APPROVED}>{t('APPROVE_TEXT')}</Radio>
                          <Radio value={STATUS_KYC.REJECTED}>{t('REJECT_TEXT')}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    {(isReject['video'] || isReject['photo']) && (
                      <Form.Item name='reason' rules={[{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]}>
                        <Input placeholder={t('REASON_TEXT')} />
                      </Form.Item>
                    )}
                  </Form>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Modal>
      );
    }
  }, [formUpdate, isReject, modalState, onChangeSelect, onFinishForm, onSubmitModal, t]);

  return (
    <Card>
      <Row gutter={[0, 5]}>
        <Col md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_KEYWORD_TEXT')}
            style={{ width: 400 }}
          />
          <Button disabled={Object.keys(paramSearch).length === 0} onClick={onClearFilter}>
            {t('COMMON_BUTTON_FILTER')}
          </Button>
        </Col>
      </Row>
      <br />
      <Table
        pagination={{ total: totalRecords, pageSize: DEFAULT_PAGE_SIZE, current: Number(paramSearch.page) || 1 }}
        onChange={onChangeTable}
        showSorterTooltip={false}
        sortDirections={['descend']}
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey='id'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
