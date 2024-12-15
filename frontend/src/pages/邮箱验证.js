import React, { useEffect, useState } from 'react';
import { Card, Result, Spin } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function 邮箱验证() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [验证状态, set验证状态] = useState('验证中');
  const token = searchParams.get('token');

  useEffect(() => {
    async function 验证邮箱() {
      if (!token) {
        set验证状态('无效链接');
        return;
      }

      try {
        const response = await axios.post('/api/验证邮箱', { token });
        if (response.data.success) {
          set验证状态('验证成功');
          setTimeout(() => {
            navigate('/登录');
          }, 3000);
        } else {
          set验证状态('验证失败');
        }
      } catch (error) {
        set验证状态('验证失败');
        console.error('邮箱验证失败:', error);
      }
    }

    验证邮箱();
  }, [token, navigate]);

  const 状态配置 = {
    '验证中': {
      icon: <Spin size="large" />,
      title: '正在验证邮箱...',
      subTitle: '请稍候'
    },
    '验证成功': {
      status: 'success',
      title: '邮箱验证成功！',
      subTitle: '3秒后将跳转到登录页面'
    },
    '验证失败': {
      status: 'error',
      title: '邮箱验证失败',
      subTitle: '验证链接可能已过期或无效，请重新注册'
    },
    '无效链接': {
      status: 'warning',
      title: '无效的验证链接',
      subTitle: '请检查您的验证链接是否完整'
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <Card>
        <Result {...状态配置[验证状态]} />
      </Card>
    </div>
  );
}

export default 邮箱验证;
