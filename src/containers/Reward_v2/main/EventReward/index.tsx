/* eslint-disable react/display-name */
import { DownOutlined, LeftOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Progress,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
  Upload,
} from 'antd';

import Modal from 'antd/lib/modal/Modal';
import { UploadFile } from 'antd/lib/upload/interface';
import { rewardApi } from 'apis/reward';
import { SatoshiGameAPI } from 'apis/satoshigame';
import { icBbc } from 'assets/images';
import close from 'assets/images/close.png';
import plus from 'assets/images/plus.png';
import pull from 'assets/images/pull.png';
import sat from 'assets/images/sat.png';
import upload from 'assets/images/upload.png';
import vndc from 'assets/images/vndc.png';
import { Col, Row } from 'components/Container';
import MenuComponent from 'components/Menu';
import { DEFAULT_PAGE_SIZE, REWARD } from 'constants/index';
import { PATH } from 'constants/paths';

// import { getAllEvent } from 'containers/SatoshiGame/duck/thunks';
import { FORMAT_MOMENT, Moment, parseGetUnixTimeValue, parseParamToObject } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getBrokers, getUserByKeyword, getUserRewarded } from '../../duck/thunks';

import '../../index.scss';

interface IModalState {
  type: 'AddUser' | 'Upload' | 'AllReward' | 'Reward';
  data?: ISatoshiGameItem;
  isOpen: boolean;
  from?: number | Moment;
  to?: number | Moment;
}
interface IsValidataSheet {
  line: Number;
  message: String;
}

interface modalSearch {
  keyword?: string;
}

const { DATE_SLASH_LONG } = FORMAT_MOMENT;
const EventReward = () => {
  const inputSearchRef = useRef<Input | null>(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formUpload] = Form.useForm();
  const [formReward] = Form.useForm();

  const [rowkeys, setRowKeys] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isReward, setIsReward] = useState(true);
  const location = useLocation();
  const params = parseParamToObject(location.search);
  const [listUserFromModal, setListUserFromModal] = useState<IUserGiveEvent[]>([]);
  const [userDetail, setUserDetail] = useState<IUserGiveEvent>();
  const [searchOnModal, setSearchOnModal] = useState<modalSearch>({
    keyword: '',
  });
  let { id } = useParams();
  const [paramSearch, setParamSearch] = useState<IParameterRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : undefined,
    to: params.to ? parseGetUnixTimeValue(params.to as string) : undefined,
  });

  const [paramGetUserRewarded, setParamGetUserRewarded] = useState<IParameterRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    keyword: '',
  });
  const [userGiveEvent, setUserGiveEvent] = useState<IUserGiveEvent[]>();
  const dispatch = useAppDispatch();
  const {
    reward: { loading, listUsers, listUserRewarded },
  } = useAppSelector((state) => state);
  const [modalState, setModalState] = useState<IModalState | undefined>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
      formUpload.resetFields();
      formReward.resetFields();
    }
    formAdd.setFieldsValue({
      id: userDetail?.id,
      account: userDetail?.fullName,
      email: userDetail?.email,
      phone: userDetail?.phone,
      rank: userDetail?.rank,
      reward: userDetail?.reward,
      note: userDetail?.note,
    });
  }, [formAdd, formReward, formEdit, formUpload, modalState, userDetail, paramSearch]);

  useEffect(() => {
    dispatch(getUserByKeyword(searchOnModal));
    dispatch(getBrokers());
    dispatch(getUserRewarded(paramGetUserRewarded, id));
  }, [searchOnModal, dispatch, paramGetUserRewarded, userGiveEvent, listUserRewarded]);

  const onChangeModal = useCallback((payload?: IModalState) => setModalState(payload), []);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'AddUser') {
      formAdd.submit();
    }
    if (modalState.type === 'Upload') {
      formUpload.submit();
    }
    if (modalState.type === 'AllReward') {
      formEdit.submit();
    }
    if (modalState.type === 'Reward') {
      formReward.submit();
    }
  }, [formAdd, formEdit, modalState, formUpload, formReward]);
  //cal api

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      if (modalState.type === 'AddUser') {
        const payload = {
          email: userDetail?.email,
          account: userDetail?.fullName,
          id: userDetail?.id,
          phone: userDetail?.phone,
          status: userDetail?.status,
          amount: values.amount,
          rank: values.rank,
          reward: values.reward,
          note: values.note,
        };
        const userSheet: IUserGiveEvent[] = userGiveEvent || [];
        const data: IUserGiveEvent[] = listUserFromModal || [];
        data.push(payload);
        setListUserFromModal(data);
        const newUser: IUserGiveEvent[] = userSheet.concat(listUserFromModal);
        setUserGiveEvent(newUser);
        message.success('Thêm vào danh sách thành công !');
      }
      if (modalState.type === 'Upload') {
        if (!modalState.data) return;
        const totalAmount =
          typeof values.totalAmount === 'number' ? values.totalAmount : values.totalAmount.replaceAll(',', '');
        try {
          const res = await SatoshiGameAPI.UPDATE_EVENT({
            id: modalState.data.id,
            ...values,
            totalAmount,
          });
          if (res.id) {
            message.success(t('UPDATE_EVENT_SUCCESS'));
          }
        } catch (error) {
          message.error(t('UPDATE_EVENT_ERROR'));
        }
        onChangeModal(undefined);
      }
      if (modalState.type === 'Reward') {
        await Promise.all(
          rowkeys.map(async (item, index) => {
            const user = userGiveEvent?.filter((us, indexUs) => us.id === item)[0];
            console.log(user);
            const payload = {
              title: values.title,
              amount: user?.amount,
              ranking: user?.rank,
              eventId: id,
              userId: item,
            };
            await rewardApi
              .REWARD_TO_USER(payload)
              .then((res) => {
                if (res.status) {
                  onChangeModal(undefined);
                  message.success(t('ADD_EVENT_SUCCESS'));
                }
              })
              .catch((error) => {
                message.error(t('ADD_EVENT_STATUS_ERROR'));
              });
          }),
        );
        onChangeModal(undefined);
      }
    },
    [modalState, onChangeModal, rowkeys, id, listUserFromModal, userDetail, userGiveEvent, t],
  );
  const onSelectChange = useCallback(
    (selectedRowKeys) => {
      setRowKeys(selectedRowKeys);
    },
    [setRowKeys],
  );
  const rowSelection = {
    rowkeys,
    onChange: onSelectChange,
  };

  const onChangeTable = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current || 1,
      }));
    }
  }, []);

  const onChangeDatePicker = useCallback((value: any) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : undefined,
      to: value ? parseGetUnixTimeValue(value[1]) : undefined,
    }));
  }, []);

  const validate = (sheet: any) => {
    const arr: IsValidataSheet[] = [];
    sheet.map((item, index) => {
      var colName = '';
      REWARD.map((col, colIndex) => {
        if (!Object.keys(item).includes(col)) {
          colName += col + ', ';
        }
      });
      if (colName !== '') {
        arr.push({ line: index + 2, message: `${colName.slice(0, colName.length - 2)} không được bỏ trống!` });
      }
    });
    if (arr.length >= 1) {
      arr.map((item, index) => {
        message.error(`Dòng ${item.line}: ${item.message}`);
      });
    }
    return arr.length > 0 ? false : true;
  };
  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setSearchOnModal({});
    history.push(PATH.EVENTID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const SearchUserOnModal = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (keyword) {
        setSearchOnModal((prev) => ({
          ...prev,
          keyword,
        }));
      } else {
        onClearFilter();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClearFilter],
  );
  const uploadProps = useMemo(
    () => ({
      beforeUpload: (file) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
          const data = reader.result;
          const wb = XLSX.read(data, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const sheets: IUserGiveEvent[] = XLSX.utils.sheet_to_json(ws);
          if (validate(sheets)) {
            let progress = (e.loaded / e.total) * 100;
            setProgress(progress);
            if (progress === 100) {
              message.success(`${file.name} file uploaded successfully.`);
              const userEvent: IUserGiveEvent[] = [];
              await Promise.all(
                sheets.map(async (item: IUserGiveEvent, index) => {
                  const payload = {
                    keyword: item.phone,
                  };
                  await rewardApi
                    .GET_USER_BY_KEYWORD(payload)
                    .then(async (res) => {
                      await res.data?.map((us, index) => {
                        const user = {
                          ...us,
                          account: item.account,
                          eventId: item.eventId,
                          rank: item.rank,
                          note: item.note,
                          phone: item.phone,
                          reward: item.reward,
                          amount: item.amount,
                        };
                        userEvent.push(user);
                      });
                    })
                    .catch((error) => {
                      message.error(t('ADD_EVENT_STATUS_ERROR'));
                    });
                }),
              );
              console.log(userEvent);
              const userFromModal: IUserGiveEvent[] = listUserFromModal || [];
              const newUser: IUserGiveEvent[] = userFromModal.concat(userEvent);
              setUserGiveEvent(newUser);
              onChangeModal(undefined);
              setFileList((state) => [...state, file]);
            }
          }
        };

        return false;
      },

      onRemove: (file: UploadFile) => {
        if (fileList.some((item) => item.uid === file.uid)) {
          setFileList((fileList) => fileList.filter((item) => item.uid !== file.uid));
          return true;
        }
        return false;
      },
    }),
    [fileList, onChangeModal, listUserFromModal, t],
  );
  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'AddUser') {
      return (
        <Modal
          okText='Thêm'
          onOk={onSubmitModal}
          width={718}
          className='personal-reward add-user'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          title='Thêm user'
          onCancel={() => onChangeModal(undefined)}>
          <div className='card-user ps-r'>
            <Row gutter={[24, 0]}>
              <Col span={12}>
                <div className='modal-add-user-search mb-32'>
                  <div className='ps-r w-100'>
                    <Input.Search
                      ref={inputSearchRef}
                      className='icon-search form-search-envetReward'
                      defaultValue={searchOnModal.keyword}
                      onSearch={SearchUserOnModal}
                      placeholder={t('SEARCH_BY_KEYWORD_TEXT')}
                      allowClear
                    />
                  </div>
                </div>
                <Row gutter={8}>
                  <Col span={24} className='mb-8'>
                    <Typography>Danh sách thêm</Typography>
                  </Col>

                  <Col span={24}>
                    <div className='sub-card'>
                      {listUsers &&
                        listUsers?.data.map((item, index) => (
                          <div className='user-item cursor mb-8' onClick={() => setUserDetail(item)} key={index}>
                            <Typography.Text>{item.fullName}</Typography.Text>

                            <Avatar
                              shape='square'
                              src={close}
                              alt='ic-partner'
                              style={{ width: '18px', height: '18px', marginRight: '7px' }}
                            />
                          </div>
                        ))}
                    </div>
                  </Col>
                </Row>
              </Col>
              <div className='flash'></div>
              <Col span={12}>
                <Typography className='headline-04 mb-16'>Thông tin</Typography>
                <Form
                  onFinish={onFinishForm}
                  form={formAdd}
                  layout='vertical'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}>
                  <Form.Item
                    name='account'
                    label='Tài khoản'
                    rules={[{ required: true, message: t('EVENTREWAR_NAME_REQUIRED_ERROR') }]}>
                    <Input placeholder='Nguyễn Văn A' />
                  </Form.Item>
                  <Form.Item
                    name='email'
                    label='Email'
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input placeholder='nguyenvanan@gmail.com' />
                  </Form.Item>
                  <Form.Item
                    name='phone'
                    label='Số điện thoại'
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input placeholder='03689161949' />
                  </Form.Item>
                  <Form.Item
                    name='rank'
                    label='Hạng'
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input placeholder='Vd: Nhận thưởng 500 BBC từ BitArcade' />
                  </Form.Item>
                  <Form.Item
                    name='amount'
                    label='Phần thưởng'
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input className='BBC' placeholder='BBC' />
                  </Form.Item>
                  <Form.Item
                    name='note'
                    label='Ghi chứ'
                    rules={[{ required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                    <Input placeholder='VD: nghi vấn hack' />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal>
      );
    }
    if (modalState.type === 'Upload') {
      return (
        <Modal
          okText={t('UPLOAD_REAWRDS')}
          onOk={onSubmitModal}
          width={343}
          className='create-reward personal-reward'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          title={t('ALL_REWARD')}
          onCancel={() => onChangeModal(undefined)}>
          <Form
            onFinish={onFinishForm}
            form={formAdd}
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <Row justify='center' align='middle'>
              <Col span={24}>
                <Upload.Dragger multiple {...uploadProps} fileList={fileList} accept='.csv, .xls, .xlsx'>
                  <p className='upload-drag-icon'>
                    <Avatar shape='square' src={upload} alt='ic-partner' style={{ width: '40px', height: '40px' }} />
                  </p>
                  <Typography.Text className='ant-upload-text'>
                    Kéo thả tệp *CSV tại đây <br /> hoặc bấm{' '}
                    <Typography.Link className='upload-drap-link'>Tải lên</Typography.Link>
                  </Typography.Text>
                  <div className='reward-drap-progress'>
                    <Progress
                      strokeColor={{
                        from: '#108ee9',
                        to: '#87d068',
                      }}
                      percent={progress}
                      status='active'
                    />
                  </div>
                </Upload.Dragger>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'AllReward') {
      return (
        <Modal
          okText={t('SEND')}
          onOk={onSubmitModal}
          width={343}
          className='create-reward personal-reward'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          title={t('REWARDS')}
          onCancel={() => onChangeModal(undefined)}>
          <Form
            onFinish={onFinishForm}
            form={formAdd}
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <Form.Item name='title' label='Tiêu đề' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input placeholder='Phần thưởng BitArcade' />
            </Form.Item>
            <Form.Item
              name='contentForm'
              label={t('CONTENT_INFORM')}
              rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input placeholder='Nhận thưởng 500 BBC từ BitArcade' />
            </Form.Item>
            <Row gutter={[10, 1]} justify='space-between'>
              <Typography.Text className='ant-form-item-label ml-5'>{t('REWARD_QUANITY_OR_MANUAl')}</Typography.Text>
              <Col span={14}>
                <Form.Item name='reward' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
                  <Input placeholder='{tablevalue}' />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name='status' initialValue={1}>
                  <Select>
                    <Select.Option value={1}>{t('LIST')}</Select.Option>
                    <Select.Option value={2}>{t('INACTIVE_TEXT')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name='status' label={t('TYPE_TOKEN_REWARD')} initialValue={1}>
              <Select>
                <Select.Option value={1}>
                  <Avatar
                    shape='square'
                    src={icBbc}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  BBC
                </Select.Option>
                <Select.Option value={2}>
                  <Avatar
                    shape='square'
                    src={sat}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  SAT
                </Select.Option>
                <Select.Option value={3}>
                  <Avatar
                    shape='square'
                    src={vndc}
                    alt='ic-partner'
                    style={{ width: '24px', height: '24px', marginRight: '7px' }}
                  />
                  VNDC
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
    if (modalState.type === 'Reward') {
      return (
        <Modal
          okText={t('SEND')}
          onOk={onSubmitModal}
          width={343}
          className='create-reward personal-reward'
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          visible={modalState.isOpen}
          title='Trao thưởng danh sách'
          onCancel={() => onChangeModal(undefined)}>
          <Form
            onFinish={onFinishForm}
            form={formReward}
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <Form.Item name='title' label='Tiêu đề' rules={[{ message: t('COMMON_TITLE_REQUIRED_ERROR') }]}>
              <Input placeholder='Phần thưởng BitArcade' />
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }, [
    formAdd,
    listUsers,
    modalState,
    onChangeModal,
    onFinishForm,
    formReward,
    onSubmitModal,
    searchOnModal,
    SearchUserOnModal,
    uploadProps,
    progress,
    fileList,
    t,
  ]);

  const columns = [
    {
      title: <Typography.Text className='text-content03'>ID</Typography.Text>,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
      render: (value: string) => (
        <Typography.Text
          className='text-content01'
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
      title: <Typography.Text className='text-content03'>{t('ACCOUNT_TEXT')}</Typography.Text>,
      dataIndex: 'account',
      key: 'account',
      width: 100,
      render: (value: string, record: ISatoshiGameItem) => (
        <Typography.Text className='text-content01'>{value}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text className='text-content03'>{t('Email')}</Typography.Text>,
      dataIndex: 'email',
      key: 'email',
      width: 120,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: <Typography.Text className='text-content03'>{t('PHONE_TEXT')}</Typography.Text>,
      dataIndex: 'phone',
      key: 'phone',
      width: 90,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: (
        <div className='text-content03 cursor'>
          <MenuComponent
            menu={[
              {
                name: 'Tất cả',
              },
              {
                name: 'Đã KYC',
              },
              {
                name: 'Chưa KYC',
              },
            ]}
            title={t('STATUS_TEXT')}
            icon={<DownOutlined className='icon_size' />}
            onChangeStatus={onChangeDatePicker}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: <Typography.Text className='text-content03'>Hạng</Typography.Text>,
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: <Typography.Text className='text-content03'>Phần thưởng</Typography.Text>,
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
      render: (value: string) => <Typography.Text className='text-content01'>{value}</Typography.Text>,
    },
    {
      title: <Typography.Text className='text-content03'>Ghi chú</Typography.Text>,
      dataIndex: 'note',
      key: 'note',
      width: 80,
      render: (value: string) => <Typography.Text className='text-content03'>{value}</Typography.Text>,
    },
    {
      title: (
        <div className='text-content03 cursor'>
          <MenuComponent
            menu={[
              {
                name: 'Tất cả',
              },
              {
                name: 'Đã trao thưởng',
              },
              {
                name: 'Chưa trao thưởng',
              },
            ]}
            title={t('STATUS_REWARD')}
            icon={<DownOutlined className='icon_size' />}
            onChangeStatus={onChangeDatePicker}
          />
        </div>
      ),

      dataIndex: 'totalPaid',
      key: 'rewards',
      width: 110,
      render: (value: string) => <Typography.Text className='text-content03'>Chưa trao thưởng</Typography.Text>,
    },
  ];
  console.log(userGiveEvent);
  return (
    <>
      <Row className='mb-32 mt-20'>
        <Typography.Text className='headline-07'>{t('MENU_REWARD')}</Typography.Text>
      </Row>
      <Row justify='space-between' className='mb-16 ' align='middle' gutter={[1, 1]}>
        <Col className='eR-label mb-16 cursor' onClick={() => history.push(PATH.REWARD)}>
          <LeftOutlined style={{ fontSize: '18px' }} />
          <Typography.Text className='headline-04'>
            Nhiệm vụ like bài viết Fanpage
            <Typography.Text style={{ color: isReward ? '00cc88' : '#FEA900' }}>
              {isReward ? ' - Đang trao thưởng' : ' - Chưa trao thương'}
            </Typography.Text>
          </Typography.Text>
        </Col>
        <Col>
          <SettingOutlined style={{ fontSize: '20px' }} />
        </Col>
      </Row>

      <Row justify='space-between' className='reward-body' gutter={[10, 8]}>
        <Col span={8}>
          <Input.Search
            className='icon-search form-search-envetReward'
            ref={inputSearchRef}
            defaultValue={paramSearch.keyword}
            // onSearch={onSearchInput}
            placeholder={t('SEARCH_BY_KEYWORD_TEXT')}
            allowClear
          />
        </Col>
        <Col span={16} className='ps-r'>
          <Row gutter={[15, 5]} justify='end'>
            <Col>
              <Button
                style={{ opacity: isReward === null ? '0.5' : '1' }}
                className='btn_event br-4 bg-gray'
                onClick={() => (isReward === null ? null : onChangeModal({ isOpen: true, type: 'AddUser' }))}>
                <Avatar
                  shape='square'
                  src={plus}
                  alt='ic-partner'
                  style={{ width: '18px', height: '18px', marginRight: '7px', color: '#00CC88', marginBottom: '4px' }}
                />
                <Typography.Text className='btn_event_link'>Thêm user</Typography.Text>
              </Button>
            </Col>
            <Col>
              <Button
                style={{ opacity: isReward === null ? '0.5' : '1' }}
                className='btn_event br-4 bg-gray'
                onClick={() => (isReward === null ? null : onChangeModal({ isOpen: true, type: 'Upload' }))}>
                <Avatar
                  shape='square'
                  src={pull}
                  alt='ic-partner'
                  style={{ width: '24px', height: '18px', marginRight: '7px', color: '#00CC88', marginBottom: '4px' }}
                />
                <Typography.Text className='btn_event_link'>Nhập danh sách</Typography.Text>
              </Button>
            </Col>

            <Col>
              <Button
                style={{ opacity: isReward ? '1' : '0.5' }}
                className='btn_event br-4 bg-pink'
                onClick={() => (isReward ? onChangeModal({ isOpen: true, type: 'Reward' }) : null)}>
                <Typography.Text className='btn_event_link'>Trao thưởng</Typography.Text>
              </Button>
            </Col>
            <Col>
              <Button
                style={{ opacity: isReward ? '1' : '0.5' }}
                className='btn_event br-4 bg-lightGreen'
                onClick={() => (isReward ? onChangeModal({ isOpen: true, type: 'Reward' }) : null)}>
                <Typography.Text className='btn_event_link'>Hoàn tất trao thưởng</Typography.Text>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className='mod-table'>
        <Table
          pagination={{
            total: userGiveEvent?.length,
            pageSize: DEFAULT_PAGE_SIZE,
            current: Number(paramSearch.page) || 1,
          }}
          showSorterTooltip={false}
          sortDirections={['descend']}
          onChange={onChangeTable}
          dataSource={userGiveEvent}
          rowSelection={rowSelection}
          loading={loading}
          columns={[...columns] as any}
          scroll={{ x: 1300 }}
          rowKey='id'
        />
      </div>
      {renderModal}
    </>
  );
};

export default EventReward;
