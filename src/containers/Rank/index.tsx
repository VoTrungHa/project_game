/* eslint-disable react/display-name */
import { ArrowRightOutlined, EditTwoTone } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Table, TablePaginationConfig, Tooltip, Typography } from 'antd';
import { RankAPI } from 'apis/rank';
import { Col, Row } from 'components/Container';
import { Link } from 'components/Link';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatter, FORMAT_MOMENT, parseTime } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RankModal from './components/RankModal';
import { getListRank } from './duck/thunks';

const { DATE_TIME_SLASH_SHORT } = FORMAT_MOMENT;
interface IModalState {
  type: 'Add' | 'Edit';
  data?: IRankItem;
  isOpen: boolean;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [paramSearch, setParamSearch] = useState({ page: 1, size: DEFAULT_PAGE_SIZE });
  const [formAdd] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data, loading, totalRecords } = useAppSelector((state) => state.rank);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
    }
  }, [formAdd, modalState, paramSearch]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onEditUser = useCallback(
    async (record: any) => {
      onChangeModal({
        isOpen: true,
        type: 'Edit',
      });
      try {
        const res = await RankAPI.GET_DETAIL_BY_ID(record.id);
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: res,
        });
      } catch (error) {
        onChangeModal({
          isOpen: true,
          type: 'Edit',
          data: record,
        });
      }
    },
    [onChangeModal],
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: id,
          }}>
          {id}
        </Typography.Text>
      ),
    },
    {
      title: t('NAME_TEXT'),
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: IRankItem) => (
        <>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', fontWeight: 500 }} type='secondary'>
            {record.description}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t('PRIZE_POOL'),
      dataIndex: 'totalPrize',
      key: 'totalPrize',
      render: (totalPrize: number, record: IRankItem) => (
        <>{`${formatter.format(totalPrize)} ${record?.currency?.code}`}</>
      ),
    },
    {
      title: t('TIME_START'),
      dataIndex: 'timeStart',
      key: 'timeStart',
      render: (timeStart: string) => parseTime(timeStart, DATE_TIME_SLASH_SHORT),
    },
    {
      title: t('TIME_END'),
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: (timeStart: string) => parseTime(timeStart, DATE_TIME_SLASH_SHORT),
    },
    {
      title: t('PUBLIC'),
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 150,
      render: (isPublic) => <Checkbox checked={isPublic} disabled={true} />,
    },
    {
      dataIndex: 'id',
      key: 'see_detail',
      width: 150,
      render: (_, record) => (
        <>
          <Tooltip title={t('UPDATE_RANK_TABLE')}>
            <EditTwoTone onClick={() => onEditUser(record)} style={{ marginRight: 15 }} />
          </Tooltip>
          <Tooltip title={t('INFODETAIL_TEXT')}>
            <Link to={`${PATH.RANKDETAIL}/${record.id}`}>
              <ArrowRightOutlined />
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getListRank({ page: paramSearch.page, size: DEFAULT_PAGE_SIZE }));
  }, [dispatch, paramSearch]);

  return (
    <Card>
      <Row gutter={[5, 5]} justify='end'>
        <Col>
          <Button onClick={() => onChangeModal({ type: 'Add', isOpen: true })} type='primary'>
            {t('ADD_RANK_TABLE')}
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
        sortDirections={['descend']}
        columns={columns}
        loading={loading}
        dataSource={data}
        scroll={{ x: 700 }}
        rowKey='id'
      />
      <RankModal {...{ paramSearch, modalState, setModalState, onChangeModal }} />
    </Card>
  );
};

export default Index;
