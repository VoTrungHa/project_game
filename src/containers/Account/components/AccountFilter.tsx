import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { StatisticAPI } from 'apis/statistic';
import { Col, Row } from 'components/Container';
import { SELECT_REFERRAL_ACCOUNT, SELECT_REFERRAL_BY, STATUS, STATUS_KYC } from 'constants/index';
import {
  downloadCSV,
  formatDateNowMoment,
  FORMAT_MOMENT,
  parseMoment,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
} from 'helpers/common';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const { DD_MM_YYYY, DATE_SLASH_LONG } = FORMAT_MOMENT;
const { PARTNER, MOBILE_USER, ALL } = SELECT_REFERRAL_ACCOUNT;
const { EMPTY, PENDING, APPROVED, REJECTED } = STATUS_KYC;
const { REFERRAL, NONE_REFERRAL } = SELECT_REFERRAL_BY;
const { ACTIVE, INACTIVE } = STATUS;
const { Option } = Select;

interface AccountFilterProps {
  paramSearch: IAccountRequest;
  onSearchInput: (value: string) => void;
  onChangeDatePicker: (value: any) => void;
  onChangeStatus: (status: number) => void;
  onChangeIsPartner: (isPartner: number) => void;
  onChangeKycStatus: (kycStatus: number) => void;
  onChangeReferralStatus: (isReferral: number) => void;
}

const AccountFilter: React.FC<AccountFilterProps> = ({
  paramSearch,
  onSearchInput,
  onChangeDatePicker,
  onChangeStatus,
  onChangeIsPartner,
  onChangeKycStatus,
  onChangeReferralStatus,
}) => {
  const { t, i18n } = useTranslation();

  const onDownloadAmountCSV = useCallback(async () => {
    const params = {
      ...paramSearch,
    };
    try {
      const res = await StatisticAPI.DOWNLOAD_AMOUNT_CSV(params);
      downloadCSV(res, `accounts_amount_${formatDateNowMoment(DD_MM_YYYY)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xxl={8} xl={24} lg={24} md={24} xs={24}>
          <Form.Item>
            <Input.Search
              defaultValue={paramSearch.keyword}
              onSearch={onSearchInput}
              placeholder={t('PLACEHOLDER_TEXT')}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24} xs={24}>
          <Form.Item label={t('JOIN_DATE_TEXT')}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
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
          </Form.Item>
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24} xs={24}>
          <Form.Item label={t('STATUS_TEXT')}>
            <Select
              onChange={onChangeStatus}
              style={{ width: '100%' }}
              defaultValue={paramSearch.status ? Number(paramSearch.status) : STATUS.ALL}>
              <Option value={STATUS.ALL}>{t('ALL_TEXT')}</Option>
              <Option value={ACTIVE}>{t('ACTIVE')}</Option>
              <Option value={INACTIVE}>{t('INACTIVE')}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Form.Item label={t('TYPE_USER_TEXT')}>
            <Select
              onChange={onChangeIsPartner}
              style={{ width: '100%' }}
              defaultValue={
                typeof paramSearch.isPartner === 'boolean' ? (paramSearch.isPartner ? PARTNER : MOBILE_USER) : ALL
              }>
              <Option value={ALL}>{t('ALL_TEXT')}</Option>
              <Option value={PARTNER}>{t('MENU_PARTNER')}</Option>
              <Option value={MOBILE_USER}>{t('MENU_MOBILE_USER')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Form.Item label={t('KYC_STATUS_TEXT')}>
            <Select
              onChange={onChangeKycStatus}
              style={{ width: '100%' }}
              defaultValue={paramSearch.kycStatus ? Number(paramSearch.kycStatus) : STATUS_KYC.ALL}>
              <Option value={STATUS_KYC.ALL}>{t('ALL_TEXT')}</Option>
              <Option value={EMPTY}>{t('NON_KYC_TEXT')}</Option>
              <Option value={PENDING}>{t('PENDING_TEXT')}</Option>
              <Option value={APPROVED}>{t('APPROVED_TEXT')}</Option>
              <Option value={REJECTED}>{t('REJECTED_TEXT')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Form.Item label={t('REGISTRATION_FORM')}>
            <Select
              style={{ width: '100%' }}
              onChange={onChangeReferralStatus}
              defaultValue={
                typeof paramSearch.isReferral === 'boolean'
                  ? paramSearch.isReferral
                    ? REFERRAL
                    : NONE_REFERRAL
                  : SELECT_REFERRAL_BY.ALL
              }>
              <Option value={SELECT_REFERRAL_BY.ALL}>{t('ALL_TEXT')}</Option>
              <Option value={REFERRAL}>{t('SIGN_UP_WITH_REFERRAL')}</Option>
              <Option value={NONE_REFERRAL}>{t('SIGN_UP_WITH_NON_REFERRAL')}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 12]} justify='end'>
        <Col>
          <Button onClick={onDownloadAmountCSV} type='primary'>
            {t('EXPORT_CSV_TEXT')}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AccountFilter;
