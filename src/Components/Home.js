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
  Tooltip,
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
    setSearchJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
    setJobs(data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    })));
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
      return 'F'
    } else if (score >= 20 && score < 40) {
      return 'D'
    } else if (score >= 40 && score < 60) {
      return 'C'
    } else if (score >= 60 && score < 80) {
      return 'B'
    } else return 'A'
  }

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchString);
  }, [searchString])

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
                    sm={4}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        m: 3,
                        p: 3,
                        minHeight: 250
                      }}
                    >
                      <Grid>
                        <Typography variant='h4'>{job.company}: {gradeApplication(job.score)} {job.score}% </Typography>
                        <Grid
                          container
                          direction="row"
                          justifyContent='start'
                        >
                          <Tooltip
                            title='Job Posting'
                          >
                            <IconButton
                              target='_blank'
                              rel='noopener noreferrer'
                              href={job.jobPosting}
                              disabled={!job.jobPosting ? true : false}
                              color='primary'
                            >
                              <WorkTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title='Application Tracking System'
                          >
                            <IconButton
                              target='_blank'
                              rel='noopener noreferrer'
                              href={job.ats}
                              disabled={!job.ats ? true : false}
                              color='primary'
                            >
                              <InsertChartTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title='Cover Letter'
                          >
                            <IconButton
                              href={job.coverLetter}
                              disabled={!job.coverLetter ? true : false}
                              download='Cover Letter'
                              color='primary'
                            >
                              <DescriptionTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title='Resume'
                          >
                            <IconButton
                              href={job.resume}
                              disabled={!job.resume ? true : false}
                              download='Resume'
                              color='primary'
                            >
                              <DescriptionTwoTone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title='Delete'
                          >
                            <IconButton
                              color='error'
                              onClick={() => deleteJob(job.id)}>
                              <DeleteForeverTwoTone />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Typography variant='h5'>{job.jobTitle}</Typography>
                      <Typography>{job.dateApplied}</Typography>
                      <Typography>{job.status}</Typography>
                      <Typography>{job.notes}</Typography>
                    </Paper>
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