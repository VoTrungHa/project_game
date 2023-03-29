/* eslint-disable react/display-name */
import { ArrowLeftOutlined, ArrowRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Empty, message, Spin, Table, Tabs, Tooltip, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { RankAPI } from 'apis/rank';
import { REFERRAL_RANKING_STATUS } from 'constants/index';
import { PATH } from 'constants/paths';
import { PageHeaderCustom } from 'containers/PageHeader';
import { FORMAT_MOMENT, parseIsBefore, parseTime, parseUnix, parseUnixDateNow, showConfirm } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getRankDetail, getRankTable } from './duck/thunks';

const { DATE_TIME_SLASH_SHORT } = FORMAT_MOMENT;
const { PARTNERDETAIL, MOBILEUSERDETAIL } = PATH;

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { rankId: id } = useParams<{ rankId: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    rankDetail: { loading, rankDetailInformation, accounts },
  } = useAppSelector((state) => state);
  const isXs = useBreakpoint().xs;

  useEffect(() => {
    if (!id) return;
    dispatch(getRankDetail(id));
    dispatch(getRankTable(id));
  }, [dispatch, id]);

  const isDisableReward = useMemo(() => {
    if (
      !rankDetailInformation ||
      accounts.length === 0 ||
      rankDetailInformation.status === REFERRAL_RANKING_STATUS.AWARDED
    )
      return true;
    const now = parseUnixDateNow();
    const timeEnd = parseUnix(rankDetailInformation.timeEnd as number);
    return parseIsBefore(now, timeEnd);
  }, [accounts, rankDetailInformation]);

  const columns = [
    {
      title: t('POSITION'),
      dataIndex: 'rank',
      key: 'rank',
      render: (value: number) => (
        <Typography.Title type='success' level={5}>
          {value}
        </Typography.Title>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (_, record) => (
        <Typography.Text
          copyable
          style={{ cursor: 'pointer' }}
          ellipsis={{
            tooltip: record.account.id,
          }}>
          {record.account.id}
        </Typography.Text>
      ),
    },
    {
      title: t('USER_NAME_TEXT'),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => record.account.fullName,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => <span>{record.account.email || '--'}</span>,
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record) => <span>{record.account.phone || '--'}</span>,
    },
    {
      title: 'Referrals',
      dataIndex: 'referralCount',
      key: 'referralCount',
      render: (value: number) => (
        <Typography.Title type='success' level={5}>
          {value}
        </Typography.Title>
      ),
    },
    {
      dataIndex: 'id',
      key: 'see_detail',
      render: (_, record) => (
        <Tooltip title={t('INFODETAIL_TEXT')}>
          <Link
            to={{
              pathname: `${record.account?.isPartner ? PARTNERDETAIL : MOBILEUSERDETAIL}/${record.account?.id}`,
              state: {
                hasRank: new Date().getTime(),
                id: id,
              },
            }}>
            <ArrowRightOutlined />
          </Link>
        </Tooltip>
      ),
    },
  ];

  if (!rankDetailInformation) return loading ? <Spin /> : <Empty />;

  const onGetAward = () => {
    showConfirm({
      title: t('MESSAGE_AWARD_SUCCESS') + rankDetailInformation?.title + ' ?',
      icon: <ExclamationCircleOutlined style={{ fontSize: 30, marginRight: 5 }} />,
      okText: t('COMMON_BUTTON_APPROVE'),
      cancelText: t('COMMON_BUTTON_CLOSE'),
      onOk: async () => {
        if (id) {
          try {
            const res = await RankAPI.POST_AWARD(id);
            if (res.status) {
              message.success(t('AWARD_SUCCESS'));
            }
          } catch (error) {
            message.error(t('AWARD_ERROR'));
          }
        }
      },
    });
  };

  return (
    <Card>
      <ArrowLeftOutlined onClick={() => history.push(PATH.RANK)} style={{ fontSize: 20 }} />
      <PageHeaderCustom
        name={rankDetailInformation?.title}
        extra={
          <Button onClick={onGetAward} type='primary' disabled={isDisableReward}>
            {rankDetailInformation.status === REFERRAL_RANKING_STATUS.AWARDED ? t('AWARDED_TEXT') : t('MENU_REWARD')}
          </Button>
        }>
        <Descriptions column={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} layout={isXs ? 'vertical' : 'horizontal'}>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TIME_START')}>
            {parseTime(rankDetailInformation?.timeStart, DATE_TIME_SLASH_SHORT)}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('TIME_END')}>
            {parseTime(rankDetailInformation?.timeEnd, DATE_TIME_SLASH_SHORT)}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('PRIZE_POOL')}>
            {`${rankDetailInformation?.totalPrize} ${rankDetailInformation?.currency.code}`}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label={t('DESCRIPTON_TEXT')}>
            {rankDetailInformation?.description}
          </Descriptions.Item>
        </Descriptions>
      </PageHeaderCustom>
      <Tabs tabBarGutter={5} type='card'>
        <Tabs.TabPane tab={t('CHART')} key='RANK'>
          <br />
          <Table
            showSorterTooltip={false}
            sortDirections={['descend']}
            dataSource={accounts}
            columns={columns}
            scroll={{ x: 700 }}
            rowKey='rank'
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
