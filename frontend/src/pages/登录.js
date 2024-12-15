import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/使用授权';

const { Title } = Typography;

function 登录() {
  const [加载中, set加载中] = useState(false);
  const { 登录 } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const 提交登录 = async (values) => {
    set加载中(true);
    try {
      await 登录(values.用户名, values.密码);
      message.success('登录成功！');
      navigate('/');
    } catch (error) {
      const 错误信息 = error.response?.data?.message || '登录失败，请检查用户名和密码';
      message.error(错误信息);
    } finally {
      set加载中(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          用户登录
        </Title>

        <Form
          form={form}
          name="登录表单"
          onFinish={提交登录}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名或邮箱" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="记住我" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Link 
              to="/忘记密码" 
              style={{ float: 'right' }}
            >
              忘记密码？
            </Link>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={加载中}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            还没有账号？ <Link to="/注册">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default 登录;
