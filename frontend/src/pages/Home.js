import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  BankOutlined,
  CalculatorOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function Home() {
  const features = [
    {
      icon: <BankOutlined style={{ fontSize: '32px' }} />,
      title: '院校信息查询',
      description: '全面的院校数据库，帮助你了解各个学校的详细信息。',
      link: '/universities'
    },
    {
      icon: <CalculatorOutlined style={{ fontSize: '32px' }} />,
      title: '录取概率预测',
      description: '基于AI的录取概率预测，为你的申请提供参考。',
      link: '/predictor'
    },
    {
      icon: <FileTextOutlined style={{ fontSize: '32px' }} />,
      title: '文书智能分析',
      description: '智能分析你的申请文书，提供专业的修改建议。',
      link: '/analyzer'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
        留学选校 AI 辅助系统
      </Title>
      
      <Paragraph style={{ textAlign: 'center', fontSize: '16px', marginBottom: '48px' }}>
        利用人工智能技术，为你的留学申请提供全方位的智能辅助服务
      </Paragraph>

      <Row gutter={[24, 24]} justify="center">
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ marginBottom: '24px' }}>{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph style={{ flex: 1 }}>{feature.description}</Paragraph>
              <Link to={feature.link}>
                <Button type="primary">立即使用</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
