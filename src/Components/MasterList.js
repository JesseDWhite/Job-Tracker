import React from 'react';
import { db } from '../firebase';
import {
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import {
  Grid,
  Typography,
} from '@mui/material';
import CardView from './CardView';
import ListView from './ListView';

const MasterList = (props) => {

  const {
    editing,
    setEditing,
    searchJobs,
    view,
    getJobs,
  } = props;

  const deleteJob = async (id) => {
    const jobDoc = doc(db, 'jobs', id);
    await deleteDoc(jobDoc);
    getJobs();
  }

  const updateJobStatus = async (id, e) => {
    const jobDoc = doc(db, 'jobs', id);
    const newStatus = e.target.value;
    const updateStatus = { status: newStatus };
    await updateDoc(jobDoc, updateStatus);
    getJobs();
  }

  const gradeApplication = (score) => {
    if (score < 20) {
      return 1
    } else if (score >= 20 && score < 40) {
      return 2
    } else if (score >= 40 && score < 70) {
      return 3
    } else if (score >= 70 && score < 90) {
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

  return (
    <>
      <Grid>
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
    </>
  )
}

export default MasterList;