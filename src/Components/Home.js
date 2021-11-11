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
import format from 'date-fns/format';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [cardView, setCardView] = useState(true);

  const [formValues, setFormValues] = useState();

  const [editing, setEditing] = useState(false);

  const [applicationCount, setApplicationCount] = useState(0);

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
    // getApplicationTotal();
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
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByName = newJobs.sort((a, b) => {
      const newA = a.company.toUpperCase();
      const newB = b.company.toUpperCase();
      if (newA < newB) {
        return -1;
      }
      if (newA > newB) {
        return 1;
      }
      return 0;
    })
    setSearchJobs(sortedByName);
  }

  const getApplicationTotal = () => {
    const newJobs = [...jobs];
    setApplicationCount(0);
    const todaysDate = format(new Date(), 'PPP');
    console.log('today', todaysDate);
    newJobs.map(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '\/')), 'PPP');
      console.log('appDate', appDate)
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
      >
        <Grid
          sm={8}
          sx={{
            m: 3,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
          >
            <SearchBar
              jobs={jobs}
              setSearchJobs={setSearchJobs}
            />
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
          >
            {/* <input
              type="file"
              accept='application/pdf'
              name='coverLetter'
              id='coverLetter'
              onChange={readFile}
            /> */}
            <Button
              variant='text'
              color='warning'
              onClick={() => setCardView(!cardView)}>
              View By: {cardView ? 'CARD' : 'LIST'}
            </Button>
            <Button
              variant='text'
              color='warning'
              onClick={() => sortByDate()}>
              SORT BY DATE
            </Button>
            <Button
              variant='text'
              color='warning'
              onClick={() => sortByName()}>
              SORT BY NAME A-Z
            </Button>
          </Grid>
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
              // maxHeight: '100vh',
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
            {!editing ?
              <NewJob
                jobsReference={jobsReference}
                getJobs={getJobs}
                editing={editing}
                setEditing={setEditing}
                formValues={formValues}
                setFormValues={setFormValues}
              /> :
              <Typography>EDIT</Typography>
            }
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;