import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Avatar, Form,
  Input, Modal,
  Select
} from 'antd';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Link } from 'components/Link';
import { Status } from 'components/Status';
import {
  STATUS
} from 'constants/index';
import { PATH } from 'constants/paths';
import { ROLE_TYPE } from 'constants/role';
import { isEditable } from 'helpers/common';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const { PARTNERDETAIL, MOBILEUSERDETAIL } = PATH
const { MANAGER, EDITOR } = ROLE_TYPE
const { ACTIVE, INACTIVE } = STATUS
const { Option } = Select

type IModalState = {
  type: 'Edit';
  isOpen: boolean;
  data?: IMobileUserDetailResponse | IAccount;
}

interface AccountModalProps {
  modalState: IModalState | undefined
  onCloseModal: () => void
  onChangeSelect: (value: number) => void
  onChangeInput: (value: string) => void
  paramSearch: IAccountRequest
  onFinishForm: (value: any) => void
}

const AccountModal: React.FC<AccountModalProps> = ({ modalState, onCloseModal, onChangeSelect, onChangeInput, paramSearch, onFinishForm }) => {
  const { t } = useTranslation();
  const [formEdit] = Form.useForm();

  const {
    account: { list },
    auth: { user }
  } = useAppSelector((state) => state);

  const isUpdatingStatus = useMemo(() => {
    if (modalState && modalState.data && list) {
      const ele = list.data.find((item) => item.id === modalState.data?.id);
      if (ele) {
        return ele.status !== modalState.data.status;
      }
    }
  }, [list, modalState]);

  const isUpdatingPhone = useMemo(() => {
    if (modalState && modalState.data && list) {
      const ele = list.data.find((item) => item.id === modalState.data?.id);
      if (!ele) return false;
      if (ele.phone) {
        return ele.phone.substr(1) !== modalState.data.phone;
      }
      return Boolean(ele.phone) !== Boolean(modalState.data.phone);
    }
  }, [list, modalState]);

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [formEdit, modalState]);

  const renderModal = useMemo(() => {
    if (!modalState) return null;
    if (modalState.type === 'Edit') {
      const isEditPhone = isEditable([MANAGER, EDITOR], user?.role);
      return (
        <Modal
          title={t('EDIT_TEXT')}
          onCancel={onCloseModal}
          onOk={onSubmitModal}
          centered
          visible={modalState.isOpen}
          okText={t('COMMON_BUTTON_UPDATE')}
          cancelButtonProps={{
            style: {
              display: 'none',
            },
          }}
          okButtonProps={{
            disabled: !isUpdatingStatus && !isUpdatingPhone,
          }}
          width={1000}>
          {modalState.data ? (
            <Row>
              <Col span={14}>
                <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  <Form.Item name='fullName' label={t('FULL_NAME_TEXT')} initialValue={modalState.data.fullName}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item name='email' label='Email' initialValue={modalState.data.email}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    name='phone'
                    label={t('PHONE_TEXT')}
                    rules={
                      isEditPhone
                        ? [
                          {
                            min: 10,
                            message: t('COMMON_PHONE_LENGTH_ERROR'),
                          },
                        ]
                        : undefined
                    }
                    initialValue={modalState.data.phone}>
                    {isEditPhone ? (
                      <InputNumber maxLength={11} allowLeadingZeros onChange={(e) => onChangeInput(e.target.value)} />
                    ) : (
                      <InputNumber readOnly />
                    )}
                  </Form.Item>
                  <Form.Item name='avatar' label={t('AVATAR_TEXT')} initialValue={modalState.data.avatar}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item name='status' label={t('STATUS_TEXT')} initialValue={modalState.data.status}>
                    <Select onSelect={onChangeSelect}>
                      <Option value={ACTIVE}>
                        <Status active /> {t('ACTIVE_TEXT')}
                      </Option>
                      <Option value={INACTIVE}>
                        <Status /> {t('INACTIVE_TEXT')}
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    style={{ visibility: isUpdatingStatus || isUpdatingPhone ? 'visible' : 'hidden' }}
                    name='reason'
                    label={t('REASON_TEXT')}
                    rules={
                      isUpdatingStatus || isUpdatingPhone
                        ? [{ required: true, message: t('COMMON_REASON_REQUIRED_ERROR') }]
                        : undefined
                    }>
                    <Input />
                  </Form.Item>
                </Form>
                <Link
                  style={{ marginRight: 5 }}
                  to={`${modalState.data.isPartner ? PARTNERDETAIL : MOBILEUSERDETAIL}/${modalState.data.id}`}
                  state={paramSearch}>
                  {t('INFODETAIL_TEXT')} <ArrowRightOutlined />
                </Link>
              </Col>
              <Col span={10} textAlign='center'>
                <Avatar size={250} src={modalState.data.avatar} />
              </Col>
            </Row>
          ) : (
            '...loading'
          )}
        </Modal>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState, user, t, onSubmitModal, isUpdatingStatus, isUpdatingPhone, formEdit, onFinishForm, paramSearch]);

  return (
    <>
      {renderModal}
    </>
  )
}

export default AccountModal
