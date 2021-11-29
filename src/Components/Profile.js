import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import {
  Button,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { AnimateKeyframes } from 'react-simple-animate';

const Profile = (props) => {

  const {
    user,
    logout,
  } = props;

  return (
    <>
      <Card
        elevation={3}
        sx={{
          maxWidth: 500,
          minHeight: 500,
          pl: 3,
          pr: 3,
          pt: 3,
          textAlign: 'center'
        }}
        container
      >
        <CardMedia
          sx={{
            borderRadius: '100%',
            width: 200,
            objectFit: 'contain',
            mr: 'auto',
            ml: 'auto'
          }}
          component='img'
          alt='user profile photo'
          image={user?.photoURL}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h3'
            component='div'
          >
            {user?.displayName}
          </Typography>
          <Typography
            gutterBottom
            variant='h4'
            component='div'
          >
            {user?.email}
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
          >
            Member Since: {user?.metadata.creationTime
              ? format(new Date(user?.metadata.creationTime.replace(/-/g, '\/')), 'PPP')
              : null
            }
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant='contained'
            color='error'
            onClick={logout}
          >
            Sign Out
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

export default Profile;