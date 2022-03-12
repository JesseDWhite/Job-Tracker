import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
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
    open,
    setOpen,
    themeMode,
    currentUser,
    updatePreferrdTheme
  } = props;

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    const newJobs = [...jobs];
    if (filter) {
      const todaysDate = format(new Date(), 'yyyy-MM-dd');
      const todaysJobs = newJobs.filter(job => job.dateApplied === todaysDate);
      setSearchJobs(todaysJobs);
    } else {
      setSearchJobs(newJobs);
    }
  }, [filter])

  return (
    <Grid
      sx={{
        transition: 'color .5s, background .5s',
        backgroundColor: THEME[themeMode].header,
        width: '100%',
        height: 70,
        color: 'white',
        position: 'fixed',
        top: 0,
        p: 2,
        filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.200))',
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
                  zIndex: 10
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
            top: 18
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
            onClick={() => setViewProfile(!viewProfile)}
          />
        </Grid>
      </Grid>
      :
      <Grid>
        <Grid
          container
          direction="row"
          justifyContent="start"
        >
          <Typography
            variant='h5'
            sx={{
              color: 'black'
            }}
          >
            WELCOME
          </Typography>
          <Grid
            sx={{
              position: 'fixed',
              right: 15,
              top: 18
            }}
          >
            <Chip
              avatar={
                <Avatar
                  src={user?.photoURL}
                />}
              label='Sign In'
              clickable
              onClick={() => setOpen(!open)}
            />
          </Grid>
        </Grid>
      </Grid>
      }
    </Grid>
  );
}

export default Header;