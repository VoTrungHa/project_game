/* eslint-disable react/display-name */
import { ArrowLeftOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Pagination, Select, Statistic, Table, Tabs, Typography } from 'antd';
import { CardCampaign } from 'components/CardCampaign';
import { Col, Row } from 'components/Container';
import { DEFAULT_PAGE_SIZE, STATUS, STATUS_CASHBACK } from 'constants/index';
import { FORMAT_MOMENT } from 'helpers/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
const { ACTIVE, INACTIVE } = STATUS;

const { DD_MM_YYYY, DATE_SLASH_LONG } = FORMAT_MOMENT;
const { Option } = Select;

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const paramSearch = {};

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'Id',
      key: 'Id',
      width: 50,
      render: (value: string) => (
        <Typography.Text
          style={{ cursor: 'pointer', width: '120px' }}
          ellipsis={{
            tooltip: value,
          }}>
          001
        </Typography.Text>
      ),
    },

    {
      title: 'Tên chiến dịch',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (value: string) => (
        <>
          <Typography.Title level={5}>Mở tài khoản ngân hàng Techcombank</Typography.Title>
        </>
      ),
    },
    {
      title: 'Phần thưởng',
      dataIndex: 'reward',
      key: 'reward',
      width: 150,
      render: (value: string) => (
        <>
          <Typography.Title level={5}>10,000 VNDC</Typography.Title>
        </>
      ),
    },
    {
      title: t('COMMISSION_TEXT'),
      dataIndex: 'commission',
      key: 'commission',
      width: 150,
      render: (value: string) => (
        <>
          <Typography.Title level={5}>20,000 VND</Typography.Title>
        </>
      ),
    },
    {
      title: 'Số lượng tham gia',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (value: string) => (
        <>
          <Typography.Title level={5}>10,000</Typography.Title>
        </>
      ),
    },
    {
      title: t('STATUS_TEXT'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <>
          {Number(status) === STATUS_CASHBACK.SUCCESS && (
            <Typography.Text type='success'>{t('SUCCESS_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_CASHBACK.FAILURE && (
            <Typography.Text type='danger'>{t('FAILURE_TEXT')}</Typography.Text>
          )}
          {Number(status) === STATUS_CASHBACK.PROCESSING && (
            <Typography.Text type='warning'>{t('PROCESSING_TEXT')}</Typography.Text>
          )}
        </>
      ),
    },
    {
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (_) => (
        <Button>
          <ToolOutlined />
          {t('CUSTOM_TEXT')}
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <ArrowLeftOutlined style={{ fontSize: 20 }} />
      <Tabs tabBarGutter={5} type='card'>
        <Tabs.TabPane tab={t('STATISTIC_TEXT')} key='STATISTIC'>
          <Row gutter={[12, 12]}>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Input.Search placeholder={t('COMMON_BUTTON_SEARCH')} allowClear />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Select style={{ width: '100%' }} placeholder='Xếp theo thứ tự A-Z'>
                  <Option value={1}>Xếp theo thứ tự A-Z</Option>
                  <Option value={2}>Xếp theo thứ tự Z-A</Option>
                  <Option value={3}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Select style={{ width: '100%' }} placeholder='Mua sắm - Làm đẹp'>
                  <Option value={STATUS.ALL}>{t('ALL_TEXT')}</Option>
                  <Option value={ACTIVE}>{t('ACTIVE')}</Option>
                  <Option value={INACTIVE}>{t('INACTIVE')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Select style={{ width: '100%' }} placeholder='Tất cả'>
                  <Option value={STATUS.ALL}>{t('ALL_TEXT')}</Option>
                  <Option value={ACTIVE}>{t('ACTIVE')}</Option>
                  <Option value={INACTIVE}>{t('INACTIVE')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xxl={6} xl={12} xs={24}>
              <Card style={{ height: '100%' }}>
                <Statistic title={t('TOTAL_ACCOUNT')} value={1000} />
              </Card>
            </Col>
            <Col xxl={6} xl={12} xs={24}>
              <Card style={{ height: '100%' }}>
                <Statistic title={t('TOTAL_ACCOUNT')} value={1000} />
              </Card>
            </Col>
            <Col xxl={6} xl={12} xs={24}>
              <Card style={{ height: '100%' }}>
                <Statistic title={t('TOTAL_ACCOUNT')} value={1000} />
              </Card>
            </Col>
            <Col xxl={6} xl={12} xs={24}>
              <Card style={{ height: '100%' }}>
                <Statistic title={t('TOTAL_ACCOUNT')} value={1000} />
              </Card>
            </Col>
          </Row>
          <Table
            pagination={{
              total: 1,
              pageSize: DEFAULT_PAGE_SIZE,
              current: 1,
              showSizeChanger: false,
            }}
            dataSource={[
              {
                Id: '0001',
                title: 'Mở tài khoản ngân hoàng Techcombank',
                reward: '10,000 VNDC',
                commission: '20,000VND',
                amount: '10,000',
                status: 1,
              },
              {
                Id: '0001',
                title: 'Mở tài khoản ngân hoàng Techcombank',
                reward: '10,000 VNDC',
                commission: '20,000VND',
                amount: '10,000',
                status: 1,
              },
              {
                Id: '0001',
                title: 'Mở tài khoản ngân hoàng Techcombank',
                reward: '10,000 VNDC',
                commission: '20,000VND',
                amount: '10,000',
                status: 1,
              },
              {
                Id: '0001',
                title: 'Mở tài khoản ngân hoàng Techcombank',
                reward: '10,000 VNDC',
                commission: '20,000VND',
                amount: '10,000',
                status: 1,
              },
              {
                Id: '0001',
                title: 'Mở tài khoản ngân hoàng Techcombank',
                reward: '10,000 VNDC',
                commission: '20,000VND',
                amount: '10,000',
                status: 1,
              },
            ]}
            columns={columns}
            scroll={{ x: 700 }}
            rowKey='createdAt'
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('CUSTOM_TEXT')} key='CUSTOM'>
          <Row gutter={[12, 12]}>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Input.Search placeholder={t('COMMON_BUTTON_SEARCH')} allowClear />
              </Form.Item>
            </Col>
            <Col xxl={{ span: 6, offset: 6 }} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Select style={{ width: '100%' }} placeholder='Xếp theo thứ tự A-Z'>
                  <Option value={1}>Xếp theo thứ tự A-Z</Option>
                  <Option value={2}>Xếp theo thứ tự Z-A</Option>
                  <Option value={3}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={6} xl={24} lg={24} md={24} xs={24}>
              <Form.Item>
                <Select style={{ width: '100%' }} placeholder='Mua sắm - Làm đẹp'>
                  <Option value='1'>Tất cả</Option>
                  <Select.OptGroup label='Mua sắm'>
                    <Option value='2'>Sức khỏe và làm đẹp</Option>
                    <Option value='3'>Sàn thương mại điện tử</Option>
                    <Option value='4'>Thời trang</Option>
                  </Select.OptGroup>
                  <Select.OptGroup label='Mở tài khoản'>
                    <Option value='5'>Ngân hàng</Option>
                    <Option value='6'>Ví điện tử</Option>
                  </Select.OptGroup>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
            <Col xxl={8} xl={12} md={12} xs={24}>
              <CardCampaign id='1' title='Mở tài khoản ngân hàng Techcombank' currency='VNĐ' amount='10,000' />
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              <Pagination defaultCurrent={1} total={50} />
            </Col>
          </Row>
          <br />
          <Row justify='end'>
            <Col>
              <Button type='primary'>{t('UPDATE')}</Button>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
