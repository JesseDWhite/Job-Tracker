import React from 'react';
import {
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import CardView from './CardView';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Constants/Theme';

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
    themeMode
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
                ml: 2,
                color: THEME[themeMode].textColor
              }}
            >
              Upcoming Interviews <Chip sx={{ fontSize: '1.15rem', color: THEME[themeMode].textColor }} label={getTotalApplicationCount('Interview')} />
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
                  key={job.id}
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
                      themeMode={themeMode}
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
                ml: 2,
                color: THEME[themeMode].textColor
              }}
            >
              Active Applications <Chip sx={{ fontSize: '1.15rem', color: THEME[themeMode].textColor }} label={getTotalApplicationCount('Active')} />
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
                  key={job.id}
                >
                  <AnimateKeyframes
                    play
                    iterationCount={1}
                    keyframes={["opacity: 0", "opacity: 1"]}
                  >
                    <CardView
                      themeMode={themeMode}
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
              ml: 2,
              color: THEME[themeMode].textColor
            }}
          >
            Closed Applications <Chip sx={{ fontSize: '1.15rem', color: THEME[themeMode].textColor }} label={getTotalApplicationCount('Closed')} />
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
                key={job.id}
              >
                <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={["opacity: 0", "opacity: 1"]}
                >
                  <CardView
                    themeMode={themeMode}
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