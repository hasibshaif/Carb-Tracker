'use client'

import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, Alert } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const [createUserWithEmailAndPassword, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== retypePassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res && res.user) { 
        console.log({ res });
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        setRetypePassword('');
        setPasswordError('');
        router.push('/');
      }
    } catch (e) {
      console.error('Failed to sign up:', e);
    }
  };

  return (
    <Box 
      bgcolor='transparent' 
      minHeight='100vh' 
      display='flex' 
      alignItems= 'center' 
      sx={{background: 'linear-gradient(to top right, #240046, #9d4edd)'}}
    >      
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" color="#3c096c" fontWeight={550}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="retype-password"
              label="Retype Password"
              type="password"
              id="retype-password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                backgroundColor: '#ff9e00', 
                color: '#9d4edd', 
                fontWeight: 900, 
                '&:hover': { 
                  backgroundColor: '#9d4edd', 
                  color: '#ff9e00'
                }}}
              disabled={loading}
            >
              Sign Up
            </Button>

            {}
            {passwordError && <Alert severity="error" sx={{ mt: 2 }}>{passwordError}</Alert>}

            {}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>}

            <Box mt={2}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/sign-in" variant="body2" color="#ff9100">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp;
