import React, { useState } from 'react';
import { Card, Select, Table, Row, Col, Button, Typography, Tag, Divider } from 'antd';
import { CompareOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

function UniversityComparison() {
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '对比项',
      dataIndex: 'feature',
      key: 'feature',
      fixed: 'left',
      width: 150
    },
    ...selectedUniversities.map(uni => ({
      title: uni.name,
      dataIndex: uni.id,
      key: uni.id,
      width: 200,
      render: (text, record) => {
        if (record.type === 'ranking') {
          return <Tag color="blue">{text}</Tag>;
        }
        if (record.type === 'acceptance_rate') {
          return <Tag color="green">{(text * 100).toFixed(1)}%</Tag>;
        }
        if (record.type === 'tuition') {
          return `$${text.toLocaleString()}`;
        }
        return text;
      }
    }))
  ];

  const handleUniversitySelect = async (value) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/universities/${value}`);
      const newUni = response.data;
      
      if (selectedUniversities.length < 3) {
        setSelectedUniversities([...selectedUniversities, newUni]);
      }
    } catch (error) {
      console.error('获取大学信息失败:', error);
    }
    setLoading(false);
  };

  const generateComparisonData = () => {
    const features = [
      { feature: '排名', type: 'ranking' },
      { feature: '录取率', type: 'acceptance_rate' },
      { feature: '学费', type: 'tuition' },
      { feature: '地理位置', type: 'location' },
      { feature: '开设专业', type: 'programs' },
      { feature: '申请要求', type: 'requirements' }
    ];

    return features.map(feat => {
      const row = { feature: feat.feature, type: feat.type };
      selectedUniversities.forEach(uni => {
        if (feat.type === 'programs') {
          row[uni.id] = uni[feat.type].join(', ');
        } else {
          row[uni.id] = uni[feat.type];
        }
      });
      return row;
    });
  };

  const searchUniversities = async (value) => {
    if (value) {
      try {
        const response = await axios.get('/api/universities/search', {
          params: { query: value }
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('搜索大学失败:', error);
      }
    }
  };

  return (
    <div>
      <Card>
        <Title level={4}>
          <CompareOutlined /> 院校对比
        </Title>
        <Divider />
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={18}>
            <Select
              showSearch
              placeholder="搜索并添加要对比的院校（最多3所）"
              style={{ width: '100%' }}
              onSearch={searchUniversities}
              onChange={handleUniversitySelect}
              disabled={selectedUniversities.length >= 3}
              filterOption={false}
              notFoundContent={null}
            >
              {universities.map(uni => (
                <Option key={uni.id} value={uni.id}>{uni.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Button 
              type="primary" 
              onClick={() => setSelectedUniversities([])}
              disabled={selectedUniversities.length === 0}
            >
              清空对比
            </Button>
          </Col>
        </Row>

        {selectedUniversities.length > 0 && (
          <Table
            columns={columns}
            dataSource={generateComparisonData()}
            pagination={false}
            rowKey="feature"
            scroll={{ x: true }}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
}

export default UniversityComparison;
