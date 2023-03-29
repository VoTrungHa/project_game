import { Checkbox, DatePicker, Form, Input, message, Select } from 'antd';
import vn from 'antd/es/date-picker/locale/vi_VN';
import { RankAPI } from 'apis/rank';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { Modal } from 'components/Modal';
import { COIN_TYPE, REFERRAL_RANKING_STATUS } from 'constants/index';
import {
  FORMAT_MOMENT,
  isAfter,
  isSame,
  Moment,
  parseGetUnixTime,
  parseGetUnixTimeValue,
  parseGetUnixTimeValueAddMinutes,
  parseTime,
  REGREX_NUMBER,
  standardizeMoment,
} from 'helpers/common';
import { useAppDispatch } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getListRank } from '../duck/thunks';
import './index.scss';

const { SAT, VNDC } = COIN_TYPE;
const { Option } = Select;
const { DATE_TIME_LONG, DATE_TIME_SHORT, TIME_SHORT } = FORMAT_MOMENT;

type IModalState = {
  type: 'Add' | 'Edit';
  data?: IRankItem;
  isOpen: boolean;
};

interface RankModalProps {
  modalState?: IModalState;
  onChangeModal: (payload?: IModalState) => void;
  setModalState: (payload?: IModalState) => void;
  paramSearch: {
    page: number;
    size: number;
  };
}

const RankModal: React.FC<RankModalProps> = ({ paramSearch, modalState, setModalState, onChangeModal }) => {
  const { t, i18n } = useTranslation();
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const { id, title, description, totalPrize, currency, isPublic, status } = modalState?.data || ({} as IRankItem);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!modalState) {
      formAdd.resetFields();
      formEdit.resetFields();
    }
  }, [formAdd, formEdit, modalState, paramSearch]);

  useEffect(() => {
    if (!modalState) return;
    const timeStart = parseTime(Number(modalState.data?.timeStart), DATE_TIME_SHORT);
    const timeEnd = parseTime(Number(modalState.data?.timeEnd), DATE_TIME_SHORT);
    id &&
      formEdit.setFieldsValue({
        title: title,
        description: description,
        timeStart: timeStart && standardizeMoment(timeStart),
        timeEnd: timeEnd && standardizeMoment(timeEnd),
        totalPrize: totalPrize,
        currencyCode: currency?.code,
        isPublic: isPublic,
      });
  }, [modalState, id, title, description, totalPrize, currency, isPublic, formEdit]);

  const isDisableEdit = useMemo(
    () => status === REFERRAL_RANKING_STATUS.LOCKED || status === REFERRAL_RANKING_STATUS.AWARDED,
    [status],
  );

  const onSubmitModal = useCallback(() => {
    if (!modalState) return;
    if (modalState.type === 'Add') {
      formAdd.submit();
    }
    if (modalState.type === 'Edit') {
      formEdit.submit();
    }
  }, [formAdd, formEdit, modalState]);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState) return;
      const payload = {
        title: values.title,
        description: values.description,
        ...(!!Number(values.totalPrize) && { totalPrize: values.totalPrize }),
        timeStart: parseGetUnixTimeValueAddMinutes(values.timeStart, 1),
        timeEnd: parseGetUnixTimeValue(values.timeEnd),
        isPublic: isPublic,
        currencyCode: values.currencyCode,
      };
      if (modalState.type === 'Add') {
        try {
          const res = await RankAPI.ADD_RANK(payload as IAddRank);
          if (res.id) {
            message.success(t('ADD_RANK_SUCCESS'));
            dispatch(getListRank(paramSearch));
            setModalState(undefined);
            formAdd.resetFields();
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
      if (modalState.type === 'Edit') {
        if (!modalState.data) return;
        try {
          const res = await RankAPI.UPDATE_RANK(modalState.data.id, {
            ...payload,
            timeStart: isSame(values.timeStart, parseTime(modalState.data.timeStart, DATE_TIME_SHORT))
              ? undefined
              : payload.timeStart,
            timeEnd: isSame(values.timeEnd, parseTime(modalState.data.timeEnd, DATE_TIME_SHORT))
              ? undefined
              : payload.timeEnd,
          });
          if (res.id) {
            message.success(t('UPDATE_RANK_SUCCESS'));
            dispatch(getListRank(paramSearch));
            setModalState(undefined);
          }
        } catch (error: any) {
          message.error(error.response.data.message[0].message);
        }
      }
    },
    [modalState, formAdd, setModalState, t, dispatch, isPublic, paramSearch],
  );

  const checkValueStart = useCallback(
    (_, time: Moment) => {
      if (!modalState) return;

      if (!time) {
        return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
      }

      if (modalState.data && modalState.data.timeStart) {
        const timeStartDefault = parseTime(modalState.data.timeStart, DATE_TIME_SHORT);
        if (isSame(time, timeStartDefault)) {
          return Promise.resolve();
        }
      }

      const now = parseTime(parseGetUnixTime(), DATE_TIME_LONG);
      const value = parseTime(time, DATE_TIME_LONG);
      if (!isAfter(value, now)) {
        return Promise.reject(new Error(t('START_MUST_BE_GREATER_THAN_NOW')));
      }
      return Promise.resolve();
    },
    [modalState, t],
  );

  const checkTotalPrize = useCallback(
    (_, value) => {
      if (value <= 0 || !new RegExp(REGREX_NUMBER).test(value)) {
        return Promise.reject(t('INVALID_TOTAL_PRIZE'));
      }
      return Promise.resolve();
    },
    [t],
  );

  const renderModal = useMemo(() => {
    if (!modalState) return null;

    if (modalState.type === 'Add') {
      return (
        <Modal
          visible={modalState.isOpen}
          width={700}
          onOk={onSubmitModal}
          onCancel={() => onChangeModal(undefined)}
          okText={t('COMMON_BUTTON_ADD')}
          title={t('ADD_RANK_TABLE')}
          cancelText={t('COMMON_BUTTON_CLOSE')}>
          <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label={t('NAME_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_OF_RANK_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('DESCRIPTION_TEXT')} name='description'>
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item required rules={[{ validator: checkValueStart }]} name='timeStart' label={t('TIME_START')}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='timeEnd'
                  label={t('TIME_END')}
                  required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }

                        const start = parseTime(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = parseTime(time, DATE_TIME_LONG);
                        if (!isAfter(end, start)) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <DatePicker
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name='totalPrize' label={t('PRIZE_POOL')} rules={[{ validator: checkTotalPrize }]}>
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('AWARD_UNIT')} name='currencyCode' initialValue={SAT} required>
                  <Select>
                    <Option value={SAT}>SAT</Option>
                    <Option value={VNDC}>VNDC</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label={t('PUBLIC')} name='isPublic' labelCol={{ span: 6 }} labelAlign='left'>
                  <Checkbox
                    defaultChecked={isPublic || false}
                    checked={isPublic || false}
                    value={isPublic || false}
                    onChange={(e) => {
                      onChangeModal({
                        isOpen: true,
                        type: 'Add',
                        data: { ...(modalState?.data ? modalState.data : {}), isPublic: e.target.checked } as IRankItem,
                      });
                      formEdit.setFieldsValue({ isPublic: e.target.checked });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }

    if (modalState.type === 'Edit') {
      return (
        <Modal
          visible={modalState.isOpen}
          width={700}
          onOk={onSubmitModal}
          okText={t('COMMON_BUTTON_UPDATE')}
          title={t('UPDATE_RANK_TABLE')}
          cancelText={t('COMMON_BUTTON_CLOSE')}
          onCancel={() => onChangeModal(undefined)}>
          <Form form={formEdit} onFinish={onFinishForm} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label={t('TITLE_TEXT')}
                  rules={[{ required: true, message: t('COMMON_TITLE_OF_RANK_REQUIRED_ERROR') }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('DESCRIPTION_TEXT')} name='description'>
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item required rules={[{ validator: checkValueStart }]} name='timeStart' label={t('TIME_START')}>
                  <DatePicker
                    disabled={isDisableEdit}
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='timeEnd'
                  label={t('TIME_END')}
                  required
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, time: Moment) {
                        if (!time) {
                          return Promise.reject(new Error(t('COMMON_TIME_REQUIRED_ERROR')));
                        }

                        if (modalState.data && modalState.data.timeEnd) {
                          if (
                            isSame(
                              parseTime(time, DATE_TIME_SHORT),
                              parseTime(modalState.data.timeEnd, DATE_TIME_SHORT),
                            )
                          ) {
                            return Promise.resolve();
                          }
                        }

                        const now = parseTime(parseGetUnixTime(), DATE_TIME_LONG);
                        const start = parseTime(getFieldValue('timeStart'), DATE_TIME_LONG);
                        const end = parseTime(time, DATE_TIME_LONG);
                        if (!isAfter(end, start)) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_START')));
                        }
                        if (!isAfter(end, now)) {
                          return Promise.reject(new Error(t('END_MUST_BE_GREATER_THAN_NOW')));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <DatePicker
                    disabled={isDisableEdit}
                    showNow={false}
                    showTime={{ format: TIME_SHORT }}
                    format={DATE_TIME_SHORT}
                    locale={i18n.language === 'vn' ? vn : undefined}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name='totalPrize' label={t('PRIZE_POOL')} rules={[{ validator: checkTotalPrize }]}>
                  <InputNumber disabled={isDisableEdit} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('AWARD_UNIT')} name='currencyCode' initialValue={SAT} required>
                  <Select disabled={isDisableEdit}>
                    <Option value={SAT}>SAT</Option>
                    <Option value={VNDC}>VNDC</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label={t('PUBLIC')} name='isPublic' labelCol={{ span: 6 }} labelAlign='left'>
                  <Checkbox
                    defaultChecked={isPublic || false}
                    checked={isPublic || false}
                    value={isPublic || false}
                    onChange={(e) =>
                      onChangeModal({
                        isOpen: true,
                        type: 'Edit',
                        data: {
                          ...(modalState?.data
                            ? {
                                ...modalState.data,
                                title: formEdit.getFieldValue('title'),
                                description: formEdit.getFieldValue('description'),
                                timeStart: formEdit.getFieldValue('timeStart'),
                                timeEnd: formEdit.getFieldValue('timeEnd'),
                                totalPrize: formEdit.getFieldValue('totalPrize'),
                                currency: {
                                  ...modalState?.data?.currency,
                                  code: formEdit.getFieldValue('currencyCode'),
                                },
                              }
                            : {}),
                          isPublic: e.target.checked,
                        } as IRankItem,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }, [
    modalState,
    onSubmitModal,
    t,
    formAdd,
    onFinishForm,
    checkValueStart,
    i18n.language,
    checkTotalPrize,
    isPublic,
    onChangeModal,
    formEdit,
    isDisableEdit,
  ]);

  return <>{renderModal}</>;
};

export default RankModal;
