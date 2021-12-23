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
    searchJobs,
    updateJobApplication,
    jobToEdit,
    setJobToEdit,
    editing,
    setEditing,
    deleteJob,
    updateJobStatus,
    updateInterviewDate,
  } = props;

  const getTotalApplicationCount = (status) => {
    const newJobs = [...searchJobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

  const getStatus = (status, score) => {
    if (score > 89) {
      return '#FDD835'
    } else {
      if (status === 'Active') {
        return '#4CAF50';
      } else if (status === 'Interview') {
        return '#673AB7';
      } else if (status === 'Closed') {
        return '#F44336';
      }
    }
  };

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