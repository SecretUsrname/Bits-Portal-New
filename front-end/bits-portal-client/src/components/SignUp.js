import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useHistory } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; // Correct named import
import '../assets/styles/SignUp.css';

function SignUp() {
  const history = useHistory();
  const clientId = "526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com";

  const showUserInformation = (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const userInfo = jwtDecode(token); // Use jwtDecode
      console.log("User Info:", userInfo);
      
      // Store token in localStorage or session
      localStorage.setItem("authToken", token);
      
      // Redirect to another page after successful login
      history.push("/Home");
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  return (
    <div className="SignUp">
      <GoogleOAuthProvider clientId={clientId}>
        <div className="login-container">
          <GoogleLogin
            onSuccess={showUserInformation}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}

export default SignUp;