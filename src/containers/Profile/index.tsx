import { Button, Card, Form, Input, message, Select, Tabs } from 'antd';
import { AuthAPI } from 'apis/auth';
import { Col, Row } from 'components/Container';
import { InputNumber } from 'components/InputNumber';
import { UploadImage } from 'components/UploadImage';
import { ROLE_TYPE, ROLE_TYPE_LABEL } from 'constants/role';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import { useDidMount } from 'hooks/useDidMount';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfile } from './duck/thunks';

const Profile: React.FunctionComponent<{}> = (): JSX.Element => {
  const {
    profile: { profile },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [formPassword] = Form.useForm();
  const [formInformation] = Form.useForm();
  const [src, setSrc] = useState(profile?.avatar);

  useDidMount(() => {
    dispatch(getProfile());
  });

  const onFinishFormPassword = useCallback(
    async (values) => {
      try {
        const res = await AuthAPI.CHANGE_PASSWORD({ password: values.password });
        if (res.id) {
          message.success(t('COMMON_CHANGE_PASSWORD_SUCCESS'));
          formPassword.resetFields();
        }
      } catch (error) {
        message.error(t('COMMON_CHANGE_PASSWORD_ERROR'));
      }
    },
    [formPassword, t],
  );

  const onFinishFormInfomation = useCallback(
    async (values) => {
      try {
        const res = await AuthAPI.UPDATE_PROFILE(values);
        if (res.id) {
          message.success(t('PROFILE_CHANGE_INFO_SUCCESS'));
          dispatch(getProfile());
        }
      } catch (error) {
        message.success(t('PROFILE_CHANGE_INFO_ERROR'));
      }
    },
    [dispatch, t],
  );

  if (!profile) return <>...loading</>;

  return (
    <Tabs defaultActiveKey='1'>
      <Tabs.TabPane tab={t('PROFLE_PERSONAL_INFORMATION')} key='1'>
        <Card bordered={true} style={{ width: '100%', height: '100%' }} hoverable>
          <Form
            form={formInformation}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            onFinish={onFinishFormInfomation}>
            <Row>
              <Col xs={{ span: 24, order: 2 }} lg={{ span: 14, order: 1 }}>
                <Form.Item
                  rules={[{ required: true, message: t('COMMON_FULLNAME_REQUIRED_ERROR') }]}
                  initialValue={profile.fullName}
                  name='fullName'
                  label={t('FULL_NAME_TEXT')}>
                  <Input />
                </Form.Item>
                <Form.Item
                  initialValue={profile.email}
                  name='email'
                  label='Email'
                  rules={[
                    { required: true, message: t('COMMON_EMAIL_REQUIRED_ERROR') },
                    { type: 'email', message: t('COMMON_EMAIL_INVALID_ERROR') },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  initialValue={profile.phone}
                  name='phone'
                  label={t('PHONE_TEXT')}
                  rules={[
                    { required: true, message: t('COMMON_PHONE_REQUIRED_ERROR') },
                    {
                      len: 10,
                      message: t('COMMON_PHONE_LENGTH_ERROR'),
                    },
                  ]}>
                  <InputNumber allowLeadingZeros />
                </Form.Item>
                <Form.Item label={t('ROLE_TEXT')}>
                  <Select disabled defaultValue={profile.role}>
                    <Select.Option value={ROLE_TYPE.ADMIN}>{ROLE_TYPE_LABEL[1]}</Select.Option>
                    <Select.Option value={ROLE_TYPE.MANAGER}>{ROLE_TYPE_LABEL[2]}</Select.Option>
                    <Select.Option value={ROLE_TYPE.EDITOR}>{ROLE_TYPE_LABEL[3]}</Select.Option>
                    <Select.Option value={ROLE_TYPE.USER}>{ROLE_TYPE_LABEL[4]}</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name='avatar' initialValue={src}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type='primary' htmlType='submit'>
                    {t('COMMON_BUTTON_UPDATE')}
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24, order: 1 }} lg={{ span: 10, order: 2 }} textAlign='center'>
                <UploadImage
                  internalProps={{ isEdit: true, isRect: false }}
                  src={src}
                  onChangeImage={(url) => {
                    formInformation.setFields([
                      {
                        name: 'avatar',
                        value: url,
                        errors: [],
                      },
                    ]);
                    setSrc(url);
                  }}
                />
                <Form.Item
                  className='hide-input'
                  name='avatar'
                  initialValue={profile.avatar}
                  rules={[
                    {
                      required: true,
                      message: t('COMMON_AVATAR_REQUIRED_ERROR'),
                    },
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('PROFLE_CHANGE_PASSWORD')} key='2'>
        <Card bordered={true} style={{ width: '100%', height: '100%' }} hoverable>
          <Form form={formPassword} labelCol={{ span: 6 }} wrapperCol={{ span: 6 }} onFinish={onFinishFormPassword}>
            <Form.Item
              name='password'
              label={t('PASSWORD_TEXT')}
              rules={[{ required: true, message: t('COMMON_PASSWORD_REQUIRED_ERROR') }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='confirm'
              label={t('COMMON_RENEWPASSWORD_SECONDLABEL')}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('COMMON_PASSWORD_REQUIRED_ERROR'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('COMMON_RENEWPASSWORD_ERRORMATCH')));
                  },
                }),
              ]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='submit'>
                {t('COMMON_BUTTON_UPDATE')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Profile;
