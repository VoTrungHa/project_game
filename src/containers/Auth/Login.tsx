import { ArrowRightOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Typography } from 'antd';
import { InputComponent } from 'components';
import { Link } from 'components/Link';
import { UnlogginLayout } from 'components/UnlogginLayout';
import { PATH } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { loginUser } from './duck/thunks';

export interface FormValue {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { loading, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    if (form.getFieldError('username').length > 0 || form.getFieldError('password').length > 0) {
      form.validateFields();
    }
  }, [form, i18n.language]);

  const handleSubmitLoginForm = useCallback(
    (formValue: FormValue) => {
      if (!loading) {
        const payload = {
          username: formValue.username,
          password: formValue.password,
        };
        // TODO: here is handle error response from server at the first time user logged in unsuccessfully
        dispatch(loginUser(payload)).then((res) => {
          // TODO: consider handle 401 globally if needed
          if (res && (res as ILoginErrorReponse).status === 401) {
            form.setFields([
              {
                name: 'password',
                errors: [t('COMMON_PASSWORD_INVALID_ERROR')],
              },
              {
                name: 'username',
                errors: [t('COMMON_USERNAME_INVALID_ERROR')],
              },
            ]);
          }
        });
      }
    },
    [dispatch, form, loading, t],
  );

  const onFinish = (values: FormValue) => {
    handleSubmitLoginForm(values);
  };

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <UnlogginLayout>
      <Form form={form} name='basic' layout='vertical' onFinish={onFinish}>
        <Card>
          <Typography.Title style={{ textAlign: 'center' }} level={3}>
            {t('COMMON_LOGIN')}
          </Typography.Title>
          <Form.Item
            label={t('COMMON_USERNAME')}
            name='username'
            rules={[{ required: true, message: t('COMMON_USERNAME_REQUIRED_ERROR') }]}>
            <InputComponent
              type=''
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder={t('COMMON_USERNAME')}
              bordered
            />
          </Form.Item>
          <Form.Item
            label={t('COMMON_PASSWORD')}
            name='password'
            rules={[{ required: true, message: t('COMMON_PASSWORD_REQUIRED_ERROR') }]}>
            <InputComponent
              type='password'
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder={t('COMMON_PASSWORD')}
              bordered
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type='primary' htmlType='submit' disabled={loading}>
              {t('COMMON_LOGIN')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to={PATH.FORGOTPASSWORD}>
              {t('COMMON_FORGET_PASSWORD')} <ArrowRightOutlined />
            </Link>
          </Form.Item>
        </Card>
      </Form>
    </UnlogginLayout>
  );
};

export default Login;
