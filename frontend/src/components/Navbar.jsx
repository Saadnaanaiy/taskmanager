import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { Button, Input, Typography, Avatar, message } from 'antd';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { IoMdArrowDropdown } from 'react-icons/io';

const { Title } = Typography;

const Navbar = ({ onSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem('token');
      message.success('You logged out successfully!');
      navigate('/login');
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-3xl font-bold">
        <Link to="/">
          <Title
            level={3}
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            NoteApp
          </Title>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-1/3">
        <Input
          placeholder="Search notes..."
          onChange={(e) => onSearch(e.target.value)}
          className="bg-gray-100 text-gray-800 rounded-lg p-2 w-full border border-gray-300"
        />
      </div>

      {/* User Section */}
      <div className="flex items-center space-x-6 relative">
        {!user ? (
          <>
            <Link to="/login">
              <Button
                type="primary"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                type="default"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-100"
              >
                Sign Up
              </Button>
            </Link>
          </>
        ) : (
          // Custom Dropdown
          <div className="relative p-4">
            <button
              className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Avatar className="bg-indigo-600 text-white font-semibold">
                {user.name[0].toUpperCase()}
              </Avatar>
              <IoMdArrowDropdown className="text-gray-600 text-lg" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white p-1 rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-2 font-semibold text-gray-800 bg-gray-100 border-b">
                  {user.email || user.name}
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <HiOutlineUser className="text-gray-600" /> Profile
                </Link>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 mt-1 rounded-lg bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors duration-200 font-semibold"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-lg" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
