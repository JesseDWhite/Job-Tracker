import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Box
} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from './SearchBar';
import { THEME } from '../Constants/Theme';
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
    setThemeMode
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
    <>
      <Grid
        sx={{
          backgroundColor: THEME[themeMode].header,
          width: '100%',
          height: 70,
          color: 'white',
          position: 'fixed',
          top: 0,
          p: 2,
          filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.200))',
        }}
      > {user?.email ?
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems='center'
          >
            {viewProfile
              ? <Typography variant='h3' sx={{
                fontSize: '2rem',
                color: THEME[themeMode].textColor,
                mx: 1
              }}>
                My Profile
              </Typography>
              :
              <>
                <Chip
                  sx={{
                    background: 'linear-gradient(270deg, rgb(69, 69, 255), rgb(221, 192, 255))',
                  }}
                  color='secondary'
                  variant='contained'
                  onClick={() => applicationCount >= 1 ? setFilter(!filter) : setFilter(false)}
                  label={filter ? 'GO BACK' : applicationCount === 1 ? 'APPLICATION TODAY' : 'APPLICATIONS TODAY'}
                  avatar={<Avatar>{applicationCount}</Avatar>}
                />
                <Button
                  sx={{
                    mx: 5,
                  }}
                  variant={THEME[themeMode].buttonStyle}
                  color='secondary'
                  onClick={() => sort ? sortByDate() : sortByName()}>
                  SORTED BY: {sort ? 'NAME A-Z' : 'DATE APPLIED'}
                </Button>
                <SearchBar
                  themeMode={themeMode}
                  jobs={jobs}
                  setSearchJobs={setSearchJobs}
                />
              </>
            }
          </Grid>
          <Grid
            sx={{
              position: 'fixed',
              right: 15,
              top: 18
            }}
          >
            {/* dark mode and light mode toggle */}

            {/* <IconButton sx={{ mr: 3 }} onClick={() => themeMode === 'darkMode' ? setThemeMode('lightMode') : setThemeMode('darkMode')}>
              {themeMode === 'darkMode'
                ? <LightModeIcon sx={{ color: 'white' }} />
                : <NightsStayIcon />
              }
            </IconButton> */}

            <Chip
              avatar={
                <Avatar
                  src={user?.photoURL}
                />}
              color={THEME[themeMode].chipColor}
              label={viewProfile ? 'Go Back' : 'My Profile'}
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
    </>
  )
}

export default Header;