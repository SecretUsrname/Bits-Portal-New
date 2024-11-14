// src/components/SignInPage.js
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { loginAdmin, isAuthenticatedAdmin } = useAdminAuth();
  const { userId, uid } = useUser();

  console.log(isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to home page");
      navigate('/');
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticatedAdmin) {
      console.log("User is authenticated, redirecting to home page");
      navigate('/home');
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticatedAdmin, navigate]);

  const handleLoginSuccess = async(credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const userInfo = jwtDecode(token); // Use jwtDecode
      const userEmail = userInfo.email;
      const response = await axios.get(`http://localhost:3000/login/user/${userEmail}`);
      
      if (response.status === 200 && response.data.authorize === 'YES') {
        login(); // Set user as authenticated
        const user = await axios.get(`http://localhost:3000/user/${userEmail}`);
        const id = user.data._id;
        uid(id);
      } else {
        alert("Unauthorized Access");
      }
    } catch (error) {
      alert("unauthorized Access");
      console.log("Error during email check:", error);
    }

  };

  useEffect(() => {
    console.log('Updated userId:', userId);
    console.log('ID type:', typeof userId);
  }, [userId]);

  const handleLoginSuccessAdmin = async(credentialResponse) => {
    try {
      console.log('Google Login Success:', credentialResponse);
      const token = credentialResponse.credential;
      const userInfo = jwtDecode(token); // Use jwtDecode
      const userEmail = userInfo.email;
      console.log("response")
      const response = await axios.get(`http://localhost:3000/login/admin/${userEmail}`);
      console.log(response)
      if (response.status === 200 && response.data.authorize === 'YES') {
        loginAdmin(); // Set user as authenticated
        navigate('/users'); // Redirect to users page
      } else {
        alert("unauthorized Access");
      }
    } catch (error) {
      alert("unauthorized Access");
      console.log("Error during email check:", error);
    }

    // Here, you can handle the credential and send it to your server if needed
    login();
    // Redirect to /users after successful login
    navigate('/users');
  };

  const handleLoginError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Welcome Back!</h2>
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">Login As User</h2>
        <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            theme="filled_blue"
            size="large"
            className="w-full bg-blue-600 text-white py-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none"
          />
        </GoogleOAuthProvider>
        <br></br>
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">Login As Admin</h2>
        <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleLoginSuccessAdmin}
            onError={handleLoginError}
            theme="filled_blue"
            size="large"
            className="w-full bg-blue-600 text-white py-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SignInPage;
