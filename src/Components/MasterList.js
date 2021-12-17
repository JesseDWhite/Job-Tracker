import React from 'react';
import {
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import CardView from './CardView';
import { AnimateKeyframes } from 'react-simple-animate';

const MasterList = (props) => {

  const {
    getTotalApplicationCount,
    searchJobs,
    updateJobApplication,
    jobToEdit,
    setJobToEdit,
    editing,
    setEditing,
    getStatus,
    gradeApplication,
    deleteJob,
    updateJobStatus,
    updateInterviewDate,
  } = props;

  return (
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
                  sm={6}
                  xl={3}
                >
                  <AnimateKeyframes
                    play
                    iterationCount={1}
                    keyframes={[
                      "opacity: 0",
                      "opacity: 1",
                    ]}
                  >
                    <CardView
                      key={job.id}
                      updateJobApplication={updateJobApplication}
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
              {/* <Pagination color='primary' variant='outlined' count={10} /> */}
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
                  sm={6}
                  xl={3}
                >
                  <AnimateKeyframes
                    play
                    iterationCount={1}
                    keyframes={["opacity: 0", "opacity: 1"]}
                  >
                    <CardView
                      key={job.id}
                      updateJobApplication={updateJobApplication}
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
                sm={6}
                xl={3}
              >
                <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={["opacity: 0", "opacity: 1"]}
                >
                  <CardView
                    key={job.id}
                    updateJobApplication={updateJobApplication}
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
              </Grid>
              : null
          );
        })}
      </Grid>
    </Grid>
  )
}

export default MasterList;