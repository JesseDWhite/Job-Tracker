import React from 'react';
import {
  Grid,
  Button,
  Typography,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import SearchBar from './SearchBar';

const Header = (props) => {

  const {
    user,
    logout,
    sortByName,
    sortByDate,
    cardView,
    setCardView,
    sort,
    jobs,
    setSearchJobs,
    applicationCount,
    setApplicationCount,
  } = props;

  return (
    <>
      <Grid
        sx={{
          backgroundColor: '#ECECEC',
          width: '100%',
          height: 70,
          color: 'white',
          position: 'fixed',
          top: 0,
          p: 2,
          filter: 'drop-shadow(0px 5px 25px rgba(0, 0, 0, 0.300))'
        }}
      > {user?.email ?
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="start"
          >
            <SearchBar
              jobs={jobs}
              setSearchJobs={setSearchJobs}
            />
            <Button
              sx={{
                mr: 5,
                ml: 3
              }}
              variant='text'
              color='secondary'
              onClick={() => setCardView(!cardView)}>
              View By: {cardView ? 'CARD' : 'LIST'}
            </Button>
            <Button
              sx={{
                mr: 5
              }}
              variant='text'
              color='secondary'
              onClick={() => sort ? sortByDate() : sortByName()}>
              SORT BY: {sort ? 'NAME A-Z' : 'DATE APPLIED'}
            </Button>
            <Typography
              sx={{
                mt: .85,
                fontSize: '.90em',
                color: '#9C27B0'
              }}
            >
              {user?.email ? `APPLLICATIONS TODAY: ${applicationCount}` : null}
            </Typography>
          </Grid>
          <Grid
            sx={{
              position: 'fixed',
              right: 15,
              top: 15
            }}
          >
            <Tooltip
              title='Sign Out'
            >
              <Chip
                avatar={
                  <Avatar
                    src={localStorage.getItem('profilePic')}
                  />}
                label={localStorage.getItem('name')}
                clickable
                onClick={logout}
              />
            </Tooltip>
          </Grid>
        </Grid>
        : <Typography
          variant='h5'
          sx={{
            color: 'black'
          }}
        >
          WELCOME
        </Typography>
        }
      </Grid>
    </>
  )
}

export default Header;