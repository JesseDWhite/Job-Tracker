import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Box,
  Badge
} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchBar from '../Components/SearchBar';
import { THEME } from './Theme';
import { format } from 'date-fns';

const Header = (props) => {

  const {
    user,
    jobs,
    setSearchJobs,
    viewProfile,
    setViewProfile,
    themeMode,
    currentUser,
    updatePreferrdTheme,
    loading,
  } = props;

  const [dailyFilter, setDailyFilter] = useState(false);

  const [notificationFilter, setNotificationFilter] = useState(false);

  const [progress, setProgress] = useState(0);

  const [progressColor, setProgressColor] = useState('info');

  const [notifications, setNotifications] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  //Only show job apps that have been added today.
  useEffect(() => {
    const newJobs = [...jobs];
    if (dailyFilter) {
      const todaysDate = format(new Date(), 'yyyy-MM-dd');
      const todaysJobs = newJobs.filter(job => job.dateApplied === todaysDate);
      setSearchJobs(todaysJobs);
    } else {
      setSearchJobs(newJobs);
    }
  }, [dailyFilter]);

  //Only show jobs apps that have unread messages on them.
  useEffect(() => {
    const newJobs = [...jobs];
    if (notificationFilter) {
      const unreadJobs = newJobs.filter(job => job.unreadMessages > 0 && job.lastResponseFrom !== user.uid);
      setSearchJobs(unreadJobs);
    } else {
      setSearchJobs(newJobs);
    }
  }, [notificationFilter])

  //Set the loading bar progress depending on the state of loading. Totally fake bar, don't believe it.
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

  //Get the total number of notifications if there are any for the user.
  useEffect(() => {
    let newTotal = 0;
    const newJobs = [...jobs];
    if (newJobs.some(job => job.unreadMessages > 0 && job.lastResponseFrom !== user.uid)) {
      const filteredJobs = newJobs.filter(job => job.unreadMessages > 0 && job.lastResponseFrom !== user.uid);
      if (filteredJobs.length > 1) {
        filteredJobs.forEach(job => { newTotal += job.unreadMessages; })
      } else if (filteredJobs.length === 1) {
        newTotal = filteredJobs[0].unreadMessages;
      }
      setNotificationCount(newTotal);
      setNotifications(true);
    } else {
      setNotificationCount(newTotal);
      setNotifications(false);
    }
  }, [jobs]);

  const renderThemeButton = () => {
    let button = <NightsStayIcon />;
    if (themeMode === 'darkMode') button = <DarkModeIcon sx={{ color: 'white' }} />;
    if (themeMode === 'dorkMode') button = <LightModeIcon sx={{ color: 'white' }} />;
    return button;
  }

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
      > {user?.email &&
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
                <Grid
                  container
                  justifyContent='start'
                  sx={{
                    position: 'absolute',
                    top: 0,
                    ml: 2.5
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
            <IconButton
              onClick={() => notifications ? setNotificationFilter(!notificationFilter) : setNotificationFilter(false)}
              sx={{
                mr: 2
              }}
            >
              {notifications
                ?
                <Badge badgeContent={notificationCount} color='error' overlap='circular'>
                  <NotificationsRoundedIcon />
                </Badge>
                : <NotificationsNoneRoundedIcon />
              }
            </IconButton>
            <IconButton sx={{ mr: 3 }} onClick={() => updatePreferrdTheme(currentUser.id)}>
              {renderThemeButton()}
            </IconButton>
            <Chip
              avatar={
                <Avatar
                  src={user?.photoURL}
                />}
              variant={THEME[themeMode].buttonStyle}
              label={viewProfile ? 'Go Back' : currentUser?.name}
              clickable
              onClick={() => ((setViewProfile(!viewProfile), window.scrollTo(0, 0)))}
            />
          </Grid>
        </Grid>
        }
        <Box
          sx={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 10,
            opacity: loading ? 1 : 0,
            transition: 'color .5s, background .5s, opacity 2s',
          }}>
          <LinearProgress variant="determinate" value={progress} color={progressColor} />
        </Box>
      </Grid>
    </Box>
  );
}

export default Header;