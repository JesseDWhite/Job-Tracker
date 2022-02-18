import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signInWithGoogle } from '../firebase';
import GoogleIcon from '@mui/icons-material/Google';

const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.jessedwhite.com">
        Jesse White
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const SignIn = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/1900x900/?coding)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'grey',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: 'none'
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: '25%',
              mb: '25%',
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Button
                fullWidth
                onClick={signInWithGoogle}
                variant="contained"
                sx={{ mt: 3, mb: 5, px: 10 }}
                startIcon={<GoogleIcon />}
              >
                Sign In With Google
              </Button>
              <Grid container>
                <Grid item>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Don't have an account? One will be created for you when you sign in.
                  </Typography>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignIn;