'use client'

import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, Alert } from '@mui/material';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // Track custom login errors

  const [signInWithEmailAndPassword, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignin = async (event) => {
    event.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);

      if (res && res.user) {
        console.log({ res });
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        setLoginError('');
        router.push('/');
      } else {
        console.error("Failed to log in: No user returned.");
        setLoginError('Failed to log in: No user returned.');
      }
    } catch (e) {
      console.error("Login error:", e.message);
      setLoginError(e.message);
    }
  };

  return (
    <Box
      bgcolor='transparent'
      minHeight='100vh'
      display='flex'
      alignItems='center'
      sx={{ background: 'linear-gradient(to top right, #240046, #9d4edd)' }}
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
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSignin} sx={{ mt: 3 }}>
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
                  color: '#ff9e00',
                },
              }}
              disabled={loading}
            >
              Sign In
            </Button>

            {/* Error Message Display */}
            {(loginError || error) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {loginError || error.message}
              </Alert>
            )}

            <Box mt={2}>
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" variant="body2" color="#ff9100">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignIn;
