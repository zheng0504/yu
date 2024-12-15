import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function AdmissionStats({ universityId }) {
  const [admissionData, setAdmissionData] = useState({
    yearlyStats: [],
    programStats: [],
    scoreDistribution: []
  });

  useEffect(() => {
    fetchAdmissionStats();
  }, [universityId]);

  const fetchAdmissionStats = async () => {
    try {
      const response = await axios.get(`/api/universities/${universityId}/stats`);
      setAdmissionData(response.data);
    } catch (error) {
      console.error('获取录取统计数据失败:', error);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="历年录取率趋势">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={admissionData.yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="admissionRate"
                  name="录取率"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="applicants"
                  name="申请人数"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="专业录取分布">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={admissionData.programStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="program" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="admittedCount" name="录取人数" fill="#8884d8" />
                <Bar dataKey="totalApplicants" name="申请人数" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="录取分数分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={admissionData.scoreDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdmissionStats;
