import React from 'react';
import { Menu } from 'antd';
import {
  HomeOutlined,
  BankOutlined,
  BarChartOutlined,
  FileTextOutlined,
  UserOutlined,
  CompareOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

function 导航菜单() {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>
    },
    {
      key: '/大学列表',
      icon: <BankOutlined />,
      label: <Link to="/大学列表">大学浏览</Link>
    },
    {
      key: '/录取预测',
      icon: <BarChartOutlined />,
      label: <Link to="/录取预测">录取预测</Link>
    },
    {
      key: '/院校对比',
      icon: <CompareOutlined />,
      label: <Link to="/院校对比">院校对比</Link>
    },
    {
      key: '/文书助手',
      icon: <FileTextOutlined />,
      label: <Link to="/文书助手">文书助手</Link>,
      children: [
        {
          key: '/文书分析',
          label: <Link to="/文书分析">文书分析</Link>
        },
        {
          key: '/文书模板',
          label: <Link to="/文书模板">文书模板</Link>
        }
      ]
    },
    {
      key: '/学习资源',
      icon: <BookOutlined />,
      label: <Link to="/学习资源">学习资源</Link>
    },
    {
      key: '/个人中心',
      icon: <UserOutlined />,
      label: <Link to="/个人中心">个人中心</Link>
    }
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      style={{ lineHeight: '64px' }}
    />
  );
}

export default 导航菜单;
