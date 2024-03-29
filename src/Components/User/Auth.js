import React, { useState } from 'react';
import {
  Grid,
  Button,
  Typography
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@firebase/auth';
import { auth, signInWithGoogle } from '../../firebase';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';

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
    <Grid
      container
      spacing={5}
    >
      <Grid
        item
        sm={12}
      >
        <Grid>
          <Typography
            variant='h3'
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              fontSize: '500%',
              textShadow: 'rgb(10,25,41) -8px 0px 0px',
              color: 'lightgray'
            }}
          >
            WELCOME
          </Typography>
          <Button
            sx={{
              mt: 3
            }}
            startIcon={<PersonOutlineTwoToneIcon />}
            fullWidth
            variant='contained'
            onClick={signInWithGoogle}
          >
            Sign In With Google
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Auth;