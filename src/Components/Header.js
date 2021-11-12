import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Grid,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import SearchBar from './SearchBar';
import MasterList from './MasterList';
import { format } from 'date-fns';
import Auth from './Auth';
import {
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { auth } from '../firebase';

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
          filter: 'drop-shadow(0px 5px 25px rgba(0, 0, 0, 0.500))'
        }}
      > {user?.email ?
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="start"
          >
            <Button
              sx={{
                mr: 5
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
              top: 15
            }}
          >
            <Button
              variant='text'
              color='warning'
              onClick={logout}
            >
              Sign Out {user?.email}
            </Button>
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