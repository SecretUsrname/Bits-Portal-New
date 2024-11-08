import React, { Component } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

<GoogleOAuthProvider clientId="526314418933-ai3uvq89emkiod12khrhn040vittie77.apps.googleusercontent.com">
    <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
</GoogleOAuthProvider>;

export default GoogleOauth.js;