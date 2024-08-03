'use client'

import { useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Container, CssBaseline, Box, TextField, Button, Typography, Link } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/firebaseConfig';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
});

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({res})
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
            {error && <Typography color="error">{error.message}</Typography>}
            <Box mt={2}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/sign-in" variant="body2">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
