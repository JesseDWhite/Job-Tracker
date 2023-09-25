import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Pagination,
  Stack,
  // Paper,
  // Box,
  // Button
} from '@mui/material';
import CardView from './CardView';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';
// import { DataGrid } from '@mui/x-data-grid';

const MasterList = (props) => {

  const {
    searchJobs,
    jobs,
    updateJobApplication,
    deleteJob,
    updateJobStatus,
    updateInterviewDate,
    themeMode,
    student,
    handleViewComments,
    user,
    currentUser,
    // open,
    // setOpen
  } = props;

  const [interviewPage, setInterviewPage] = useState(1);

  const [activePage, setActivePage] = useState(1);

  const [closedPage, setClosedPage] = useState(1);

  const [otherPage, setOtherPage] = useState(1);

  const jobsPerPage = 12;

  const interviewPagesVisited = interviewPage * jobsPerPage;

  const activePagesVisited = activePage * jobsPerPage;

  const closedPagesVisited = closedPage * jobsPerPage;

  const otherPagesVisited = otherPage * jobsPerPage;

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

  const otherPageCount = Math.ceil(jobs.filter(job => job.status.includes('Other')).length / jobsPerPage);

  const handleInterviewChange = (event, value) => {
    setInterviewPage(value);
  }

  const handleActiveChange = (event, value) => {
    setActivePage(value);
  }

  const handleClosedChange = (event, value) => {
    setClosedPage(value);
  }

  const handleOtherChange = (event, value) => {
    setOtherPage(value);
  }

  const getTotalApplicationCount = (status) => {
    const newJobs = [...searchJobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

  const getStatus = (status) => {
    if (status === 'Active') {
      return 'success';
    } else if (status === 'Interview') {
      return 'secondary';
    } else if (status === 'Closed') {
      return 'error';
    } else if (status === 'Other') {
      return 'warning';
    }
  };

  const categoryHeader = (status, color, pageCount, pageNumber, changeEvent) => {
    let headerTitle = 'Closed Applications';
    if (status === 'Interview') {
      headerTitle = 'Upcoming Interviews'
    } else if (status === 'Active') {
      headerTitle = 'Active Applications'
    } else if (status === 'Other') {
      headerTitle = 'Alternative Job Activities'
    }
    if (searchJobs.some(job => job.status === status)) {
      return (
        <Stack sx={{ display: 'flex', alignItems: 'center' }} spacing={2}>
          <Typography
            variant='h4'
            sx={{
              mt: 3,
              color: THEME[themeMode].textColor,
              cursor: 'default'
            }}
          >
            {headerTitle} <Chip sx={{ fontSize: '1.15rem', color: THEME[themeMode].textColor }} label={getTotalApplicationCount(status)} />
          </Typography>
          <Pagination
            count={pageCount}
            page={pageNumber}
            onChange={changeEvent}
            color={color}
          />
        </Stack>
      )
    }
  }

  const STRUCTURE = [
    {
      status: 'Interview',
      color: 'primary',
      pageCount: interviewPageCount,
      page: interviewPage,
      change: handleInterviewChange,
      pagesVisited: interviewPagesVisited
    },
    {
      status: 'Active',
      color: 'success',
      pageCount: activePageCount,
      page: activePage,
      change: handleActiveChange,
      pagesVisited: activePagesVisited
    },
    {
      status: 'Other',
      color: 'warning',
      pageCount: otherPageCount,
      page: otherPage,
      change: handleOtherChange,
      pagesVisited: otherPagesVisited
    },
    {
      status: 'Closed',
      color: 'error',
      pageCount: closedPageCount,
      page: closedPage,
      change: handleClosedChange,
      pagesVisited: closedPagesVisited
    },
  ];

  const columns = [
    {
      field: 'company',
      headerName: 'Company',
      headerAlign: 'center',
      width: 300,
      align: 'left',
      filterable: false,
      sortable: true,
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      headerAlign: 'center',
      width: 300,
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
    {
      field:
        'status',
      headerName:
        'Status',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      renderCell: (params) => {
        return <Chip label={params.value} variant={THEME[themeMode].buttonStyle} color={getStatus(params.value)} />
      }
    },
    {
      field: 'score',
      headerName: 'Score',
      headerAlign: 'center',
      width: 100,
      align: 'center',
      filterable: true,
      sortable: true,
    },
    {
      field: 'dateApplied',
      headerName: 'Date Applied',
      headerAlign: 'center',
      width: 125,
      align: 'center',
      filterable: true,
      sortable: true,
    },
  ];

  return (
    <Grid>
      {/* <Paper
        id='dataGrid'
        sx={{
          position: 'relative',
          borderRadius: 5,
          background: THEME[themeMode].card,
          transition: 'color .5s, background .5s'
        }}
      >
        <Button
          elevation={3}
          variant={THEME[themeMode].buttonStyle}
          color='success'
          onClick={() => setOpen(true)}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20
          }}
        >
          Add New
        </Button>
        <Box
          sx={{
            borderRadius: 5,
            transition: 'color .5s, background .5s',
            height: '80vh',
            width: '100%',
            background: THEME[themeMode].card,
            pt: 5
          }}
        >
          <DataGrid
            sx={{
              transition: 'color .5s, background .5s',
              color: THEME[themeMode].textColor,
              border: 'none',
              "& ::-webkit-scrollbar": {
                backgroundColor: 'rgba(0, 0, 0, 0)',
                width: '0.5em'
              },
              "& ::-webkit-scrollbar-thumb": {
                backgroundColor: 'rgb(169, 169, 169)',
                borderRadius: '1em'
              }
            }}
            rows={searchJobs}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
          // onSelectionModelChange={(newStudent) => (setViewStudent(newStudent))}
          // selectedModel={viewStudent}
          />
        </Box>
      </Paper> */}
      {
        STRUCTURE.map(skeleton => {
          return (
            <Grid key={skeleton.status}>
              <AnimateKeyframes
                play
                iterationCount={1}
                keyframes={["opacity: 0", "opacity: 1"]}
              >
                {categoryHeader(skeleton.status, skeleton.color, skeleton.pageCount, skeleton.page, skeleton.change)}
              </AnimateKeyframes>
              <Grid
                container
                direction='row'
                justifyContent='start'
              >
                {jobsToDisplay(skeleton.status, skeleton.pagesVisited).map(job => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      xl={3}
                      key={job.id}
                    >
                      <CardView
                        themeMode={themeMode}
                        updateJobApplication={updateJobApplication}
                        job={job}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        updateInterviewDate={updateInterviewDate}
                        student={student}
                        handleViewComments={handleViewComments}
                        user={user}
                        currentUser={currentUser}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )
        })
      }
    </Grid >
  )
}

export default MasterList;