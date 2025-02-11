import { useState } from 'react';
import { message, Input, Button, Form, Typography, Card } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://taskmanager-server-pysb.onrender.com/api/auth/login',
        values,
      );
      message.success('Logged in successfully! Welcome back.');
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
        loginUser(response.data.user);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl p-6">
        <Title level={2} className="text-center mb-6 text-indigo-600">
          Login
        </Title>
        <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { required: true, message: 'Please enter your email.' },
              { type: 'email', message: 'Please enter a valid email.' },
            ]}
          >
            <Input className="p-3" placeholder="Enter your email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label={<Text strong>Password</Text>}
            rules={[{ required: true, message: 'Please enter your password.' }]}
          >
            <Input.Password className="p-3" placeholder="Enter your password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg"
            >
              Login
            </Button>
          </Form.Item>

          <Text className="block text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
