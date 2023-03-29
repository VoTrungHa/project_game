/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, message, Table, TablePaginationConfig, Typography } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { SortOrder } from 'antd/lib/table/interface';
import { LuckySpinAPI } from 'apis/luckyspin';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  downloadCSV,
  formatDate,
  formatDateNowMoment,
  formatEndOfDay,
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
  parseUnixTime,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { RangeValue } from 'rc-picker/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StatisticSummary from './components/StatisticSummary';
import { getListLuckySpinStatistic } from './duck/thunks';

const { DATE_LONG, DATE_SLASH_LONG, DD_MM_YYYY } = FORMAT_MOMENT;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const {
    luckySpinStatistic: { data, totalRecords, loading },
  } = useAppSelector((state) => state);
  const location = useLocation();
  const params = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState<ILuckyWheelStatisticRequest>({
    from: params.from ? formatMoment(params.from as string, DATE_LONG) : formatSubtractCountDays(7, DATE_LONG),
    to: formatDate(params.to as string, DATE_LONG),
    size: DEFAULT_PAGE_SIZE,
    page: params.page && Number(params.page) ? Number(params.page) : 1,
    sortKey: 'date',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    const params = {
      ...paramSearch,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? formatEndOfDay(paramSearch.to, DATE_LONG)
          : paramSearch.to
        : undefined,
    };
    dispatch(getListLuckySpinStatistic(params));
    history.push({ pathname: PATH.LUCKYSPINSTATISTIC, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onChangeDatePicker = useCallback((value: RangeValue<Moment>) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? formatMoment(Number(value[0]), DATE_LONG) : undefined,
      to: value ? formatMoment(Number(value[1]), DATE_LONG) : undefined,
    }));
  }, []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
        sortKey: sorter.column ? sorter.field : prev.sortKey,
        sortOrder: sorter.column ? (sorter.order === 'descend' ? 'DESC' : 'ASC') : prev.sortOrder,
      }));
    }
  }, []);

  const onDownloadCSV = useCallback(async () => {
    const params = {
      ...paramSearch,
      from: paramSearch.from ? paramSearch.from : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? formatEndOfDay(paramSearch.to, DATE_LONG)
          : paramSearch.to
        : undefined,
    };
    try {
      const res = await LuckySpinAPI.DOWNLOAD_CSV(params);
      downloadCSV(res, `lucky_spin_${formatDateNowMoment(DATE_LONG)}.csv`);
    } catch (error) {
      message.error(t('DOWNLOAD_CSV_ERROR'));
    }
  }, [paramSearch, t]);

  const columns = [
    {
      title: t('DATE_SPIN'),
      dataIndex: 'date',
      key: 'date',
      width: 150,
      sorter: (a, b) => parseUnixTime(a) - parseUnixTime(b),
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      render: (value: string) => formatDate(value, DD_MM_YYYY),
    },
    {
      title: t('TOTAL_USER_SPIN'),
      dataIndex: 'totalUsers',
      key: 'totalUsers',
      width: 150,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.totalUsers - b.totalUsers,
      render: (value) => formatter.format(value),
    },
    {
      title: t('TOTAL_SAT_WON'),
      dataIndex: 'totalSAT',
      key: 'totalSAT',
      width: 190,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.totalSAT - b.totalSAT,
      render: (value) => <Typography.Title level={5}>{formatter.format(value)} SAT</Typography.Title>,
    },
    {
      title: t('TIMES_NOT_WIN'),
      dataIndex: 'noPrize',
      key: 'noPrize',
      width: 150,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.noPrize - b.noPrize,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 50`,
      dataIndex: 'prize50',
      key: 'prize50',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize50 - b.prize50,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 100`,
      dataIndex: 'prize100',
      key: 'prize100',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize100 - b.prize100,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 200`,
      dataIndex: 'prize200',
      key: 'prize200',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize200 - b.prize200,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 300`,
      dataIndex: 'prize300',
      key: 'prize300',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize300 - b.prize300,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 400`,
      dataIndex: 'prize400',
      key: 'prize400',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize400 - b.prize400,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 500`,
      dataIndex: 'prize500',
      key: 'prize500',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize500 - b.prize500,
    },
    {
      title: `${t('NUMBERS_OF_WINS')} 1000`,
      dataIndex: 'prize1000',
      key: 'prize1000',
      width: 170,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.prize1000 - b.prize1000,
    },
    {
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (_, record: ILuckyWheelStatisticItem) => (
        <Link style={{ marginRight: 5 }} to={`${PATH.LUCKYSPINSTATISTICDETAIL}/${record.isoDate}`}>
          {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
        </Link>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[12, 12]}>
        <Col xxl={8} xl={14} lg={14} md={24} xs={24}>
          <Form.Item label={t('TIME_SPIN')}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format={DATE_SLASH_LONG}
              locale={i18n.language === 'vn' ? vn : undefined}
              allowClear={false}
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
        <Col xxl={16} xl={10} lg={10} md={24} xs={24} textAlign='right'>
          <Button type='primary' onClick={onDownloadCSV}>
            {t('EXPORT_CSV_TEXT')}
          </Button>
        </Col>
      </Row>
      <StatisticSummary />
      <br />
      <Table
        pagination={{
          total: totalRecords,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
          showSizeChanger: false,
        }}
        onChange={onChangeTable}
        showSorterTooltip={false}
        sortDirections={['descend']}
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 700 }}
        rowKey='isoDate'
      />
    </Card>
  );
};

export default Index;
