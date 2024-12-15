import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, Card, Row, Col, Progress, Typography } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title, Paragraph } = Typography;

function AdmissionPredictor() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/predict/admission', values);
      setResult(response.data);
    } catch (error) {
      console.error('预测失败:', error);
    }
    setLoading(false);
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="录取概率预测">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="university_id"
              label="目标院校"
              rules={[{ required: true, message: '请选择目标院校' }]}
            >
              <Select placeholder="选择学校">
                <Option value={1}>哈佛大学</Option>
                <Option value={2}>斯坦福大学</Option>
                <Option value={3}>麻省理工学院</Option>
                {/* 这里需要从后端获取完整的学校列表 */}
              </Select>
            </Form.Item>

            <Form.Item
              name="program"
              label="申请专业"
              rules={[{ required: true, message: '请选择申请专业' }]}
            >
              <Select placeholder="选择专业">
                <Option value="cs">计算机科学</Option>
                <Option value="business">工商管理</Option>
                <Option value="engineering">工程学</Option>
                {/* 这里需要从后端获取完整的专业列表 */}
              </Select>
            </Form.Item>

            <Form.Item
              name="gpa"
              label="GPA"
              rules={[{ required: true, message: '请输入GPA' }]}
            >
              <Input type="number" step="0.01" min="0" max="4.0" placeholder="例如: 3.8" />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="toefl"
                  label="TOEFL"
                >
                  <Input type="number" placeholder="例如: 100" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ielts"
                  label="IELTS"
                >
                  <Input type="number" step="0.5" placeholder="例如: 7.0" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="gre"
              label="GRE"
            >
              <Input type="number" placeholder="例如: 320" />
            </Form.Item>

            <Form.Item
              name="research_experience"
              label="科研经历"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="internship_experience"
              label="实习经历"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                开始预测
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Col span={12}>
        {result && (
          <Card title="预测结果">
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Progress
                type="circle"
                percent={Math.round(result.admission_probability * 100)}
                format={percent => `${percent}%`}
              />
              <Title level={4} style={{ marginTop: '24px' }}>
                录取概率
              </Title>
              <Paragraph>
                基于历史数据分析，你的申请材料在该校该专业的竞争力较{
                  result.admission_probability > 0.7 ? '强' :
                  result.admission_probability > 0.4 ? '中等' : '弱'
                }
              </Paragraph>
              <Paragraph>
                建议：
                <ul>
                  {result.admission_probability < 0.4 && (
                    <>
                      <li>考虑提高语言成绩</li>
                      <li>增加相关实习或科研经历</li>
                      <li>考虑申请难度较低的学校作为保底</li>
                    </>
                  )}
                  {result.admission_probability >= 0.4 && result.admission_probability < 0.7 && (
                    <>
                      <li>继续提升相关经历</li>
                      <li>准备高质量的文书材料</li>
                      <li>可以考虑申请此档次的其他学校</li>
                    </>
                  )}
                  {result.admission_probability >= 0.7 && (
                    <>
                      <li>录取概率较高，建议认真准备申请材料</li>
                      <li>同时考虑申请更好的学校</li>
                      <li>保持现有成绩和竞争力</li>
                    </>
                  )}
                </ul>
              </Paragraph>
            </div>
          </Card>
        )}
      </Col>
    </Row>
  );
}

export default AdmissionPredictor;
