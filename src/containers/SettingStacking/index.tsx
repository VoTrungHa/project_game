import { Button, Card, Form, message, Select, Spin } from 'antd';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { COIN_TYPE } from 'constants/index';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getStackingConfig } from './duck/thunks';

const SettingStacking: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stacking, loading } = useAppSelector((state) => state.settingStacking);
  const { t } = useTranslation();
  const [formStacking] = Form.useForm();

  const onFinishForm = useCallback(
    async (values) => {
      try {
        const res = await SystemConfigAPI.UPDATE_STACKING({ ...values, interestRate: Number(values.interestRate) });
        if (res.id) {
          dispatch(getStackingConfig());
          message.success(t('UPDATE_STACKING_SUCCESSFULLY'));
        }
      } catch (error) {
        message.error(t('UPDATE_STACKING_UNSUCCESSFULLY'));
      }
    },
    [dispatch, t],
  );

  const checkValue = useCallback(
    (_, interestRate: string) => {
      if (!interestRate) {
        return Promise.reject(new Error(t('COMMON_INTEREST_RATE_REQUIRED_ERROR')));
      }
      if (Number(interestRate) > 20) {
        return Promise.reject(new Error(t('INTEREST_RATE_LIMIT')));
      }
      return Promise.resolve();
    },
    [t],
  );

  if (loading) return <Spin />;

  return (
    <Card>
      <Row>
        <Col xl={8} lg={12} xs={24} md={12}>
          <Form form={formStacking} onFinish={onFinishForm} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              label={t('PROFIT_WALLET')}
              name='fromWalletCode'
              initialValue={stacking ? stacking.fromWallet.code : COIN_TYPE.SAT}>
              <Select>
                <Select.Option value={COIN_TYPE.SAT}>SAT</Select.Option>
                <Select.Option value={COIN_TYPE.VNDC}>VNDC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='interestRate'
              label={t('INTEREST_RATE')}
              rules={[{ validator: checkValue }]}
              initialValue={stacking ? stacking.rate : 0}>
              <InputNumber decimalScale={2} allowNegative={false} isUnit={`${t('UNIT_TEXT')}: %`} />
            </Form.Item>
            <Form.Item
              label={t('INTEREST_PAYMENT_WALLET')}
              name='receivingWalletCode'
              initialValue={stacking ? stacking.walletReceive.code : COIN_TYPE.SAT}>
              <Select>
                <Select.Option value={COIN_TYPE.SAT}>SAT</Select.Option>
                <Select.Option value={COIN_TYPE.VNDC}>VNDC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                {t('COMMON_BUTTON_SEND')}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default SettingStacking;
