import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

function 注册() {
  const [加载中, set加载中] = useState(false);
  const [form] = Form.useForm();

  const 提交注册 = async (values) => {
    set加载中(true);
    try {
      const response = await axios.post('/api/注册', values);
      if (response.data.success) {
        message.success('注册成功！请查收验证邮件');
        form.resetFields();
      }
    } catch (error) {
      const 错误信息 = error.response?.data?.message || '注册失败，请稍后重试';
      message.error(错误信息);
    } finally {
      set加载中(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          注册账号
        </Title>

        <Form
          form={form}
          name="注册表单"
          onFinish={提交注册}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="确认密码"
            dependencies={['密码']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('密码') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="确认密码" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={加载中}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            已有账号？ <Link to="/登录">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default 注册;
