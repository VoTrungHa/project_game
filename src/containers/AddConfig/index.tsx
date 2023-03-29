import { Button, Card, Form, Input, message, Select } from 'antd';
import { SystemConfigAPI } from 'apis/systemconfig';
import { InputNumber } from 'components/InputNumber';
import { UNIT } from 'constants/index';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [unit, setUnit] = useState(UNIT[0]);
  const [formAdd] = Form.useForm();

  const onFinishForm = useCallback(
    async (values) => {
      try {
        const res = await SystemConfigAPI.ADD_CONFIG(values);
        if (res.id) {
          message.success(t('ADD_CONFIG_SUCCESS'));
          formAdd.resetFields();
        }
      } catch (error) {
        message.error(t('ADD_CONFIG_ERROR'));
      }
    },
    [t, formAdd],
  );

  const onResetForm = () => formAdd.resetFields();

  return (
    <section>
      <Card hoverable>
        <Form form={formAdd} onFinish={onFinishForm} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
          <Form.Item
            name='displayName'
            label={t('DISPLAY_NAME_TEXT')}
            rules={[{ required: true, message: t('COMMON_DISPLAYNAME_REQUIRED_ERROR') }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={t('VALUE_TEXT')}
            name='value'
            rules={[{ required: true, message: t('COMMON_VALUE_REQUIRED_ERROR') }]}>
            <InputNumber thousandSeparator />
          </Form.Item>
          <Form.Item
            name='type'
            label={t('TYPE_TEXT')}
            rules={[{ required: true, message: t('COMMON_TYPE_REQUIRED_ERROR') }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: t('COMMON_UNIT_REQUIRED_ERROR') }]}
            name='unit'
            label={t('UNIT_TEXT')}
            initialValue={UNIT[unit]}>
            <Select onSelect={(value: UNIT) => setUnit(UNIT[value])}>
              <Select.Option value={UNIT['none']}>None</Select.Option>
              <Select.Option value={UNIT['%']}>%</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType='submit' type='primary' style={{ marginRight: 10 }}>
              {t('COMMON_BUTTON_ADD')}
            </Button>
            <Button type='primary' danger onClick={onResetForm}>
              {t('COMMON_BUTTON_CANCEL')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
};

export default Index;
