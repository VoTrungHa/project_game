/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Divider, Form, Input, Modal, Statistic, Table, TablePaginationConfig, Typography } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import { convertToVNDC, formatter, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getListPlayer, getListPlayerStat } from './duck/thunks';

const accountOrderBy = {
  totalEgg: {
    ascend: 1,
    descend: 2,
  },
  totalChicken: {
    ascend: 3,
    descend: 4,
  },
  totalAmount: {
    ascend: 5,
    descend: 6,
  },
};

interface IModalState {
  type: 'Info';
  isOpen: boolean;
  data?: IPlayerDataItem;
}

const Index: React.FC = () => {
  const inputSearchRef = useRef<Input | null>(null);
  const { t } = useTranslation();
  const {
    playerList: { list, loading, stat },
    systemconfig: { rate },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const params: IPlayerListRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState({ ...params, order: 6 });
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);

  useDidMount(() => {
    dispatch(getListPlayerStat());
  });

  useEffect(() => {
    dispatch(getListPlayer(paramSearch));
    history.push({ pathname: PATH.PLAYERLIST, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({ page: 1, size: DEFAULT_PAGE_SIZE, order: 6 });
    history.push(PATH.PLAYERLIST);
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
    [onClearFilter],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Info') {
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
                <Form.Item name='fullName' label={t('USER_NAME_TEXT')} initialValue={modalState.data?.fullName}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='email' label='Email' initialValue={modalState.data?.email}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name='phone' label={t('PHONE_TEXT')} initialValue={modalState.data?.phone}>
                  <InputNumber readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Link style={{ marginRight: 5 }} state={modalState.data} to={`${PATH.PLAYERDETAIL}/${modalState.data?.id}`}>
            {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
          </Link>
        </Modal>
      );
    }
  }, [modalState, t, onChangeModal]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
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
      render: (value: string, record) => (
        <Link target='_blank' to={`${PATH.PLAYERDETAIL}/${record.id}`}>
          {value}
        </Link>
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
    },
    {
      title: t('AMOUNT_AVAILABLE'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 200,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      defaultSortOrder: 'descend' as SortOrder,
      sorter: (a, b) => a.totalEgg - b.totalEgg,
      render: (value: number) => {
        const vndc = convertToVNDC(value, rate?.SATVNDC.bid);
        return (
          <>
            <Typography.Title type='success' level={5}>
              {`${formatter.format(value)} Sat`}
            </Typography.Title>
            <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
              {`( ${formatter.format(Number(vndc))} đ )`}
            </Typography.Text>
          </>
        );
      },
    },
    {
      title: t('TOTAL_EGG'),
      dataIndex: 'totalEgg',
      key: 'totalEgg',
      width: 150,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.totalEgg - b.totalEgg,
    },
    {
      title: t('TOTAL_CHICKEN'),
      dataIndex: 'totalChicken',
      key: 'totalChicken',
      width: 150,
      sortDirections: ['descend', 'ascend', undefined] as Array<SortOrder>,
      sorter: (a, b) => a.totalChicken - b.totalChicken,
    },
  ];

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
        order: sorter.column ? accountOrderBy[sorter.field][sorter.order] : undefined,
      }));
    }
  }, []);

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('PLACEHOLDER_TEXT')}
            allowClear
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_GOLDEN_EGG')} value={stat?.totalGoldenEggs} />
          </Card>
        </Col>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_HEN_EGG')} value={stat?.totalHenEggs} />
          </Card>
        </Col>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_ROOSTER_EGG')} value={stat?.totalRoosterEggs} />
          </Card>
        </Col>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_HEN_CHICKEN')} value={stat?.totalHenChickens} />
          </Card>
        </Col>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_ROOSTER_CHICKEN')} value={stat?.totalRoosterChickens} />
          </Card>
        </Col>
        <Col xxl={8} xl={12} xs={24}>
          <Card style={{ height: '100%' }}>
            <Statistic title={t('TOTAL_AMOUNT_AVAILABLE')} value={stat?.totalAmount.toFixed()} />
          </Card>
        </Col>
      </Row>
      <Table
        pagination={{
          total: list ? list.totalRecords : 0,
          pageSize: DEFAULT_PAGE_SIZE,
          current: Number(paramSearch.page) || 1,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        onChange={onChangeTable}
        loading={loading}
        sortDirections={['descend']}
        dataSource={list ? list.data : []}
        columns={columns}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      {renderModal}
    </Card>
  );
};

export default Index;
