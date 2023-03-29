import { Card, DatePicker, Divider, Form, TablePaginationConfig } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { Col, Row } from 'components/Container';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  FORMAT_MOMENT,
  parseGetUnixTimeValue,
  parseMoment,
  parseObjectToParam,
  parseParamToObject,
  parseUnixTimeToStartOfMonth,
  parseUnixTimeValueToEndOfMonth,
  parseUnixTimeValueToStartOfMonth,
} from 'helpers/common';
import { useAppDispatch } from 'hooks/reduxcustomhook';
import i18n from 'locales';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StatisticStackingSummary from './components/StatisticStackingSummary';
import StatisticStackingTable from './components/StatisticStackingTable';
import { getStatisticStackingAction, getStatisticStackingStatAction } from './duck/thunks';

const { MM_YYYY } = FORMAT_MOMENT;

const StatisticStacking: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);

  const dispatch = useAppDispatch();

  const [paramSearch, setParamSearch] = useState<IStatisticStackingRequest>({
    ...params,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : parseUnixTimeToStartOfMonth(),
    to: params.to ? parseGetUnixTimeValue(params.to as string) : parseUnixTimeToStartOfMonth(),
  });

  const onChangeDatePicker = useCallback((value) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseUnixTimeValueToStartOfMonth(value[0]) : undefined,
      to: value
        ? value[0] === value[1]
          ? parseUnixTimeValueToEndOfMonth(value[1])
          : parseUnixTimeValueToStartOfMonth(value[1])
        : undefined,
    }));
  }, []);

  useEffect(() => {
    const params = {
      ...paramSearch,
      size: DEFAULT_PAGE_SIZE,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? parseUnixTimeValueToEndOfMonth(paramSearch.to)
          : paramSearch.to
        : undefined,
    };
    dispatch(getStatisticStackingAction(params));
    dispatch(getStatisticStackingStatAction(params));
    history.push({ pathname: PATH.STATISTIC_STACKING, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current,
      }));
    }
  }, []);

  return (
    <Card>
      <Row gutter={[12, 12]}>
        <Col xxl={8} xl={12} lg={12} md={24} xs={24}>
          <Form.Item>
            <DatePicker.RangePicker
              placeholder={[t('SELECT_MONTH'), t('SELECT_MONTH')]}
              format={MM_YYYY}
              locale={i18n.language === 'vn' ? vn : undefined}
              onChange={onChangeDatePicker}
              value={[
                paramSearch.from ? parseMoment(paramSearch.from) : null,
                paramSearch.to ? parseMoment(paramSearch.to) : null,
              ]}
              picker='month'
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <StatisticStackingSummary />
      <StatisticStackingTable {...{ paramSearch, onChangeTable }} />
    </Card>
  );
};

export default StatisticStacking;
