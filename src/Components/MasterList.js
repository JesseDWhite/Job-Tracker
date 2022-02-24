import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Pagination,
  Stack
} from '@mui/material';
import CardView from './CardView';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';

const MasterList = (props) => {

  const {
    searchJobs,
    jobs,
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

  const [interviewPage, setInterviewPage] = useState(1);

  const [activePage, setActivePage] = useState(1);

  const [closedPage, setClosedPage] = useState(1);

  const jobsPerPage = 12;

  const interviewPagesVisited = interviewPage * jobsPerPage;

  const activePagesVisited = activePage * jobsPerPage;

  const closedPagesVisited = closedPage * jobsPerPage;

  const jobsToDisplay = (status, pages) => {
    const newJobs = [...searchJobs];
    const buffer = new Array(jobsPerPage);
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const paddedJobs = buffer.concat(filteredJobs)
      .slice(pages, pages + jobsPerPage);
    return paddedJobs;
  }

  const interviewPageCount = Math.ceil(jobs.filter(job => job.status.includes('Interview')).length / jobsPerPage);

  const activePageCount = Math.ceil(jobs.filter(job => job.status.includes('Active')).length / jobsPerPage);

  const closedPageCount = Math.ceil(jobs.filter(job => job.status.includes('Closed')).length / jobsPerPage);

  const handleInterviewChange = (event, value) => {
    setInterviewPage(value);
  }

  const handleActiveChange = (event, value) => {
    setActivePage(value);
  }

  const handleClosedChange = (event, value) => {
    setClosedPage(value);
  }

  const getTotalApplicationCount = (status) => {
    const newJobs = [...searchJobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

  const getCategoryHeader = (status, color, pageCount, pageNumber, changeEvent) => {
    let headerTitle = 'Closed Applications';
    if (status === 'Interview') {
      headerTitle = 'Upcoming Interviews'
    } else if (status === 'Active') {
      headerTitle = 'Active Applications'
    }
    if (searchJobs.some(job => job.status === status)) {
      return (
        <Stack sx={{ display: 'flex', alignItems: 'center' }} spacing={2}>
          <Typography
            variant='h4'
            sx={{
              mt: 3,
              color: THEME[themeMode].textColor,
            }}
          >
            {headerTitle} <Chip sx={{ fontSize: '1.15rem', color: THEME[themeMode].textColor }} label={getTotalApplicationCount(status)} />
          </Typography>
          <Pagination count={pageCount} page={pageNumber} onChange={changeEvent} color={color} />
        </Stack>
      )
    }
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
          {getCategoryHeader('Interview', 'primary', interviewPageCount, interviewPage, handleInterviewChange)}
        </AnimateKeyframes>
        <Grid
          container
          direction='row'
          justifyContent='start'
        >
          {jobsToDisplay('Interview', interviewPagesVisited).map((job, jobidx) => {
            return (
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
                    updateInterviewDate={updateInterviewDate}
                  />
                </AnimateKeyframes>
              </Grid>
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
          {getCategoryHeader('Active', 'success', activePageCount, activePage, handleActiveChange)}
        </AnimateKeyframes>
        <Grid
          container
          direction='row'
          justifyContent='start'
        >
          {jobsToDisplay('Active', activePagesVisited).map((job, jobidx) => {
            return (
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
            );
          })}
        </Grid>
      </Grid>
      <AnimateKeyframes
        play
        iterationCount={1}
        keyframes={["opacity: 0", "opacity: 1"]}
      >
        {getCategoryHeader('Closed', 'error', closedPageCount, closedPage, handleClosedChange)}
      </AnimateKeyframes>
      <Grid
        container
        direction='row'
        justifyContent='start'
      >
        {jobsToDisplay('Closed', closedPagesVisited).map((job, jobidx) => {
          return (
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
          );
        })}
      </Grid>
    </Grid>
  )
}

export default MasterList;