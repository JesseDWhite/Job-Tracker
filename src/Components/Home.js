import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
} from '@mui/icons-material';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [searchString, setSearchString] = useState();

  const getJobs = async () => {
    const data = await getDocs(jobsReference);
    setJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
    setSearchJobs(jobs);
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

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchString);
  }, [searchString])

  const deleteJob = async (id) => {
    const jobDoc = doc(db, 'jobs', id);
    await deleteDoc(jobDoc);
    getJobs();
  }

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
            JOB TRACKING SYSTEM
            <Grid
              container
              direction="row"
              justifyContent="space-around"
            >
              <Button variant='text' onClick={() => sortByStatus()}>SORT BY STATUS</Button>
              <Button variant='text' onClick={() => sortByDate()}>SORT BY DATE</Button>
              <Button variant='text' onClick={() => sortByName()}>SORT BY NAME</Button>
            </Grid>
            <TextField variant='standard' id='searchBar' onChange={handleInputChange} value={searchString} />
          </Typography>
          {searchJobs.map(job => {
            return (
              <Grid>
                <Paper
                  elevation={3}
                  sx={{
                    m: 3,
                    p: 3
                  }}
                >
                  <Typography variant='h4'>{job.company}
                    <IconButton
                      component='span'
                      variant='contained'
                      color='error'
                      onClick={() => deleteJob(job.id)}>
                      <DeleteForeverTwoTone />
                    </IconButton>
                  </Typography>
                  <Typography variant='h5'>{job.jobTitle}</Typography>
                  <Typography>{job.dateApplied}</Typography>
                  <Typography>{job.status}</Typography>
                  <IconButton component='span' href={job.jobPosting}><WorkTwoTone /></IconButton>
                  <IconButton href={job.ats}><InsertChartTwoTone /></IconButton>
                  <IconButton href={job.coverLetter} download='Cover Letter'><DescriptionTwoTone /></IconButton>
                  <IconButton href={job.resume} download='Resume'><DescriptionTwoTone /></IconButton>
                  <Typography>{job.notes}</Typography>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
        <Grid
          sm={4}
          sx={{
            m: 3
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