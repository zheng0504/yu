import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Row, Col, Slider } from 'antd';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    rankingRange: [1, 200],
    location: '',
    program: ''
  });

  const columns = [
    {
      title: '学校名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      filters: [
        { text: '美国', value: '美国' },
        { text: '英国', value: '英国' },
        { text: '加拿大', value: '加拿大' },
        { text: '澳大利亚', value: '澳大利亚' }
      ],
      onFilter: (value, record) => record.location.includes(value)
    },
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
      sorter: (a, b) => a.ranking - b.ranking
    },
    {
      title: '录取率',
      dataIndex: 'acceptance_rate',
      key: 'acceptance_rate',
      render: (text) => `${(text * 100).toFixed(1)}%`,
      sorter: (a, b) => a.acceptance_rate - b.acceptance_rate
    },
    {
      title: '学费（年）',
      dataIndex: 'tuition',
      key: 'tuition',
      render: (text) => `$${text.toLocaleString()}`,
      sorter: (a, b) => a.tuition - b.tuition
    }
  ];

  useEffect(() => {
    fetchUniversities();
  }, [filters]);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/universities', {
        params: {
          ranking_min: filters.rankingRange[0],
          ranking_max: filters.rankingRange[1],
          location: filters.location,
          program: filters.program
        }
      });
      setUniversities(response.data);
    } catch (error) {
      console.error('获取大学数据失败:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Card title="筛选条件" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ marginBottom: 16 }}>
              <p>排名范围</p>
              <Slider
                range
                min={1}
                max={200}
                value={filters.rankingRange}
                onChange={(value) => setFilters({ ...filters, rankingRange: value })}
              />
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 16 }}>
              <p>地区</p>
              <Select
                style={{ width: '100%' }}
                placeholder="选择地区"
                value={filters.location}
                onChange={(value) => setFilters({ ...filters, location: value })}
              >
                <Option value="">全部</Option>
                <Option value="美国">美国</Option>
                <Option value="英国">英国</Option>
                <Option value="加拿大">加拿大</Option>
                <Option value="澳大利亚">澳大利亚</Option>
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 16 }}>
              <p>专业</p>
              <Search
                placeholder="输入专业名称"
                value={filters.program}
                onChange={(e) => setFilters({ ...filters, program: e.target.value })}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={universities}
        rowKey="id"
        loading={loading}
        pagination={{
          total: universities.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 所学校`
        }}
      />
    </div>
  );
}

export default Universities;
