// src/components/SignInPage.js

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    navigate('/users');
  };

  const handleLoginError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>
        
        <div className="space-y-4">
          {/* Google OAuth Provider wrapping GoogleLogin */}
          <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap
              theme="filled_blue"
              size="large"
              className="w-full bg-blue-600 text-white py-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
            />
          </GoogleOAuthProvider>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our 
              <a href="#" className="text-blue-500 hover:underline"> Terms of Service</a> and
              <a href="#" className="text-blue-500 hover:underline"> Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
