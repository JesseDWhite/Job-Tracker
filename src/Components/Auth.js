import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@firebase/auth';
import { auth } from '../firebase';

const Auth = () => {

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [method, setMethod] = useState(false);

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
    } catch (error) {
      console.log(error.message);
    }

  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <Grid
        container
        spacing={5}
      >
        <Grid
          item
          sm={12}
        >
          {method ?
            <Grid>
              <TextField
                sx={{
                  mb: 5
                }}
                fullWidth
                label='Email'
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <TextField
                sx={{
                  mb: 5
                }}
                fullWidth
                label='Password'
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <Button
                fullWidth
                color='secondary'
                variant='contained'
                onClick={register}
              >
                Create User
              </Button>
            </Grid>
            :
            <Grid>
              <TextField
                sx={{
                  mb: 5
                }}
                fullWidth
                label='Email'
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <TextField
                sx={{
                  mb: 5
                }}
                fullWidth
                label='Password'
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant='contained'
                onClick={login}
              >
                Sign In
              </Button>
            </Grid>
          }
        </Grid>
        <Grid
          container
          item
        >
          <FormControlLabel
            label='Register New Account'
            control={
              <Switch
                fullWidth
                size='large'
                color='secondary'
                onClick={() => setMethod(!method)}
              />
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Auth;