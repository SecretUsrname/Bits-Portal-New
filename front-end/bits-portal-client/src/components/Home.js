// src/components/HomePage.js
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handlelogout = () => {
      logout();
    }

    const navpapers = () => {
        navigate('/user/papers');
    }

    const navcreatepaper = () => {
        navigate('/create/paper');
    }

    const navtags = () => {
      navigate('/user/taggedpapers');
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Welcome User</h1>
        
        <div className="space-y-4">
          <button
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
            type="button"
            onClick={() => navpapers()}
          >
            View Your Citations
          </button>

          <button
            className="w-full py-2 px-4 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none"
            type="button"
            onClick={() => navtags()}
          >
            View Your Tagged Citations
          </button>

          <button
            className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none"
            type="button"
            onClick={() => navcreatepaper()}
          >
            Upload new Citation
          </button>

          <button
            className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
            type="button"
            onClick={() => handlelogout()}
          >
            Logout
          </button> 
        </div>
      </div>
    </div>
  );
};

export default Home;
