import React, { useState } from 'react';
import './Login.css';
import axios from 'axios'; // Import axios
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import GoogleOAuthProvider and GoogleLogin
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/bitlogo.jpg";


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State to handle error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log('Form submitted:', response.data);
      if (response.status === 200) {
        window.location.href = '/dashboard'; // Redirect to the dashboard page
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password")
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    var credentialResponse =jwtDecode(credentialResponse.credential);
   console.log(credentialResponse);
   window.location.href = '/dashboard'; 

  };

  const handleGoogleLoginFailure = () => {
    console.log('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId="500810333798-e4ae6tq6j09dp1f57s15r54ng086qtd1.apps.googleusercontent.com"> {/* Replace with your Google client ID */}
      <div className='firstlogin'>
        <div className="login">
        <img src={logo} alt='' className='bitlogo'></img>
          <h3>Admin Login</h3>
          <p style={{textAlign:'center'}}>Welcome to the Material transaction </p> <p style={{textAlign:'center'}}>portal, You will be able to explore new things and </p>
          <p style={{textAlign:'center',marginBottom:'25px'}}> learn interesting topics over provided materials </p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input type="submit" value="Login" />
          </form>
          <p id="instead">Or continue with google instead</p> {/* Added paragraph */}
         <div className='google'>
         <GoogleLogin
          
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          /> 
          </div> 
          {error && <p className="error">{error}</p>}
        </div>
       
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;