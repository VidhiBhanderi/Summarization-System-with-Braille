import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import { IconButton, Paper } from '@mui/material';
import { AddPhotoAlternateRounded } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { isEmailValid,isPasswordValid,isPhoneNumberValid } from '../validation';

export default function Register() {
  const [selectedFile, setSelectedFile] = useState(null);
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
  const Home = useNavigate();

  //on Selecting Profile Picture
  const handleFileChange = (event : any) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // On Submit
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // Getting Values For Check
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmpassword = event.target.confirmpassword.value;
    // Validate email, phone number, and password
    // if (!isEmailValid(email)) {
    //   alert('Please enter a valid email address');
    //   return;
    // }

    // if (!isPhoneNumberValid(phone)) {
    //   alert('Please enter a valid phone number');
    //   return;
    // }

    // if (!isPasswordValid(password)) {
    //   alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    //   return;
    // }

    if(password !== confirmpassword){
      alert("Both Passowrd Is Not Same");
      return;
    }
    
      try {
          const response = await axios.post(`http://localhost:8000/register`,{
            name : name,
            email : email,
            password : password,
          });
    
          if (response.status === 200) {
            alert('Registration Successful');
              Home('/Login');
            // Handle successful registration
          } else {
            alert('Registration Failed');
            // Handle registration failure
          }
        } catch (error : any) {
          if (error.response && error.response.status === 409) {
            alert('Email Address is already exists');
          } else {
            console.error('Error:', error);
            alert('An error occurred while registering');
          }
        }
    };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'cover' }}>
      <CssBaseline />
      <Paper elevation={6} square style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            width:'30vw',
            padding:'0px 20px',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Avatar sx={{ alignContent: 'start', bgcolor: 'primary.main' }}>
              <LoginOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ marginLeft: '10px' }}>
              Register
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='email'
              label="Email Address"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='password'
              label="Password"
              type="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='confirmpassword'
              label="Confirm Password"
              type="password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
          <Button href='/Login' sx={{ mt: 2 }}>
            Already Have An Account? Sign In
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
