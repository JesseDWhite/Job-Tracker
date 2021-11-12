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
import Header from './Header';

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

  const fileInput = useRef();

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
    setSearchJobs(newSearchJobs);
    setJobs(newSearchJobs);
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  }

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

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
      if (appDate === todaysDate) {
        setApplicationCount(prevState => prevState += 1);
      }
    });
  }

  const readFile = (file) => {
    file = document.getElementById('coverLetter').files[0];
    // const URLObject = URL.createObjectURL(file);
    return console.log(file.text());
  }

  useEffect(() => {
    getJobs();
  }, []);

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
        <Grid
          sm={8}
          sx={{
            m: 3,
          }}
        >
          {/* <Grid
            container
            direction="row"
            justifyContent="center"
          >
            <SearchBar
              jobs={jobs}
              setSearchJobs={setSearchJobs}
            />
          </Grid> */}
          <Grid>
            <MasterList
              cardView={cardView}
              editing={editing}
              setEditing={setEditing}
              jobs={searchJobs}
              setJobs={setJobs}
              searchJobs={searchJobs}
              setSearchJobs={setSearchJobs}
              getJobs={getJobs}
            />
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
              // maxWidth: '30vw',
              // position: 'fixed',
            }}
          >
            <Typography
              variant='h5'
              sx={{
                textAlign: 'center'
              }}
            >
              {applicationCount} Applications Today
            </Typography>
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
      />
    </>
  );
};

export default Home;