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
    setSearchJobs,
    cardView,
    jobs,
    setJobs,
    getFilteredApplications,
  } = props;

  const deleteJob = async (id, jobidx) => {
    const newJobs = [...jobs];
    newJobs.splice(jobidx, 1);
    const jobDoc = doc(db, 'jobs', id);
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await deleteDoc(jobDoc);
  }

  const updateJobStatus = async (id, jobidx, e) => {
    const newStatus = e.target.value;
    const newJobs = [...jobs];
    newJobs[jobidx].status = newStatus;
    const jobDoc = doc(db, 'jobs', id);
    const updateStatus = { status: newStatus };
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await updateDoc(jobDoc, updateStatus);
  }

  const updateInterviewDate = async (id, jobidx, e) => {
    const newInterviewDate = e.target.value;
    const newJobs = [...jobs];
    newJobs[jobidx].interviewDate = newInterviewDate;
    const jobDoc = doc(db, 'jobs', id);
    const updateInterviewDate = { interviewDate: newInterviewDate }
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await updateDoc(jobDoc, updateInterviewDate);
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

  const getTotalApplicationCount = (status) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

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
            Upcoming Interviews: {getTotalApplicationCount('Interview')}
          </Typography>
          <Grid
            container
            direction='row'
            justifyContent='start'
          >
            {searchJobs.length === 0 ?
              <Typography>NO RESULTS</Typography>
              :
              searchJobs.map((job, jobidx) => {
                return (
                  job.status === 'Interview' ?
                    <Grid
                      sm={cardView ? 6 : 8}
                      xl={cardView ? 4 : 11}
                    >
                      {cardView ?
                        <CardView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                          updateInterviewDate={updateInterviewDate}
                        /> : <ListView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
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
            Active Applications: {getTotalApplicationCount('Active')}
          </Typography>
          <Grid
            container
            direction='row'
            justifyContent='start'
          >
            {searchJobs.length === 0 ?
              <Typography>NO RESULTS</Typography>
              :
              searchJobs.map((job, jobidx) => {
                return (
                  job.status === 'Active' ?
                    <Grid
                      sm={cardView ? 6 : 8}
                      xl={cardView ? 4 : 11}
                    >
                      {cardView ?
                        <CardView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                          updateInterviewDate={updateInterviewDate}
                        /> : <ListView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
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
          Closed Applications: {getTotalApplicationCount('Closed')}
        </Typography>
        <Grid
          container
          direction='row'
          justifyContent='start'
        >
          {searchJobs.length === 0 ?
            <Typography>NO RESULTS</Typography>
            :
            searchJobs.map((job, jobidx) => {
              return (
                job.status === 'Closed' ?
                  <Grid
                    sm={cardView ? 6 : 8}
                    xl={cardView ? 4 : 11}
                  >
                    {cardView ?
                      <CardView
                        editing={editing}
                        setEditing={setEditing}
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        jobidx={jobidx}
                      /> : <ListView
                        editing={editing}
                        setEditing={setEditing}
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        jobidx={jobidx}
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