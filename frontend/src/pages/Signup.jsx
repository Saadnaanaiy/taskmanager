import { useState } from 'react';
import { message, Input, Button, Form, Typography } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';

const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://taskmanager-olxx.onrender.com/api/auth/register',
        values,
      );
      message.success('Registration successful! Welcome aboard.');

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        loginUser(response.data.user);
        navigate('/login');
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Sign Up
        </Title>
        <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: 'Please enter your name.' }]}
          >
            <Input className="p-3" placeholder="Enter your name" />
          </Form.Item>

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
              className="bg-indigo-500 hover:bg-indigo-600 p-3 h-auto"
            >
              Sign Up
            </Button>
          </Form.Item>

          <Text className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
