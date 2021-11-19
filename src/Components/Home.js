import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import MasterList from './MasterList';
import { format } from 'date-fns';
import Auth from './Auth';
import {
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { auth } from '../firebase';
import Header from './Header';
import Doc from '../Constants/Test2.docx';
import Doc2 from '../Constants/Test.pdf';
import { WordExtractor } from 'word-extractor';
import axios from 'axios';
import mammoth from 'mammoth';
import { Buffer } from 'buffer';
import strCompare from 'str-compare';
import extractor from 'unfluff';
import Scraper from 'webscrape';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [cardView, setCardView] = useState(true);

  const [formValues, setFormValues] = useState();

  const [editing, setEditing] = useState(false);

  const [applicationCount, setApplicationCount] = useState(0);

  const [user, setUser] = useState({});

  const [sort, setSort] = useState(false);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const getJobs = async () => {
    const data = await getDocs(jobsReference);
    const newSearchJobs = data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    }));

    newSearchJobs.sort((a, b) => {
      const newA = a.dateApplied;
      const newB = b.dateApplied;
      if (newA < newB) {
        return 1;
      }
      if (newA > newB) {
        return -1;
      }
      return 0;
    })
    setSearchJobs(getFilteredApplications(newSearchJobs));
    setJobs(getFilteredApplications(newSearchJobs));
  }

  const getFilteredApplications = (jobs) => {
    const filteredView = jobs.filter(job => job.user.includes(user?.uid));
    return filteredView;
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  }

  const sortByDate = () => {
    const newJobs = [...searchJobs];
    const sortedByDate = newJobs.sort((a, b) => {
      const newA = a.dateApplied;
      const newB = b.dateApplied;
      if (newA < newB) {
        return 1;
      }
      if (newA > newB) {
        return -1;
      }
      return 0;
    })
    setSearchJobs(sortedByDate);
    setSort(!sort);
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByName = newJobs.sort((a, b) => {
      const newA = a.company.toLowerCase();
      const newB = b.company.toLowerCase();
      if (newA < newB) {
        return -1;
      }
      if (newA > newB) {
        return 1;
      }
      return 0;
    })
    setSearchJobs(sortedByName);
    setSort(!sort);
  }

  const getApplicationTotal = () => {
    const newJobs = [...jobs];
    setApplicationCount(0);
    const todaysDate = format(new Date(), 'yyyy-MM-dd');
    newJobs.map(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '\/')), 'yyyy-MM-dd');
      if (appDate === todaysDate && job.user === user?.uid) {
        setApplicationCount(prevState => prevState += 1);
      }
    });
  }

  useEffect(() => {
    getJobs();
  }, [user]);

  useEffect(() => {
  }, [cardView])

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs])

  return (
    <>
      <Grid
        display='flex'
        sx={{
          mt: 10
        }}
      >
        {/* <input
          type='file'
          accept='.doc,.docx,application/msword,application/pdf'
          ref={fileInput}
          onChange={readTextFile}
          name='coverLetter'
          id='coverLetter'
        /> */}
        <Grid
          sm={8}
          sx={{
            m: 3,
          }}
        >
          <Grid>
            {user?.email ?
              <MasterList
                cardView={cardView}
                editing={editing}
                setEditing={setEditing}
                jobs={searchJobs}
                setJobs={setJobs}
                searchJobs={searchJobs}
                setSearchJobs={setSearchJobs}
                getFilteredApplications={getFilteredApplications}
              />
              : null
            }
          </Grid>
        </Grid>
        <Grid
          sm={4}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              mr: 3,
            }}
          >
            {!user?.email ?
              <Auth />
              : <NewJob
                jobsReference={jobsReference}
                getJobs={getJobs}
                editing={editing}
                setEditing={setEditing}
                formValues={formValues}
                setFormValues={setFormValues}
                jobs={jobs}
                setJobs={setJobs}
                searchJobs={searchJobs}
                setSearchJobs={setSearchJobs}
                user={user}
              />
            }
          </Paper>
        </Grid>
      </Grid>
      <Header
        user={user}
        logout={logout}
        sortByDate={sortByDate}
        sortByName={sortByName}
        cardView={cardView}
        setCardView={setCardView}
        sort={sort}
        setSort={setSort}
        jobs={jobs}
        setSearchJobs={setSearchJobs}
        applicationCount={applicationCount}
        setApplicationCount={setApplicationCount}
      />
    </>
  );
};

export default Home;