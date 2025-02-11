import { useEffect, useState } from 'react';
import { Card, Button, Input, message, Modal, Spin } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://taskmanager-server-pysb.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setUpdatedUser(res.data.user);
      } catch (error) {
        message.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'https://taskmanager-server-pysb.onrender.com/api/auth/profile',
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(res.data.user);
      setEditMode(false);
      message.success('Profile updated!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will permanently delete your account!',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete('https://taskmanager-server-pysb.onrender.com/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Account deleted!');
          localStorage.removeItem('token');
          navigate('/login');
        } catch (error) {
          message.error('Failed to delete account');
        }
      },
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 relative">
      {/* Back to Home Button (Top-Left) */}
      <Button
        type="default"
        icon={<HomeOutlined />}
        className="absolute top-4 left-4 bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
        onClick={() => navigate('/')}
      >
        Home
      </Button>

      {loading ? (
        <Spin size="large" className="mt-20" />
      ) : (
        <Card className="w-full mt-44 max-w-md p-6 shadow-2xl rounded-2xl bg-white">
          <div className="flex flex-col items-center">
            <UserOutlined className="text-6xl text-blue-500 mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          </div>

          {editMode ? (
            <div className="space-y-4 mt-4">
              <Input
                value={updatedUser.name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, name: e.target.value })
                }
                placeholder="Enter your name"
                className="p-2 rounded-lg"
              />
              <Input
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
                placeholder="Enter your email"
                className="p-2 rounded-lg"
              />
              <Button type="primary" onClick={handleUpdate} block>
                Save Changes
              </Button>
              <Button onClick={() => setEditMode(false)} block>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <p className="text-lg">
                <strong>Name:</strong> {user?.name}
              </p>
              <p className="text-lg">
                <strong>Email:</strong> {user?.email}
              </p>
              <div className="flex justify-between mt-4">
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
