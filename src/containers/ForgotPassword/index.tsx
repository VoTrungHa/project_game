import { MailFilled } from '@ant-design/icons';
import { Card, Form, Input, message, Typography } from 'antd';
import { ForgotPasswordAPI } from 'apis/forgotpassword';
import Button from 'components/Button';
import { UnlogginLayout } from 'components/UnlogginLayout';
import { PATH } from 'constants/paths';
import { useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const history = useHistory();

  if (isLoggedIn) {
    history.push(PATH.DASHBOARD);
  }

  useEffect(() => {
    if (form.getFieldError('email').length > 0) {
      form.validateFields();
    }
  }, [form, i18n.language]);

  const onFinish = useCallback(
    async (email: string) => {
      try {
        const res = await ForgotPasswordAPI.SEARCHBYEMAIL(email);
        if (res.status) {
          message.success(t('FORGOTPASSWORD_SUCCESS'));
        }
      } catch (error) {
        form.setFields([
          {
            name: 'email',
            errors: [t('FORGOTPASSWORD_ERRORFROMSERVER')],
          },
        ]);
      }
    },
    [form, t],
  );

  return (
    <UnlogginLayout>
      <Form form={form} name='basic' layout='vertical' onFinish={onFinish}>
        <Card>
          <Typography.Title style={{ textAlign: 'center' }} level={3}>
            {t('FORGOTPASSWORD_TEXT')}
          </Typography.Title>
          <Typography.Text>{t('FORGOTPASSWORD_PROMPT')}</Typography.Text>
          <br />
          <Form.Item
            name='email'
            rules={[
              { required: true, message: t('COMMON_EMAIL_REQUIRED_ERROR') },
              { type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') },
            ]}>
            <Input placeholder='Email' prefix={<MailFilled className='site-form-item-icon' />} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type='danger'
              name={t('COMMON_BUTTON_CANCEL')}
              onClick={() => {
                history.push(PATH.LOGIN);
              }}
            />{' '}
            <Button type='primary' htmlType='submit' name={t('COMMON_BUTTON_SEARCH')} />
          </Form.Item>
        </Card>
      </Form>
    </UnlogginLayout>
  );
};

export default Index;
