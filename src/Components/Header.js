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
    viewProfile,
    setViewProfile,
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
            <SearchBar
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
            <Chip
              avatar={
                <Avatar
                  src={user?.photoURL}
                />}
              label={viewProfile ? 'Go Back' : 'My Profile'}
              clickable
              onClick={() => setViewProfile(!viewProfile)}
            />
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