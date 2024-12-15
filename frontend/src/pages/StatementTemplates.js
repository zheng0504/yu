import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Tag,
  Button,
  Modal,
  Input,
  Select,
  message,
  Typography,
  Space,
  Tooltip
} from 'antd';
import {
  FileTextOutlined,
  StarOutlined,
  CopyOutlined,
  LockOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

function StatementTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    tags: []
  });

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/templates', {
        params: filters
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('获取模板失败:', error);
      message.error('获取模板失败');
    }
    setLoading(false);
  };

  const handleUseTemplate = async (template) => {
    if (template.is_premium && !isPremiumUser()) {
      message.warning('此模板仅限高级会员使用');
      return;
    }

    setSelectedTemplate(template);
    setModalVisible(true);
  };

  const handleCopyTemplate = async () => {
    try {
      await axios.post('/api/templates/use', {
        template_id: selectedTemplate.id
      });
      
      // 复制到剪贴板
      navigator.clipboard.writeText(selectedTemplate.content);
      
      message.success('模板已复制到剪贴板');
      setModalVisible(false);
    } catch (error) {
      console.error('使用模板失败:', error);
      message.error('使用模板失败');
    }
  };

  const isPremiumUser = () => {
    // 检查用户是否是高级会员
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.isPremium;
  };

  const categories = [
    { value: 'personal_statement', label: '个人陈述' },
    { value: 'study_plan', label: '学习计划' },
    { value: 'research_proposal', label: '研究计划' },
    { value: 'cv', label: '简历' }
  ];

  return (
    <div>
      <Card>
        <Title level={4}>
          <FileTextOutlined /> 文书模板库
        </Title>

        <Space style={{ marginBottom: 16 }}>
          <Select
            style={{ width: 200 }}
            placeholder="选择文书类型"
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
          >
            <Option value="">全部类型</Option>
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>{cat.label}</Option>
            ))}
          </Select>
        </Space>

        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={templates}
          loading={loading}
          renderItem={template => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <Tooltip title="使用次数">
                    <StarOutlined /> {template.usage_count}
                  </Tooltip>,
                  <Button
                    type="link"
                    onClick={() => handleUseTemplate(template)}
                    icon={template.is_premium ? <LockOutlined /> : <CopyOutlined />}
                  >
                    使用模板
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <Space>
                      {template.title}
                      {template.is_premium && (
                        <Tag color="gold">高级</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {template.description}
                      </Paragraph>
                      <div>
                        {template.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />

        <Modal
          title="模板预览"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="copy"
              type="primary"
              onClick={handleCopyTemplate}
            >
              复制模板
            </Button>
          ]}
          width={800}
        >
          {selectedTemplate && (
            <>
              <Title level={5}>{selectedTemplate.title}</Title>
              <TextArea
                value={selectedTemplate.content}
                rows={15}
                readOnly
              />
            </>
          )}
        </Modal>
      </Card>
    </div>
  );
}

export default StatementTemplates;
