import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Box,
} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from '../Components/SearchBar';
import { THEME } from './Theme';
import { format } from 'date-fns';

const Header = (props) => {

  const {
    user,
    sortByName,
    sortByDate,
    sort,
    jobs,
    setSearchJobs,
    applicationCount,
    viewProfile,
    setViewProfile,
    themeMode,
    currentUser,
    updatePreferrdTheme,
    loading
  } = props;

  const [filter, setFilter] = useState(false);

  const [progress, setProgress] = useState(0);

  const [progressColor, setProgressColor] = useState('info');

  useEffect(() => {
    const newJobs = [...jobs];
    if (filter) {
      const todaysDate = format(new Date(), 'yyyy-MM-dd');
      const todaysJobs = newJobs.filter(job => job.dateApplied === todaysDate);
      setSearchJobs(todaysJobs);
    } else {
      setSearchJobs(newJobs);
    }
  }, [filter]);


  useEffect(() => {
    if (!loading) {
      setProgress(100);
      setTimeout(() => { setProgressColor('primary') }, 500);
    }
    while (loading) {
      const timer = setInterval(() => {
        setProgress(oldProgress => {
          let buffer = 25;
          if (oldProgress > 60 && oldProgress < 80) {
            buffer = 5;
          } else if (oldProgress > 80) {
            buffer = 1;
          }
          const diff = Math.random() * buffer;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);
      return () => {
        clearInterval(timer);
      };
    }
  }, [loading]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid
        sx={{
          transition: 'color .5s, background .5s',
          backgroundColor: THEME[themeMode].header,
          width: '100%',
          height: 70,
          color: 'white',
          position: 'fixed',
          top: 0,
          py: 2,
          filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.150))',
          cursor: 'default',
          zIndex: 10,
        }}
      > {user?.email ?
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems='center'
            sx={{
              position: 'relative'
            }}
          >
            {viewProfile
              ? <Typography variant='h3'
                sx={{
                  fontSize: '2rem',
                  transition: 'color .5s, background .5s',
                  color: THEME[themeMode].textColor,
                  mx: 1
                }}>
                My Profile
              </Typography>
              :
              <Grid>
                <Chip
                  sx={{
                    zIndex: 10,
                    ml: 2
                  }}
                  color='secondary'
                  variant={themeMode === 'darkMode' ? 'outlined' : 'contained'}
                  onClick={() => applicationCount >= 1 ? setFilter(!filter) : setFilter(false)}
                  label={filter ? 'GO BACK' : applicationCount === 1 ? 'APPLICATION TODAY' : 'APPLICATIONS TODAY'}
                  avatar={<Avatar>{applicationCount}</Avatar>}
                />
                <Button
                  sx={{
                    ml: 5,
                    zIndex: 10
                  }}
                  variant='text'
                  color='secondary'
                  onClick={() => sort ? sortByDate() : sortByName()}>
                  SORTED BY: {sort ? 'NAME A-Z' : 'MOST RECENT'}
                </Button>
                <Grid
                  container
                  justifyContent='center'
                  sx={{
                    position: 'absolute',
                    top: 0
                  }}
                >
                  <SearchBar
                    themeMode={themeMode}
                    jobs={jobs}
                    setSearchJobs={setSearchJobs}
                  />
                </Grid>
              </Grid>
            }
          </Grid>
          <Grid
            sx={{
              position: 'fixed',
              right: 15,
              top: 15
            }}
          >
            <IconButton sx={{ mr: 3 }} onClick={() => updatePreferrdTheme(currentUser.id)}>
              {themeMode === 'darkMode'
                ? <LightModeIcon sx={{ color: 'white' }} />
                : <NightsStayIcon />
              }
            </IconButton>
            <Chip
              avatar={
                <Avatar
                  src={user?.photoURL}
                />}
              variant={themeMode === 'darkMode' ? 'outlined' : 'contained'}
              label={viewProfile ? 'Go Back' : user?.displayName}
              clickable
              onClick={() => ((setViewProfile(!viewProfile), window.scrollTo(0, 0)))}
            />
          </Grid>
        </Grid>
        : null
        }
        <Box
          sx={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 10,
          }}>
          <LinearProgress variant="determinate" value={progress} color={progressColor} />
        </Box>
      </Grid>
    </Box>
  );
}

export default Header;