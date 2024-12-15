import React, { useState } from 'react';
import { Input, Select, Button, Card, Row, Col, Typography, Rate, List } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

function StatementAnalyzer() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/analyze/statement', {
        content,
        category
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('分析失败:', error);
    }
    setLoading(false);
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="文书编辑">
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            placeholder="选择文书类型"
            value={category}
            onChange={setCategory}
          >
            <Option value="personal_statement">个人陈述</Option>
            <Option value="study_plan">学习计划</Option>
            <Option value="research_proposal">研究计划</Option>
          </Select>

          <TextArea
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此输入你的文书内容..."
          />

          <Button
            type="primary"
            block
            style={{ marginTop: 16 }}
            onClick={handleAnalyze}
            loading={loading}
            disabled={!content || !category}
          >
            开始分析
          </Button>
        </Card>
      </Col>

      <Col span={12}>
        {analysis && (
          <Card title="分析结果">
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>总体评分</Title>
              <Rate
                disabled
                value={analysis.score * 5}
                style={{ fontSize: 24 }}
              />
              <Text style={{ marginLeft: 8 }}>
                {analysis.score * 10} / 10
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={4}>详细反馈</Title>
              <List
                dataSource={analysis.feedback}
                renderItem={item => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <div>
              <Title level={4}>改进建议</Title>
              <Paragraph>
                <ul>
                  <li>确保文书结构清晰，包含明确的开头、主体和结尾</li>
                  <li>使用具体的例子来支持你的论点</li>
                  <li>注意语言的多样性，避免重复用词</li>
                  <li>确保每个段落都有清晰的主题句</li>
                  <li>检查语法和拼写错误</li>
                </ul>
              </Paragraph>
            </div>
          </Card>
        )}
      </Col>
    </Row>
  );
}

export default StatementAnalyzer;
