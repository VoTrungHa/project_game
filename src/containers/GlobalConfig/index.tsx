import { Button, Card, Form, message, Switch, Typography } from 'antd';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { removeLeadingZero } from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getConfigCommission } from './duck/thunks';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { configCommission, rate } = useAppSelector((state) => state.systemconfig);

  useDidMount(() => {
    dispatch(getConfigCommission());
  });

  const satoshi = useMemo(() => {
    if (!rate) return 0;
    const value = 1000000 / Number(rate.SATVNDC.bid);
    return Math.ceil(value);
  }, [rate]);

  const onFinishFormComission = useCallback(
    async (values) => {
      if (!configCommission) return;
      const payload = {
        id: configCommission.id,
        referralBy: removeLeadingZero(String(values.referralBy)),
        referralFrom: removeLeadingZero(String(values.referralFrom)),
        nonReferral: removeLeadingZero(String(values.nonReferral)),
        needKyc: values.needKyc,
      };
      try {
        const res = await SystemConfigAPI.EDIT_COMMISSION(payload);
        if (res.id) {
          dispatch(getConfigCommission());
          message.success(t('CONFIG_COMMISSION_SUCCESS'));
        }
      } catch (error) {
        message.error(t('EDIT_CONFIG_ERROR'));
      }
    },
    [dispatch, t, configCommission],
  );

  const checkValue = (_, value: string | number) => {
    const valueInput = removeLeadingZero(String(value));
    if (valueInput > satoshi) {
      return Promise.reject(new Error(`${t('LIMIT_NUMBER_ERROR')} ${satoshi}`));
    }
    return Promise.resolve();
  };

  if (!configCommission) return null;

  return (
    <Card>
      <Row gutter={[20, 20]}>
        <Form onFinish={onFinishFormComission} layout='inline'>
          <Col xl={12} md={24}>
            <Typography.Title level={5}>{t('REFERER_TEXT')}</Typography.Title>
            <Form.Item name='referralBy' initialValue={configCommission.referralBy} rules={[{ validator: checkValue }]}>
              <InputNumber
                decimalScale={0}
                thousandSeparator
                isRemoveLeadingZero
                isUnit={`${t('UNIT_TEXT')}: Satoshi`}
              />
            </Form.Item>
          </Col>
          <Col xl={12} md={24}>
            <Typography.Title level={5}>{t('REFERRAL_BY_TEXT')}</Typography.Title>
            <Form.Item
              name='referralFrom'
              initialValue={configCommission.referralFrom}
              rules={[{ validator: checkValue }]}>
              <InputNumber
                decimalScale={0}
                thousandSeparator
                isRemoveLeadingZero
                isUnit={`${t('UNIT_TEXT')}: Satoshi`}
              />
            </Form.Item>
          </Col>
          <Col xl={12} md={24}>
            <Typography.Title level={5}>{t('NON_REFERRAL_TEXT')}</Typography.Title>
            <Form.Item
              name='nonReferral'
              initialValue={configCommission.nonReferral}
              rules={[{ validator: checkValue }]}>
              <InputNumber
                decimalScale={0}
                thousandSeparator
                isRemoveLeadingZero
                isUnit={`${t('UNIT_TEXT')}: Satoshi`}
              />
            </Form.Item>
          </Col>
          <Col xl={12} md={24} xs={24}>
            <Typography.Title level={5}>{t('VERIFY_KYC_TEXT')}</Typography.Title>
            <Form.Item name='needKyc' initialValue={Boolean(configCommission.needKyc)}>
              <Switch
                checkedChildren={t('ON_TEXT')}
                unCheckedChildren={t('OFF_TEXT')}
                defaultChecked={Boolean(configCommission.needKyc)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Card>
  );
};

export default Index;
