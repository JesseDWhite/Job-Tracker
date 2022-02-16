import React from 'react';
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
import SearchBar from './SearchBar';
import { THEME } from '../Constants/Theme';

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
          filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.300))',
        }}
      > {user?.email ?
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="start"
          >
            {user?.email ? <Chip
              sx={{
                background: 'linear-gradient(270deg, rgb(69, 69, 255), rgb(221, 192, 255))',
              }}
              color='secondary'
              variant='contained'
              label={applicationCount === 1 ? 'APPLICATION TODAY' : 'APPLICATIONS TODAY'}
              avatar={<Avatar>{applicationCount}</Avatar>}
            /> : null
            }
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