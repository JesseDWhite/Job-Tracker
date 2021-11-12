import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from '@firebase/auth';
import { auth } from '../firebase';

const Auth = (props) => {

  const {
    user,
    setUser
  } = props;

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // onAuthStateChanged(auth, (currentUser) => {
  //   setUser(currentUser);
  // });

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

  const logout = async () => {
    await signOut(auth);
  }

  return (
    <>
      <Grid
        container
      >
        <Grid>
          <TextField
            fullWidth
            label='Email'
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label='Password'
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant='contained'
            onClick={register}
          >
            Create User
          </Button>
        </Grid>
        <Grid>
          <TextField
            fullWidth
            label='Email'
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <TextField
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
      </Grid>
    </>
  )
}

export default Auth;