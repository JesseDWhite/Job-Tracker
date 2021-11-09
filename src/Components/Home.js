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
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CardView from './CardView';
import ListView from './ListView';
import EditJob from './EditJob';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [searchString, setSearchString] = useState();

  const [view, setView] = useState('card');

  const [formValues, setFormValues] = useState();

  const [editing, setEditing] = useState(false);

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

  const updateJobStatus = async (id, e) => {
    const jobDoc = doc(db, 'jobs', id);
    const newStatus = e.target.value;
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
    if (searchString) {
      const newJobs = [...jobs];
      const filteredJobs = newJobs.filter(job =>
        job.company.toLowerCase().includes(e.toLowerCase()));
      setSearchJobs(filteredJobs);
    }
  }

  const handleInputChange = (e) => {
    const search = e.target.value;
    setSearchString(search);
  }

  const changeView = () => {
    let newView = view;
    newView === 'card' ?
      newView = 'list' :
      newView = 'card'
    setView(newView);
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
    } else if (status === 'Interview') {
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
              onChange={(e) => handleInputChange(e)}
              value={searchString}
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
              onClick={() => changeView()}>
              View By: {view}
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
            <Typography
              variant='h4'
              sx={{
                mt: 3,
                ml: 2
              }}
            >
              Upcoming Interviews
            </Typography>
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
                    job.status === 'Interview' ?
                      <Grid
                        sm={view === 'card' ? 4 : 8}
                        md={view === 'card' ? 6 : 11}
                      >
                        {view === 'card' ?
                          <CardView
                            editing={editing}
                            setEditing={setEditing}
                            job={job}
                            getStatus={getStatus}
                            gradeApplication={gradeApplication}
                            deleteJob={deleteJob}
                            updateJobStatus={updateJobStatus}
                          /> : <ListView
                            editing={editing}
                            setEditing={setEditing}
                            job={job}
                            getStatus={getStatus}
                            gradeApplication={gradeApplication}
                            deleteJob={deleteJob}
                            updateJobStatus={updateJobStatus}
                          />}
                      </Grid>
                      : null
                  );
                })}
            </Grid>
          </Grid>
          <Grid>
            <Typography
              variant='h4'
              sx={{
                mt: 3,
                ml: 2
              }}
            >
              Active Applications
            </Typography>
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
                    job.status === 'Active' ?
                      <Grid
                        sm={view === 'card' ? 4 : 8}
                        md={view === 'card' ? 6 : 11}
                      >
                        {view === 'card' ?
                          <CardView
                            editing={editing}
                            setEditing={setEditing}
                            job={job}
                            getStatus={getStatus}
                            gradeApplication={gradeApplication}
                            deleteJob={deleteJob}
                            updateJobStatus={updateJobStatus}
                          /> : <ListView
                            editing={editing}
                            setEditing={setEditing}
                            job={job}
                            getStatus={getStatus}
                            gradeApplication={gradeApplication}
                            deleteJob={deleteJob}
                            updateJobStatus={updateJobStatus}
                          />}
                      </Grid>
                      : null
                  );
                })}
            </Grid>
          </Grid>
          <Typography
            variant='h4'
            sx={{
              mt: 3,
              ml: 2
            }}
          >
            Closed Applications

          </Typography>
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
                  job.status === 'Closed' ?
                    <Grid
                      sm={view === 'card' ? 4 : 8}
                      md={view === 'card' ? 6 : 11}
                    >
                      {view === 'card' ?
                        <CardView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                        /> : <ListView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                        />}
                    </Grid>
                    : null
                );
              })}
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
              maxHeight: '100vh'
            }}
          >
            {!editing ?
              <NewJob
                jobsReference={jobsReference}
                getJobs={getJobs}
                editing={editing}
                setEditing={setEditing}
                formValues={formValues}
                setFormValues={setFormValues}
              /> : <EditJob
                jobsReference={jobsReference}
                getJobs={getJobs}
                editing={editing}
                setEditing={setEditing}
                formValues={formValues}
                setFormValues={setFormValues}
              />
            }

          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;