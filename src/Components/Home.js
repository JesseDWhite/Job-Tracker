import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  TextField,
  Tooltip,
  Rating,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
} from '@mui/icons-material';
import CardView from './CardView';
import ListView from './ListView';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [searchString, setSearchString] = useState();

  const [view, setView] = useState('card');

  const fileInput = useRef();

  const getJobs = async () => {
    const data = await getDocs(jobsReference);
    setSearchJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
    setJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
  }

  const updateJob = async (id) => {
    const jobDoc = doc(db, 'jobs', id);
    const newStatus = document.querySelector(`input[name='status']:checked`).value;
    const updateStatus = { status: newStatus };
    await updateDoc(jobDoc, updateStatus);
    getJobs();
  }

  const deleteJob = async (id) => {
    const jobDoc = doc(db, 'jobs', id);
    await deleteDoc(jobDoc);
    getJobs();
  }

  const handleSearch = (e) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job =>
      job.company.toLowerCase().includes(e));
    setSearchJobs(filteredJobs);
  }

  const handleInputChange = () => {
    const search = document.getElementById('searchBar').value;
    setSearchString(search);
  }

  const changeView = () => {
    let newView = view;
    newView === 'card' ?
      newView = 'list' :
      newView = 'card'
    setView(newView);
    console.log(view);
  }

  const sortByStatus = () => {
    const newJobs = [...searchJobs];
    const sortedByStatus = newJobs.sort((a, b) => {
      const newA = a.status.toUpperCase();
      const newB = b.status.toUpperCase();
      if (newA < newB) {
        return -1;
      }
      if (newA > newB) {
        return 1;
      }
      return 0;
    })
    setSearchJobs(sortedByStatus);
  }

  const sortByDate = () => {
    const newJobs = [...searchJobs];
    const sortedByStatus = newJobs.sort((a, b) => {
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
    setSearchJobs(sortedByStatus);
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByStatus = newJobs.sort((a, b) => {
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
    setSearchJobs(sortedByStatus);
  }

  const gradeApplication = (score) => {
    if (score < 20) {
      return 1
    } else if (score >= 20 && score < 40) {
      return 2
    } else if (score >= 40 && score < 60) {
      return 3
    } else if (score >= 60 && score < 80) {
      return 4
    } else return 5
  }

  const getStatus = (status) => {
    if (status === 'Active') {
      return '#4CAF50';
    } else if (status === 'Interview Scheduled') {
      return '#673AB7';
    } else if (status === 'Closed') {
      return '#F44336';
    }
  };

  const readFile = (file) => {
    file = document.getElementById('coverLetter').files[0];
    // const URLObject = URL.createObjectURL(file);
    return console.log(file.text());
  }

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchString);
  }, [searchString]);

  useEffect(() => {
    console.log(view)
  }, [view])

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
          <Typography
            variant='h3'
            sx={{
              textAlign: 'center'
            }}
          >
            ALL JOB APPLICATIONS
          </Typography>
          <input
            type="file"
            accept='application/pdf'
            name='coverLetter'
            id='coverLetter'
            onChange={readFile}
          />
          <Button onClick={() => changeView()}>{view}</Button>
          <Grid
            container
            direction="row"
            justifyContent="center"
          >
            <TextField
              sx={{
                width: '90%',
                height: 50,
              }}
              placeholder='SEARCH COMPANIES'
              variant='standard'
              id='searchBar'
              onChange={handleInputChange}
              value={searchString}
            />
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
          >
            <Button
              variant='text'
              color='warning'
              onClick={() => sortByStatus()}>
              SORT BY STATUS
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
          <Grid
            container
            direction='row'
            justifyContent='start'
          >
            {searchJobs.length === 0 ? <img
              src="https://media.giphy.com/media/jBPMBgFV0kPnftr0Dw/source.gif"
              alt="nothing found"
              style={{ width: 500 }}
            /> :
              searchJobs.map(job => {
                return (
                  <Grid
                    sm={view === 'card' ? 4 : 8}
                  >
                    {view === 'card' ?
                      <CardView
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJob={updateJob}
                      /> : <ListView
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJob={updateJob}
                      />}
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        <Grid
          sm={4}
          sx={{
            mr: 3,
            mt: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
            }}
          >
            <NewJob
              jobsReference={jobsReference}
              getJobs={getJobs}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;