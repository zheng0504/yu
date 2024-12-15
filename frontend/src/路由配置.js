import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/使用授权';

// 页面组件
import 首页 from './pages/首页';
import 大学列表 from './pages/大学列表';
import 录取预测 from './pages/录取预测';
import 院校对比 from './pages/院校对比';
import 文书分析 from './pages/文书分析';
import 文书模板 from './pages/文书模板';
import 学习资源 from './pages/学习资源';
import 个人中心 from './pages/个人中心';
import 登录 from './pages/登录';
import 注册 from './pages/注册';
import 邮箱验证 from './pages/邮箱验证';

// 受保护的路由组件
function 需要登录({ children }) {
  const { 用户 } = useAuth();
  
  if (!用户) {
    return <Navigate to="/登录" replace />;
  }
  
  return children;
}

// 需要高级会员的路由组件
function 需要会员({ children }) {
  const { 用户 } = useAuth();
  
  if (!用户?.是否高级会员) {
    return <Navigate to="/升级会员" replace />;
  }
  
  return children;
}

function 路由配置() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/" element={<首页 />} />
      <Route path="/登录" element={<登录 />} />
      <Route path="/注册" element={<注册 />} />
      <Route path="/邮箱验证" element={<邮箱验证 />} />
      <Route path="/大学列表" element={<大学列表 />} />
      
      {/* 需要登录的路由 */}
      <Route path="/录取预测" element={
        <需要登录>
          <录取预测 />
        </需要登录>
      } />
      
      <Route path="/院校对比" element={
        <需要登录>
          <院校对比 />
        </需要登录>
      } />
      
      <Route path="/文书分析" element={
        <需要登录>
          <文书分析 />
        </需要登录>
      } />
      
      <Route path="/文书模板" element={
        <需要登录>
          <文书模板 />
        </需要登录>
      } />
      
      <Route path="/学习资源" element={
        <需要登录>
          <学习资源 />
        </需要登录>
      } />
      
      <Route path="/个人中心" element={
        <需要登录>
          <个人中心 />
        </需要登录>
      } />
      
      {/* 需要高级会员的路由 */}
      <Route path="/高级模板" element={
        <需要会员>
          <文书模板 高级={true} />
        </需要会员>
      } />
    </Routes>
  );
}

export default 路由配置;
