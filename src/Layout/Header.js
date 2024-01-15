import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Box,
  Badge,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuList,
  Fade
} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchBar from '../Components/SearchBar';
import { THEME } from './Theme';
import { format } from 'date-fns';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {
  MenuRounded,
} from '@mui/icons-material';

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
    logout
  } = props;

  const [dailyFilter, setDailyFilter] = useState(false);

  const [notificationFilter, setNotificationFilter] = useState(false);

  const [progress, setProgress] = useState(0);

  const [progressColor, setProgressColor] = useState('info');

  const [notifications, setNotifications] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const getWindowDimensions = () => {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }

  const { width } = useWindowDimensions();

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
    setProgress(0);
    setProgressColor('info');
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
          } else if (oldProgress >= 80) {
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
    let message = 'dark mode'
    let button = <NightsStayIcon />
    if (themeMode === 'darkMode') {
      button = <DarkModeIcon sx={{ color: 'white' }} />
      message = 'underdark mode'
    };
    if (themeMode === 'dorkMode') {
      button = <LightModeIcon sx={{ color: 'white' }} />
      message = 'light mode'
    };
    return (
      <Tooltip placement='bottom' title={message} disableInteractive>
        <IconButton sx={{ mr: 3 }} onClick={() => updatePreferrdTheme(currentUser.id)}>
          {button}
        </IconButton>
      </Tooltip>
    );
  }

  const renderThemeMenuButton = () => {
    let button = <NightsStayIcon />
    if (themeMode === 'darkMode') button = <DarkModeIcon sx={{ color: 'white' }} />
    if (themeMode === 'dorkMode') button = <LightModeIcon sx={{ color: 'white' }} />
    return button;
  }

  const renderMenu = () => {
    return (
      <PopupState variant="popover">
        {(popupState) => (
          <Box>
            <IconButton
              id='options-button'
              aria-label='options'
              {...bindTrigger(popupState)}
            >
              {notifications
                ? <Badge color='error' variant='dot'>
                  <MenuRounded />
                </Badge>
                : <MenuRounded />
              }
            </IconButton>
            <Menu
              id='options-menu'
              anchorEl='options-button'
              MenuListProps={{
                'aria-labelledby': 'options-button'
              }}
              {...bindMenu(popupState)}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 500 }}
              onClose={() => popupState.close()}
            >
              <MenuList>
                <MenuItem>
                  <Chip
                    avatar={
                      <Avatar
                        src={user?.photoURL}
                      />}
                    variant={THEME[themeMode].buttonStyle}
                    label={viewProfile ? 'Go Back' : currentUser?.name}
                    clickable
                    onClick={() => ((setViewProfile(!viewProfile), window.scrollTo(0, 0), popupState.close()))}
                  />
                </MenuItem>
                <MenuItem onClick={() => ((updatePreferrdTheme(currentUser.id), popupState.close()))}>
                  <ListItemIcon>
                    {renderThemeMenuButton()}
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Theme
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem
                  onClick={() => notifications ? ((setNotificationFilter(!notificationFilter), popupState.close())) : ((setNotificationFilter(false), popupState.close()))}

                >
                  <ListItemIcon>
                    {notifications
                      ?
                      <Badge badgeContent={notificationCount} color='error' overlap='circular'>
                        <NotificationsRoundedIcon />
                      </Badge>
                      : <NotificationsNoneRoundedIcon />
                    }
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Notifications
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )
        }
      </PopupState>
    )
  };

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
                    width={width}
                  />
                </Grid>
              </Grid>
            }
          </Grid>
          {width < 600
            ? <Grid
              sx={{
                position: 'fixed',
                right: 15,
                top: 15
              }}
            >
              {renderMenu()}
            </Grid>
            : <Grid
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
              {renderThemeButton()}
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
          }
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