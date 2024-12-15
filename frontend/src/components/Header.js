import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BankOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

function Header() {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>
    },
    {
      key: '/universities',
      icon: <BankOutlined />,
      label: <Link to="/universities">院校信息</Link>
    },
    {
      key: '/predictor',
      icon: <CalculatorOutlined />,
      label: <Link to="/predictor">录取预测</Link>
    },
    {
      key: '/analyzer',
      icon: <FileTextOutlined />,
      label: <Link to="/analyzer">文书分析</Link>
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人中心</Link>
    }
  ];

  return (
    <AntHeader style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </AntHeader>
  );
}

export default Header;
