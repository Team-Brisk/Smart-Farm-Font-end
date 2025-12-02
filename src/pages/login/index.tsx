import type { LoginParams } from '@/interface/user/login';
import type { FC } from 'react';

import './index.less';

import { Button, Checkbox, Form, Input, theme as antTheme, Card, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginAsync } from '@/stores/user.action';

const { Title, Text } = Typography;

const initialValues: LoginParams = {
  username: '',
  password: '',
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = antTheme.useToken();

  const onFinished = async (form: LoginParams) => {
    const res = await dispatch<any>(loginAsync(form));

if (!!res) {
  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(res.user));
  
console.log(localStorage)
  navigate("/dashboard", { replace: true });
}

  };

  return (
    <div
      className="login-page"
      style={{
        backgroundColor: token.colorBgLayout,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 420,
          padding: '20px 30px',
          borderRadius: 12,
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            SIGN IN 
          </Title>
          <Text type="secondary">Please sign in</Text>
        </div>

        <Form<LoginParams> layout="vertical" onFinish={onFinished} initialValues={initialValues}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please enter username',
              },
            ]}
          >
            <Input placeholder="Enter your username" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter password',
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              className="login-page-form_button"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
