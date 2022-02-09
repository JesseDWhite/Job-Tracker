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

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser
  } = props;

  const [average, setAverage] = useState(0);

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
          p: 3,
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
            {currentUser.name}
          </Typography>
          <hr />
          <Typography
            gutterBottom
            component='div'
          >
            <Chip
              label={currentUser.email}
              color='info'
              variant='contained'
            />
          </Typography>
          <Typography
            gutterBottom
            component='div'
          >
            Role: {currentUser.role}
          </Typography>
          <Typography
            gutterBottom
            component='div'
          >
            Advisor: {currentUser.advisor}
          </Typography>
          <Typography
            gutterBottom
            component='div'
          >
            Cohort: {currentUser.cohort}
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
          >
            {currentUser.signedUpOn
              ? `Average Score As Of ${format(new Date(currentUser.signedUpOn.replace(/-/g, '\/')), 'PP')}: ${average > 0
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