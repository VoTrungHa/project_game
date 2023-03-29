import { Button, Card, Checkbox, Form, Input, message, Space } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { SystemConfigAPI } from 'apis/systemconfig';
import { Col, Row } from 'components/Container';
import { ACCOUNTS_TO_SEND } from 'constants/index';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [valueCheckbox, setValueCheckbox] = useState<Array<CheckboxValueType>>([]);
  const [formSendNotification] = Form.useForm();

  const isAllAccounts = useMemo(() => valueCheckbox.includes(ACCOUNTS_TO_SEND.ALL), [valueCheckbox]);
  const isKYCAccounts = useMemo(() => valueCheckbox.includes(ACCOUNTS_TO_SEND.KYC), [valueCheckbox]);
  const isNonKYCAccounts = useMemo(() => valueCheckbox.includes(ACCOUNTS_TO_SEND.NON_KYC), [valueCheckbox]);

  const onFinishForm = useCallback(
    async (values) => {
      if (values.accounts.length === 0) return;
      if (values.accounts.includes(ACCOUNTS_TO_SEND.ALL)) {
        try {
          const res = await SystemConfigAPI.SEND_NOTIFICATION({ title: values.title, description: values.description });
          formSendNotification.resetFields();
          setValueCheckbox([]);
          if (typeof res.totalAccounts === 'number') {
            message.success(t('SEND_NOTIFICATION_SUCCESS'));
          }
        } catch (error) {}
      } else {
        const payload = {
          title: values.title,
          description: values.description,
          isPartner: values.accounts.includes(ACCOUNTS_TO_SEND.PARTNER),
          isWithdrawal: values.accounts.includes(ACCOUNTS_TO_SEND.WITHDRALABLE),
          kycStatus: values.accounts.filter((i: number) => i < 4)[0],
        };
        try {
          const res = await SystemConfigAPI.SEND_NOTIFICATION(payload);
          formSendNotification.resetFields();
          setValueCheckbox([]);
          if (typeof res.totalAccounts === 'number') {
            message.success(t('SEND_NOTIFICATION_SUCCESS'));
          }
        } catch (error) {}
      }
    },
    [formSendNotification, t],
  );

  return (
    <Card>
      <Row>
        <Col span={24}>
          <Form
            form={formSendNotification}
            onFinish={onFinishForm}
            labelCol={{ xl: 2, lg: 6 }}
            wrapperCol={{ xl: 12, lg: 14 }}>
            <Form.Item
              label={t('SEND_FOR_TEXT')}
              name='accounts'
              rules={[{ required: true, message: t('COMMON_CHECKBOX_REQUIRED_ERROR') }]}>
              <Checkbox.Group onChange={(value) => setValueCheckbox([...value])}>
                <Space style={{ paddingLeft: 20 }} direction='vertical'>
                  <Checkbox disabled={isKYCAccounts || isNonKYCAccounts} value={ACCOUNTS_TO_SEND.ALL}>
                    {t('ALL_ACCOUNTS_TEXt')}
                  </Checkbox>
                  <Checkbox disabled={isAllAccounts || isNonKYCAccounts} value={ACCOUNTS_TO_SEND.KYC}>
                    {t('KYC_ACCOUNTS_TEXT')}
                  </Checkbox>
                  <Checkbox disabled={isAllAccounts || isKYCAccounts} value={ACCOUNTS_TO_SEND.NON_KYC}>
                    {t('NON_KYC_ACCOUNTS_TEXT')}
                  </Checkbox>
                  <Checkbox disabled={isAllAccounts} value={ACCOUNTS_TO_SEND.PARTNER}>
                    {t('PARTNER_ACCOUNTS_TEXT')}
                  </Checkbox>
                  <Checkbox disabled={isAllAccounts} value={ACCOUNTS_TO_SEND.WITHDRALABLE}>
                    {t('WITHDRAL_ACCOUNTS_TEXT')}
                  </Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name='title'
              label={t('TITLE_TEXT')}
              rules={[
                { required: true, message: t('COMMON_TITLE_REQUIRED_ERROR') },
                { min: 10, message: t('LEN_TITLE_SHORT_ERROR') },
                { max: 255, message: t('LEN_TITLE_LONG_ERROR') },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label={t('DESCRIPTION_TEXT')}
              name='description'
              rules={[
                { required: true, message: t('COMMON_DESCRIPTION_REQUIRED_ERROR') },
                { min: 10, message: t('LEN_DESCRIPTION_SHORT_ERROR') },
                { max: 500, message: t('LEN_DESCRIPTION_LONG_ERROR') },
              ]}>
              <Input.TextArea />
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

export default Index;
