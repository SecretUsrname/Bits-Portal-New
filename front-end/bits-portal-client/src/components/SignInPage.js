// src/components/SignInPage.js

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from React Router

const SignInPage = () => {
  const navigate = useNavigate();  // Initialize the navigate function
  
  // Handle the success response from Google login
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);

    // Here, you can handle the credential and send it to your server if needed

    // Redirect to /users after successful login
    navigate('/users');
  };

  // Handle the error response from Google login
  const handleLoginError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Sign In</h2>
        
        {/* Google OAuth Provider wrapping GoogleLogin */}
        <GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap
            theme="outline"
            size="large"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SignInPage;
