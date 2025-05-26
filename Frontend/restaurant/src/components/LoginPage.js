import React, { useState } from 'react';

const LoginPage = () => {
  
  const loginWithGitHub = async () => {
    window.location.href = "http://localhost:5128/login"; 
};

const signUpWithGitHub = async () => {
    window.location.href = "http://localhost:5128/login"; 
};

  return (
    <div className="container">
      <h2 className="text-center my-4">Login with GitHub</h2>
      <div className="text-center">
        <button className="btn btn-primary" onClick={loginWithGitHub}>
          Login with GitHub
        </button>
        <h2 className="text-center my-4">or</h2>
        <button className="btn btn-primary" onClick={signUpWithGitHub}>
          Sign Up with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
