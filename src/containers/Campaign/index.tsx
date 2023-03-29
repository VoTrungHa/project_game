/* eslint-disable react/display-name */
import { MenuOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { CampaignAPI } from 'apis/campaign';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Textlink } from 'components/Textlink';
import { UploadImage } from 'components/UploadImage';
import { PATH } from 'constants/paths';
import {
  formatMoment,
  FORMAT_MOMENT,
  parseArrayToStringWithComma,
  parseObjectToParam,
  parseParamToObject,
  parseStringWithCommaToObject,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getCampaignList, getCategoryMasterList } from './duck/thunks';

const { DATE_TIME_SLASH_LONG } = FORMAT_MOMENT;
interface IModalState {
  type: 'Info' | 'Add' | 'Update';
  data?: ICampaignDetail | IAddCampaignRequest | IUpdateCampaignRequest;
  isOpen: boolean;
}

interface ITabState {
  key: string;
  type: 'Add' | 'Update';
  campaignId?: string;
  campaignCategoryId?: number;
}

const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, onMoveRow, className, style, ...restProps }) => {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: any) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      onMoveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const Index: React.FC = () => {
  const { t } = useTranslation();
  const inputSearchRef = useRef<Input | null>(null);
  const isMd = useBreakpoint().md;
  const history = useHistory();
  const location = useLocation();
  const params: IListCampaignRequest = parseParamToObject(location.search);
  const [paramSearch, setParamSearch] = useState(params);
  const [activeCategoryMasterItem, setActiveCategoryMasterItem] = useState(
    params.categoryId ? parseStringWithCommaToObject(params.categoryId) : {},
  );
  const dispatch = useAppDispatch();
  const { categorymaster, campaign } = useAppSelector((state) => state);
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [tabState, setTabState] = useState<ITabState>({ key: '1', type: 'Add' });
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formCampaignCategory] = Form.useForm();
  const { data: categorymasterlist } = categorymaster;
  const { data: campaignlist, loading } = campaign;
  const [dataSource, setDataSource] = useState<Array<ICampaign>>(campaignlist);

  useDidMount(() => {
    dispatch(getCategoryMasterList());
  });

  useEffect(() => {
    setDataSource(campaignlist);
  }, [campaignlist]);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState]);

  useEffect(() => {
    dispatch(getCampaignList(paramSearch));
    history.push({ pathname: PATH.CAMPAIGN, search: parseObjectToParam(paramSearch) });
  }, [dispatch, history, paramSearch]);

  useEffect(() => {
    const ids = Object.keys(activeCategoryMasterItem).filter((key) => activeCategoryMasterItem[key]);
    const categoryId = parseArrayToStringWithComma(ids) || undefined;
    setParamSearch((prev) => ({
      ...prev,
      categoryId,
    }));
  }, [activeCategoryMasterItem]);

  useEffect(() => {
    if (modalState && modalState.data && tabState.campaignCategoryId) {
      const ele = (modalState.data as ICampaignDetail).campaignCategories.find(
        ({ id }) => id === tabState.campaignCategoryId,
      );
      if (ele) {
        formCampaignCategory.setFieldsValue({ name: ele.name, cashbackRate: ele.cashbackRate });
      }
    }
  }, [formCampaignCategory, modalState, tabState]);

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setActiveCategoryMasterItem({});
    setParamSearch({});
    history.push(PATH.CAMPAIGN);
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

  const onCloseModal = () => setModalState(undefined);

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Update') {
      formEdit.submit();
    }
  }, [modalState, formAdd, formEdit]);

  const onChangeTab = useCallback(
    ({ key, type, campaignCategoryId, campaignId }: ITabState) => {
      if (key === '1') {
        formCampaignCategory.resetFields();
      }
      setTabState({
        key,
        type,
        campaignId,
        campaignCategoryId,
      });
    },
    [formCampaignCategory],
  );

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'Add') {
        try {
          const res = await CampaignAPI.ADD_CAMPAIGN(values);
          if (res) {
            dispatch(getCampaignList(paramSearch));
          }
        } catch (error) {
          message.error(t('COMMON_ADD_CAMPAIGN_ERROR'));
        }
      }
      if (modalState.type === 'Update') {
        try {
          const res = await CampaignAPI.UPDATE_CAMPAIGN({
            ...values,
            id: (modalState.data as IUpdateCampaignRequest).id,
          });
          if (res) {
            dispatch(getCampaignList(paramSearch));
          }
        } catch (error) {
          message.error(t('COMMON_UPDATE_CAMPAIGN_ERROR'));
        }
      }
      setModalState(undefined);
    },
    [dispatch, modalState, paramSearch, t],
  );

  const onUpdateCampaign = useCallback(async (id: string) => {
    setModalState({
      isOpen: true,
      type: 'Update',
      data: undefined,
    });
    try {
      const res = await CampaignAPI.GET_CAMPAIGN_DETAIL_BY_ID(id);
      setModalState((prev) => ({
        ...prev!,
        data: {
          ...res,
          categoryId: res.categoryMaster?.id,
        } as IUpdateCampaignRequest,
      }));
    } catch (error) {
      // TODO: handle later if needed
    }
  }, []);

  const onViewCampaignDetail = useCallback(async (id: string) => {
    setModalState({
      isOpen: true,
      type: 'Info',
      data: undefined,
    });
    try {
      const res = await CampaignAPI.GET_CAMPAIGN_DETAIL_BY_ID(id);
      setModalState((prev) => ({
        ...prev!,
        data: res,
      }));
    } catch (error) {
      // TODO: handle later if needed
    }
  }, []);

  const onFinishFormInTab = useCallback(
    async (values) => {
      if (tabState.type === 'Add') {
        try {
          const res = await CampaignAPI.ADD_CAMPAIGN_CATEGORY({
            ...values,
            campaignId: tabState.campaignId,
          });
          if (res.id) {
            onViewCampaignDetail(tabState.campaignId as string);
            onChangeTab({ ...tabState, key: '1', type: 'Add' });
          }
        } catch (error) {}
      }
      if (tabState.type === 'Update') {
        try {
          const res = await CampaignAPI.UPDATE_CAMPAIGN_CATEGORY({
            ...values,
            id: tabState.campaignCategoryId,
          });
          if (res.id) {
            onViewCampaignDetail(tabState.campaignId as string);
            onChangeTab({ ...tabState, key: '1', type: 'Add', campaignCategoryId: undefined });
          }
        } catch (error) {}
      }
    },
    [onChangeTab, onViewCampaignDetail, tabState],
  );

  const onDeleteCampaign = useCallback(
    async (idCampaign: string) => {
      try {
        const res = await CampaignAPI.DELETE_CAMPAIGN_BY_ID(idCampaign);
        if (res.status) {
          dispatch(getCampaignList(paramSearch));
          setModalState(undefined);
        }
      } catch (error) {
        message.error(t('COMMON_DELETE_CAMPAIGN_ERROR'));
      }
    },
    [dispatch, paramSearch, t],
  );

  const onMoveRow = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === hoverIndex) return;
      const dragRow: ICampaign = dataSource[dragIndex];
      const temp = dataSource.map((item) => ({ id: item.id }));
      temp.splice(dragIndex, 1);
      temp.splice(hoverIndex, 0, dragRow);
      const arr = temp.map((item, idx) => CampaignAPI.UPDATE_CAMPAIGN({ id: item.id, position: idx }));
      try {
        await Promise.all(arr);
        dispatch(getCampaignList(paramSearch));
      } catch (error) {
        message.error(t('UPDATE_POSITION_ERROR'));
      }
    },
    [dataSource, dispatch, paramSearch, t],
  );

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
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
      title: t('TITLE_TEXT'),
      dataIndex: 'title',
      key: 'title',
      render: (value: string, record: ICampaign) => (
        <Textlink text={value} onClick={() => onUpdateCampaign(record.id)} />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
    },
    {
      title: t('PHONE_TEXT'),
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: t('CREATED_AT_TEXT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatMoment(value, DATE_TIME_SLASH_LONG),
    },
    {
      key: 'view',
      render: (_, record: ICampaign) => (
        <Textlink
          text={t('VIEW_TEXT')}
          onClick={() => {
            onChangeTab({ key: '1', type: 'Add', campaignId: record.id });
            onViewCampaignDetail(record.id);
          }}
        />
      ),
    },
  ];

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Info') {
      return (
        <Modal
          centered
          visible={modalState.isOpen}
          onCancel={onCloseModal}
          onOk={onCloseModal}
          okText={t('COMMON_BUTTON_CLOSE')}
          cancelButtonProps={{
            style: {
              display: 'none',
            },
          }}>
          {modalState.data && tabState ? (
            <Tabs
              activeKey={tabState.key}
              onChange={(id) => {
                onChangeTab({ key: id, type: 'Add', campaignId: tabState.campaignId });
              }}>
              <Tabs.TabPane tab={t('INFO_TEXT')} key='1'>
                <Card cover={<img src={modalState.data.banner || ''} />}>
                  <Card.Meta
                    avatar={<Avatar src={modalState.data.logo} />}
                    title={
                      <>
                        {modalState.data.title}
                        <br />
                        {modalState.data.slogan}
                      </>
                    }
                    description={
                      <>
                        {modalState.data.description}
                        <br />
                        {(modalState.data as ICampaignDetail).campaignCategories.map((item) => (
                          <Tag
                            style={{ cursor: 'pointer' }}
                            key={item.id}
                            color='blue'
                            onClick={() =>
                              onChangeTab({
                                ...tabState,
                                key: '2',
                                type: 'Update',
                                campaignCategoryId: item.id,
                              })
                            }>
                            {item.name}: {item.cashbackRate}%
                          </Tag>
                        ))}
                      </>
                    }
                  />
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Cashback' key='2'>
                <Typography.Title level={5} style={{ textAlign: 'center' }}>
                  {tabState.type === 'Update' ? t('UPDATE_CASHBACK_TEXT') : t('ADD_CASHBACK_TEXT')}
                </Typography.Title>
                <Form
                  onFinish={(values) => {
                    onFinishFormInTab(values);
                  }}
                  form={formCampaignCategory}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 24 }}>
                  <Form.Item
                    name='name'
                    label={t('NAME_TEXT')}
                    rules={[{ required: true, message: t('COMMON_NAME_REQUIRED_ERROR') }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='cashbackRate'
                    label={t('RATE_TEXT')}
                    rules={[{ required: true, message: t('COMMON_CASHBACK_REQUIRED_ERROR') }]}>
                    <InputNumber />
                  </Form.Item>
                  <Row>
                    <Col span={24} textAlign='center'>
                      <Form.Item>
                        <Button type='primary' htmlType='submit'>
                          {tabState.type === 'Update' ? t('COMMON_BUTTON_UPDATE') : t('COMMON_BUTTON_ADD')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          ) : (
            '...loading'
          )}
        </Modal>
      );
    }
    if (modalState.type === 'Add') {
      return (
        <Modal
          centered
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('NEW_CAMPAIGN_TEXT')}
          width={1000}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_ADD_NEW_CAMPAIGN')}>
          <Row>
            <Col span={14}>
              <Form onFinish={onFinishForm} form={formAdd} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                <Form.Item
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='banner' label={t('BANNER_TEXT')} style={{ display: 'none' }}>
                  <Input />
                </Form.Item>
                <Form.Item name='logo' label={t('LOGO_TEXT')} style={{ display: 'none' }}>
                  <Input />
                </Form.Item>
                <Form.Item name='slogan' label={t('SLOGAN_TEXT')}>
                  <Input />
                </Form.Item>
                <Form.Item name='description' label={t('DESCRIPTION_TEXT')}>
                  <Input />
                </Form.Item>
                <Form.Item name='contactEmail' label={t('CONTACT_EMAIL_TEXT')}>
                  <Input />
                </Form.Item>
                <Form.Item name='contactPhone' label={t('CONTACT_PHONE_TEXT')}>
                  <InputNumber allowLeadingZeros />
                </Form.Item>
                <Form.Item
                  name='openLink'
                  label='Open link'
                  rules={[{ required: true, message: t('OPEN_LINK_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name='categoryId'
                  label={t('CATEGORY_TEXT')}
                  rules={[{ required: true, message: t('COMMON_CATEGORY_ID_REQUIRED_ERROR') }]}>
                  <Select>
                    {categorymasterlist.map(({ label, value }) => (
                      <Select.Option key={value} value={value}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col span={10}>
              <UploadImage
                src={modalState.data?.logo}
                internalProps={{ isEdit: true, isRect: false }}
                onChangeImage={(url) => {
                  onOpenModal({
                    ...modalState,
                    data: {
                      ...modalState.data!,
                      logo: url,
                    },
                  });
                  formAdd.setFields([
                    {
                      name: 'logo',
                      value: url,
                      errors: [],
                    },
                  ]);
                }}
              />
              <Divider />
              <UploadImage
                src={modalState.data?.banner}
                internalProps={{ isEdit: true, isRect: true }}
                onChangeImage={(url) => {
                  onOpenModal({
                    ...modalState,
                    data: {
                      ...modalState.data!,
                      banner: url,
                    },
                  });
                  formAdd.setFields([
                    {
                      name: 'banner',
                      value: url,
                      errors: [],
                    },
                  ]);
                }}
              />
            </Col>
          </Row>
        </Modal>
      );
    }
    if (modalState.type === 'Update') {
      return (
        <Modal
          centered
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          visible={modalState.isOpen}
          title={t('UPDATE_CAMPAIGN_TEXT')}
          width={1000}
          className='ant-modal-users'
          cancelText={t('COMMON_BUTTON_CLOSE')}
          okText={t('COMMON_UPDATE_CAMPAIGN')}
          footer={[
            <Popconfirm
              key='delete'
              onConfirm={() => onDeleteCampaign((modalState.data as IUpdateCampaignRequest).id)}
              title={t('COMMON_PROMPT_DELETE_CAMPAIGN')}
              okText={t('COMMON_BUTTON_DELETE')}
              cancelText={t('COMMON_BUTTON_CANCEL')}>
              <Button type='primary' danger>
                {t('DELETE_CAMPAIN_BUTTON')}
              </Button>
            </Popconfirm>,
            <div key='cancel-update'>
              <Button key='cancel' onClick={onCloseModal}>
                {t('COMMON_BUTTON_CANCEL')}
              </Button>
              <Button type='primary' key='update' onClick={onSubmitModal}>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </div>,
          ]}>
          {modalState.data ? (
            <Row>
              <Col span={14}>
                <Form onFinish={onFinishForm} form={formEdit} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  <Form.Item
                    name='title'
                    label={t('TITLE_TEXT')}
                    initialValue={modalState.data.title}
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='banner'
                    label={t('BANNER_TEXT')}
                    style={{ display: 'none' }}
                    initialValue={modalState.data.banner}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='logo'
                    label={t('LOGO_TEXT')}
                    style={{ display: 'none' }}
                    initialValue={modalState.data.logo}>
                    <Input />
                  </Form.Item>
                  <Form.Item name='slogan' label={t('SLOGAN_TEXT')} initialValue={modalState.data.slogan}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='description'
                    label={t('DESCRIPTION_TEXT')}
                    initialValue={modalState.data.description}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='contactEmail'
                    label={t('CONTACT_EMAIL_TEXT')}
                    initialValue={modalState.data.contactEmail}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='contactPhone'
                    label={t('CONTACT_PHONE_TEXT')}
                    initialValue={modalState.data.contactPhone}>
                    <InputNumber allowLeadingZeros />
                  </Form.Item>

                  <Form.Item
                    initialValue={(modalState.data as IUpdateCampaignRequest).openLink}
                    name='openLink'
                    label='Open link'
                    rules={[{ required: true, message: t('OPEN_LINK_REQUIRED_ERROR') }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='categoryId'
                    label={t('CATEGORY_TEXT')}
                    initialValue={(modalState.data as IUpdateCampaignRequest).categoryId}
                    rules={[{ required: true, message: t('COMMON_CATEGORY_ID_REQUIRED_ERROR') }]}>
                    <Select>
                      {categorymasterlist.map(({ label, value }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={10}>
                <UploadImage
                  src={modalState.data?.logo}
                  internalProps={{ isEdit: true, isRect: false }}
                  onChangeImage={(url) => {
                    if (!modalState || !modalState.data) return;
                    onOpenModal({
                      ...modalState,
                      data: {
                        ...modalState.data,
                        logo: url,
                      },
                    });
                    formEdit.setFields([
                      {
                        name: 'logo',
                        value: url,
                      },
                    ]);
                  }}
                />
                <Divider />
                <UploadImage
                  src={modalState.data?.banner}
                  internalProps={{ isEdit: true, isRect: true }}
                  onChangeImage={(url) => {
                    if (!modalState || !modalState.data) return;
                    onOpenModal({
                      ...modalState,
                      data: {
                        ...modalState.data,
                        banner: url,
                      },
                    });
                    formEdit.setFields([
                      {
                        name: 'banner',
                        value: url,
                      },
                    ]);
                  }}
                />
              </Col>
            </Row>
          ) : (
            '...loading'
          )}
        </Modal>
      );
    }
  }, [
    categorymasterlist,
    formAdd,
    formCampaignCategory,
    formEdit,
    modalState,
    onChangeTab,
    onDeleteCampaign,
    onFinishForm,
    onFinishFormInTab,
    onSubmitModal,
    t,
    tabState,
  ]);

  return (
    <Card>
      <Row gutter={[5, 5]}>
        <Col xs={24} md={12}>
          <Input.Search
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_TITLE_OR_KEYWORD_TEXT')}
          />
        </Col>
        <Col xs={24} md={12}>
          <Row justify='space-between'>
            <Col>
              <Button disabled={!paramSearch.keyword} onClick={onClearFilter}>
                {t('COMMON_BUTTON_FILTER')}
              </Button>
            </Col>
            <Col>
              <Button type='primary' onClick={() => onOpenModal({ isOpen: true, type: 'Add' })}>
                {t('COMMON_ADD_NEW_CAMPAIGN')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <DndProvider backend={HTML5Backend}>
        <Table
          pagination={false}
          showSorterTooltip={false}
          loading={loading}
          sortDirections={['descend']}
          dataSource={dataSource}
          scroll={{ x: 700 }}
          columns={columns}
          onRow={(_, index) =>
            ({
              index,
              onMoveRow,
            } as any)
          }
          components={{
            body: {
              row: DragableBodyRow,
            },
          }}
          rowKey='id'
        />
      </DndProvider>
      {renderModal}
    </Card>
  );
};

export default Index;
