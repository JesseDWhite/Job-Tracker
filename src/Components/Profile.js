import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import EditProfile from './EditProfile';

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser
  } = props;

  const initialValues = {
    name: currentUser.name,
    email: currentUser.email,
    signedUpOn: currentUser.signedUpOn,
    advisor: currentUser.advisor,
    advisorId: currentUser.advisorId,
    cohort: currentUser.cohort,
    role: currentUser.role,
    uid: currentUser.uid
  }

  const [average, setAverage] = useState(0);

  const [editProfile, setEditProfile] = useState(false);

  const getTotalApplicationAverage = () => {
    const newJobs = [...jobs];
    setAverage(0);
    const averageToDivide = newJobs.length;
    newJobs.map(job => {
      return (
        setAverage(prevState => prevState += parseInt(job.score))
      )
    })
    setAverage(prevState => parseInt(prevState / averageToDivide));
  }

  useEffect(() => {
    getTotalApplicationAverage();
  }, []);

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
          image={user?.photoURL.replace('s96-c', 's400-c')}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h3'
            component='div'
          >
            {user?.displayName}
          </Typography>
          <hr />
          <Typography
            gutterBottom
            component='div'
          >
            <Chip
              label={user?.email}
              color='info'
              variant='contained'
            />
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
          >
            {user?.metadata.creationTime
              ? `Average Score As Of ${format(new Date(user?.metadata.creationTime.replace(/-/g, '\/')), 'PP')}: ${average > 0
                ? average : 0}/100`
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