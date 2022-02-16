/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,

  Box
} from '@mui/material';
import { THEME } from '../Constants/Theme';

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser,
    themeMode
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
    <Box>
      <Card
        elevation={3}
        sx={{
          maxWidth: 500,
          minHeight: 500,
          p: 3,
          background: THEME[themeMode].card,
          color: THEME[themeMode].textColor
        }}
        container
      >
        <CardMedia
          sx={{
            borderRadius: '100%',
            width: 200,
            objectFit: 'contain',
            mr: 'auto',
            ml: 'auto',
            textAlign: 'center'
          }}
          component='img'
          alt='user profile photo'
          image={user?.photoURL.replace('s96-c', 's400-c')}
        />
        <CardContent>
          <Typography
            gutterBottom
            component='div'
            sx={{ textAlign: 'center' }}
          >
            <Chip
              sx={{ px: 3, fontSize: '1rem' }}
              label={currentUser.role}
              color='info'
              variant='contained'
            />
          </Typography>
          <Typography
            gutterBottom
            variant='h3'
            component='div'
            sx={{ textAlign: 'center' }}
          >
            {currentUser.name}
          </Typography>
          <hr />
          <Typography
            sx={{ textAlign: 'center', fontSize: '1.25rem' }}
            gutterBottom
            component='div'
          >
            Advisor: {currentUser.advisor}
          </Typography>
          <Typography
            sx={{ textAlign: 'center', fontSize: '1.25rem' }}
            gutterBottom
            component='div'
          >
            Cohort: {currentUser.cohort}
          </Typography>
          <Typography
            sx={{ textAlign: 'center', fontSize: '1.25rem' }}
            gutterBottom
            variant='h5'
            component='div'
          >
            {`Average Score: ${average > 0 ? average : 0}/100`}
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
    </Box>
  )
}

export default Profile;