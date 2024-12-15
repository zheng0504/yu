import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import Universities from './pages/Universities';
import AdmissionPredictor from './pages/AdmissionPredictor';
import StatementAnalyzer from './pages/StatementAnalyzer';
import UserProfile from './pages/UserProfile';

const { Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/predictor" element={<AdmissionPredictor />} />
              <Route path="/analyzer" element={<StatementAnalyzer />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          留学选校 AI 辅助系统 ©2024
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
