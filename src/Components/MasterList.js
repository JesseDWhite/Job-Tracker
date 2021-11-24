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
  Chip,
} from '@mui/material';
import CardView from './CardView';
import ListView from './ListView';
import { AnimateKeyframes } from 'react-simple-animate';

const MasterList = (props) => {

  const {
    editing,
    setEditing,
    jobToEdit,
    setJobToEdit,
    searchJobs,
    setSearchJobs,
    cardView,
    jobs,
    setJobs,
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

  const test = (job) => {
    const newJobToEdit = { ...job };
    setJobToEdit(newJobToEdit);
    console.log(jobToEdit);
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
          <AnimateKeyframes
            play
            iterationCount={1}
            keyframes={[
              "opacity: 0",
              "opacity: 1",
            ]}
          >
            {searchJobs.every(job => job.status !== 'Interview')
              ? null
              :
              <Typography
                variant='h4'
                sx={{
                  mt: 3,
                  ml: 2
                }}
              >
                Upcoming Interviews <Chip label={getTotalApplicationCount('Interview')} />
              </Typography>
            }
          </AnimateKeyframes>
          <Grid
            container
            direction='row'
            justifyContent='start'
          >
            {searchJobs.map((job, jobidx) => {
              return (
                job.status === 'Interview' ?
                  <Grid
                    sm={cardView ? 6 : 8}
                    xl={cardView ? 4 : 11}
                  >
                    {cardView ?
                      <AnimateKeyframes
                        play
                        iterationCount={1}
                        keyframes={[
                          "opacity: 0",
                          "opacity: 1",
                        ]}
                      >
                        <CardView
                          test={test}
                          jobToEdit={jobToEdit}
                          setJobToEdit={setJobToEdit}
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                          updateInterviewDate={updateInterviewDate}
                        />
                      </AnimateKeyframes>
                      :
                      <AnimateKeyframes
                        play
                        iterationCount={1}
                        keyframes={["opacity: 0", "opacity: 1"]}
                      >
                        <ListView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                        />
                      </AnimateKeyframes>

                    }
                  </Grid>
                  : null
              );
            })}
          </Grid>
        </Grid>
        <Grid>
          <AnimateKeyframes
            play
            iterationCount={1}
            keyframes={["opacity: 0", "opacity: 1"]}
          >
            {searchJobs.every(job => job.status !== 'Active')
              ? null
              :
              <Typography
                variant='h4'
                sx={{
                  mt: 3,
                  ml: 2
                }}
              >
                Active Applications <Chip label={getTotalApplicationCount('Active')} />
              </Typography>
            }
          </AnimateKeyframes>
          <Grid
            container
            direction='row'
            justifyContent='start'
          >
            {searchJobs.map((job, jobidx) => {
              return (
                job.status === 'Active' ?
                  <Grid
                    sm={cardView ? 6 : 8}
                    xl={cardView ? 4 : 11}
                  >
                    {cardView ?
                      <AnimateKeyframes
                        play
                        iterationCount={1}
                        keyframes={["opacity: 0", "opacity: 1"]}
                      >
                        <CardView
                          test={test}
                          jobToEdit={jobToEdit}
                          setJobToEdit={setJobToEdit}
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                          updateInterviewDate={updateInterviewDate}
                        />
                      </AnimateKeyframes>
                      :
                      <AnimateKeyframes
                        play
                        iterationCount={1}
                        keyframes={["opacity: 0", "opacity: 1"]}
                      >
                        <ListView
                          editing={editing}
                          setEditing={setEditing}
                          job={job}
                          getStatus={getStatus}
                          gradeApplication={gradeApplication}
                          deleteJob={deleteJob}
                          updateJobStatus={updateJobStatus}
                          jobidx={jobidx}
                        />
                      </AnimateKeyframes>
                    }
                  </Grid>
                  : null
              );
            })}
          </Grid>
        </Grid>
        <AnimateKeyframes
          play
          iterationCount={1}
          keyframes={["opacity: 0", "opacity: 1"]}
        >
          {searchJobs.every(job => job.status !== 'Closed')
            ? null
            :
            <Typography
              variant='h4'
              sx={{
                mt: 3,
                ml: 2
              }}
            >
              Closed Applications <Chip label={getTotalApplicationCount('Closed')} />
            </Typography>
          }
        </AnimateKeyframes>
        <Grid
          container
          direction='row'
          justifyContent='start'
        >
          {searchJobs.map((job, jobidx) => {
            return (
              job.status === 'Closed' ?
                <Grid
                  sm={cardView ? 6 : 8}
                  xl={cardView ? 4 : 11}
                >
                  {cardView ?
                    <AnimateKeyframes
                      play
                      iterationCount={1}
                      keyframes={["opacity: 0", "opacity: 1"]}
                    >
                      <CardView
                        test={test}
                        jobToEdit={jobToEdit}
                        setJobToEdit={setJobToEdit}
                        editing={editing}
                        setEditing={setEditing}
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        jobidx={jobidx}
                        updateInterviewDate={updateInterviewDate}
                      />
                    </AnimateKeyframes>
                    :
                    <AnimateKeyframes
                      play
                      iterationCount={1}
                      keyframes={["opacity: 0", "opacity: 1"]}
                    >
                      <ListView
                        editing={editing}
                        setEditing={setEditing}
                        job={job}
                        getStatus={getStatus}
                        gradeApplication={gradeApplication}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        jobidx={jobidx}
                      />
                    </AnimateKeyframes>
                  }
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