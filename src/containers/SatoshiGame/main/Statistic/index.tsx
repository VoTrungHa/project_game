import { DatePicker, Divider, Form, TablePaginationConfig } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { Col, Row } from 'components/Container';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { getStatisticGameAction } from 'containers/SatoshiGame/duck/thunks';
import {
  FORMAT_MOMENT,
  parseGetUnixTimeValue,
  parseMoment,
  parseParamToObject,
  parseRanges,
  parseRangesThisMonth,
  parseRangesToday,
  parseUnixTimeValueToEndOfDay,
} from 'helpers/common';
import { useAppDispatch } from 'hooks/reduxcustomhook';
import i18n from 'locales';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import List from './components/List';
import Summary from './components/Summary';

const { DATE_SLASH_LONG } = FORMAT_MOMENT;

const Statistic = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);

  const dispatch = useAppDispatch();

  const [paramSearch, setParamSearch] = useState<any>({
    ...params,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : undefined,
    to: params.to ? parseGetUnixTimeValue(params.to as string) : undefined,
    sortOrder: undefined,
    userId: undefined,
  });

  const onChangeDatePicker = useCallback((value) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : undefined,
      to: value ? parseGetUnixTimeValue(value[1]) : undefined,
    }));
  }, []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current,
        sortOrder: sorter.column ? (sorter.order === 'descend' ? 'DESC' : 'ASC') : undefined,
      }));
    }
  }, []);

  useEffect(() => {
    const params = {
      ...paramSearch,
      size: DEFAULT_PAGE_SIZE,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? parseUnixTimeValueToEndOfDay(paramSearch.to)
          : paramSearch.to
        : undefined,
    };
    dispatch(getStatisticGameAction(params));
  }, [dispatch, history, paramSearch]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Form.Item>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              placeholder={[t('SELECT_DATE'), t('SELECT_DATE')]}
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
      </Row>
      <Divider />
      <Summary />
      <List {...{ paramSearch, onChangeTable }} />
    </>
  );
};

export default Statistic;
