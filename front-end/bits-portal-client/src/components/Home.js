import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userId = localStorage.getItem('id');
  const [user, setUser] = useState([]);
  const dp = localStorage.getItem('DP');
  console.log(dp);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navPapers = () => {
    console.log("papers")
    navigate('/user/papers');
  };

  const navCreatePaper = () => {
    console.log("Create")
    navigate('/create/paper');
  };

  const navTags = () => {
    console.log("tags")
    navigate('/user/taggedpapers');
  };

  const handlelogout = () => {
    logout();
  }

  
  useEffect(() => {
    axios.get(`http://localhost:3000/user/byid/${userId}`)
        .then(response => {
            setUser(response.data); // Set the fetched users to state
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex w-2/3 bg-gray-100">
      {/* Sidebar */}
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? 0 : '-16rem', // Adjust width accordingly
        height: '100%',
        width: '16rem',
        backgroundColor: '#2d3748', // Tailwind's gray-800
        color: 'white',
        transition: 'left 0.3s ease',
        zIndex: 1000,
      }}
      >
        <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <br></br>
      <h2 className="text-xl font-bold p-4">Menu</h2>
      <ul>
      <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navPapers()}
        >
          papers
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navCreatePaper()}
        >
          Create paper
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navTags()}
        >
          taggedpapers
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => handlelogout()}
        >
          Logout
        </li>
      </ul>
      </div>

      <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
      </button>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Hamburger menu */}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            My Profile
          </h2>

          <div className="flex flex-wrap -mx-2">
            {/* Left Column */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700">Full Name:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value= {user.name}
              />

              <label className="block text-gray-700 mt-4">PSR</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.PSR}
              />

              <label className="block text-gray-700 mt-4">Department</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.Dept}
              />

              <label className="block text-gray-700 mt-4">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.email}
              />

              <label className="block text-gray-700 mt-4">Phone</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.PhoneNum}
              />

              <label className="block text-gray-700 mt-4">Chamber Number</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.chamberNum}
              />

            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <img
                    src={dp}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default Home;
