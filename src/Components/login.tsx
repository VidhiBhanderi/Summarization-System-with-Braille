import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import LoadingScreen from '../Components/Loading';
// import { isEmailValid, isPasswordValid } from '../validation';

export default function Login() {

  const Naviagte  = useNavigate();
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
  const [loading,setloading] = useState(false);

  const handleSubmit = async(event: any) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setloading(true);
      const response = await axios.post(`http://localhost:8000/login`, {
        email: email,
        password: password
      });
      if (response.status === 200) {
        const { message, name } = response.data;
        if (name) {
          sessionStorage.setItem('User', name);
          Naviagte("/Translator");
        }  
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          // Unauthorized error
          window.alert('Invalid credentials. Please try again.'); 
          setloading(false) 
          } else {
          // Other errors
          console.error('Error occurred:', axiosError);
        }
      } else {
        // Network or other errors
        console.error('Network or other error occurred:', error);
      }
    }
  }

  return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'cover' }}>
            {/* {loading && <LoadingScreen/>} */}
            <CssBaseline />
            <Paper elevation={6} square style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width:'30vw',
                        padding:'20px'
                    }}
                >
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <LoginOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name='email'
                            label="Email Address"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name='password'
                            label="Password"
                            type="password"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                            Sign In
                        </Button>
                    </Box>
                    <Button href='/Register' sx={{ mt: 2 }}>
                        Don't Have An Account? Register
                    </Button>
                </Box>
            </Paper>
        </div>
  );
}