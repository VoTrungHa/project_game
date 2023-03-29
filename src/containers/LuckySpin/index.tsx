/* eslint-disable react/display-name */
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Form, Input, message, Modal, Select, Table, TablePaginationConfig, Typography } from 'antd';
import { LuckySpinAPI } from 'apis/luckyspin';
import { Link } from 'components/Link';
import { Textlink } from 'components/Textlink';
import { APPROVE_SPIN, DAILY_LUCKY_WHEEL_TYPE_UNIT, DEFAULT_PAGE_SIZE, REWARD_STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import { formatMoment, FORMAT_MOMENT, parseObjectToParam, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getLuckyPrizeSpin } from './duck/thunks';

interface IModalState {
  type: 'Edit';
  data: ILuckySpinItem;
  isOpen: boolean;
}

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
const Index: React.FC = () => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { data, loading, totalRecords } = useAppSelector((state) => state.luckyspin);
  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState<ILuckySpinRequest>({
    ...params,
    needApproval: params.needApproval === 'true',
  });
  const [formApprove] = Form.useForm();

  useEffect(() => {
    if (!modalState) {
      formApprove.resetFields();
    }
  }, [modalState, formApprove]);

  useEffect(() => {
    dispatch(getLuckyPrizeSpin(paramSearch));
    history.push({ pathname: PATH.LUCKYSPIN, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

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
      dataIndex: 'account',
      key: 'account',
      width: 150,
      render: (account) => account.fullName,
    },
    {
      title: t('TITLE_TEXT'),
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (_, record: ILuckySpinItem) =>
        record.isApproved ? (
          record.rewardTitle || '--'
        ) : (
          <Textlink
            text={record.rewardTitle}
            onClick={() => onOpenModal({ type: 'Edit', isOpen: true, data: record })}
          />
        ),
    },
    {
      title: t('REWARD_TEXT'),
      dataIndex: 'reward',
      key: 'reward',
      width: 150,
      render: (_, record: ILuckySpinItem) => `${record.reward}${DAILY_LUCKY_WHEEL_TYPE_UNIT[record.type]}`,
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      render: (_, record: ILuckySpinItem) => (
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
      width: 150,
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'rewardAt',
      key: 'rewardAt',
      render: (_, record: ILuckySpinItem) => formatMoment(record.createdAt, DATE_TIME_SLASH_LONG),
    },
  ];

  const onCloseModal = () => setModalState(undefined);
  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Edit') {
      formApprove.submit();
    }
  }, [modalState, formApprove]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState || !modalState.data) return;
      if (modalState.type === 'Edit') {
        try {
          const res = await LuckySpinAPI.APPROVE_LUCKY_SPIN_BY_ID({
            id: modalState.data.id,
            note: values.note,
            approval: values.approval === APPROVE_SPIN.YES,
          });
          if (res.status) {
            dispatch(getLuckyPrizeSpin(paramSearch));
            onCloseModal();
            message.success(t('APPROVE_DAILY_SPIN_SUCCESS'));
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [dispatch, modalState, paramSearch, t],
  );

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current,
      }));
    }
  }, []);

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Edit') {
      return (
        <Modal
          visible={true}
          centered
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          title={t('APPROVE_SPIN_TEXT')}
          cancelText={t('COMMON_BUTTON_CLOSE')}>
          <Form form={formApprove} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={onFinishForm}>
            <Form.Item name='approval' label={t('APPROVAL_TEXT')} initialValue={APPROVE_SPIN.YES}>
              <Select>
                <Select.Option value={APPROVE_SPIN.YES}>{t('AGREE_TEXT')}</Select.Option>
                <Select.Option value={APPROVE_SPIN.NO}>{t('DISAGREE_TEXT')}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t('NOTE_TEXT')}
              name='note'
              rules={[{ required: true, message: t('COMMON_NOTE_REQUIRED_ERROR') }]}>
              <Input.TextArea />
            </Form.Item>
          </Form>
          <Link style={{ marginRight: 5 }} to={`${PATH.MOBILEUSERDETAIL}/${modalState.data.account.id}`}>
            {t('INFORMATION_USER_TEXT')} <ArrowRightOutlined />
          </Link>
        </Modal>
      );
    }
  }, [modalState, onSubmitModal, t, formApprove, onFinishForm]);

  return (
    <Card>
      <Select
        style={{ width: 200, marginBottom: 10 }}
        value={paramSearch.needApproval ? APPROVE_SPIN.YES : APPROVE_SPIN.NO}
        onChange={(value: number) => {
          setParamSearch((prev) => ({ ...prev, needApproval: value === APPROVE_SPIN.YES }));
        }}>
        <Select.Option value={APPROVE_SPIN.YES}>{t('NEED_APPROVAL_TEXT')}</Select.Option>
        <Select.Option value={APPROVE_SPIN.NO}>{t('NON_NEED_APPROVAL_TEXT')}</Select.Option>
      </Select>
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
