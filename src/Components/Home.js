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
} from '@mui/material';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  const jobsReference = collection(db, 'jobs');

  const getJobs = async () => {
    const data = await getDocs(jobsReference);
    setJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
  }

  useEffect(() => {
    getJobs();
  }, []);

  const deleteJob = async (id) => {
    const jobDoc = doc(db, 'jobs', id);
    await deleteDoc(jobDoc);
    getJobs();
  }

  return (
    <>
      <Typography variant='h2'>JOB TRACKING SYSTEM</Typography>
      <Grid
        sm='4'
        sx={{
          position: 'absolute',
          right: 0,
          m: 3
        }}
      >
        <NewJob
          jobsReference={jobsReference}
          getJobs={getJobs}
        />
      </Grid>
      <Grid
        sm='8'
        sx={{
          m: 3
        }}
      >
        {jobs.map(job => {
          return (
            <Grid>
              <Typography>{job.company}</Typography>
              <ul>
                <li>{job.jobTitle}</li>
                <li>{job.dateApplied}</li>
                <li>{job.jobDescription}</li>
                <li>{job.status}</li>
                <li>{job.jobPosting}</li>
                <li>{job.ats}</li>
                <li>{job.coverLetter}</li>
                <li>{job.resume}</li>
                <li>{job.notes}</li>
              </ul>
              <Button
                variant='contained'
                color='error'
                onClick={() => deleteJob(job.id)}>
                Delete Job
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </>
  );
};

export default Home;