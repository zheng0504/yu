import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, List, Tag, Typography, Row, Col, message } from 'antd';
import { UserOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Title } = Typography;

function UserProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [statements, setStatements] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchPredictions();
    fetchStatements();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setUserInfo(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('/api/users/predictions');
      setPredictions(response.data);
    } catch (error) {
      console.error('获取预测历史失败:', error);
    }
  };

  const fetchStatements = async () => {
    try {
      const response = await axios.get('/api/users/statements');
      setStatements(response.data);
    } catch (error) {
      console.error('获取文书历史失败:', error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put('/api/users/profile', values);
      message.success('个人信息更新成功！');
    } catch (error) {
      console.error('更新失败:', error);
      message.error('更新失败，请重试');
    }
    setLoading(false);
  };

  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              个人信息
            </span>
          }
          key="1"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="gpa"
                  label="GPA"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="toefl"
                  label="TOEFL"
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              预测历史
            </span>
          }
          key="2"
        >
          <List
            itemLayout="horizontal"
            dataSource={predictions}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.university_name}
                  description={`专业: ${item.program}`}
                />
                <div>
                  <Tag color={item.probability > 0.7 ? 'green' : item.probability > 0.4 ? 'orange' : 'red'}>
                    录取概率: {Math.round(item.probability * 100)}%
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              文书历史
            </span>
          }
          key="3"
        >
          <List
            itemLayout="vertical"
            dataSource={statements}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={`${item.category} - ${new Date(item.created_at).toLocaleDateString()}`}
                  description={
                    <Tag color={item.score >= 8 ? 'green' : item.score >= 6 ? 'orange' : 'red'}>
                      评分: {item.score}
                    </Tag>
                  }
                />
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>反馈意见：</Title>
                  <p>{item.feedback}</p>
                </div>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default UserProfile;
