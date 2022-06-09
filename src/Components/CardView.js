import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Fab
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteTwoTone,
  CreateTwoTone,
  KeyboardArrowDownRounded,
  EmailTwoTone
} from '@mui/icons-material';
import format from 'date-fns/format';
import { THEME } from '../Layout/Theme';
import { motion } from 'framer-motion';

const CardView = (props) => {

  const {
    job,
    deleteJob,
    updateJobStatus,
    updateInterviewDate,
    updateJobApplication,
    updateAttendedInterview,
    themeMode,
    student,
    viewComments,
    setViewComments,
    handleViewComments,
    user
  } = props;

  const getScoreColor = (score) => {
    if (score < 20) {
      return '#FF3D00'
    } else if (score >= 20 && score < 40) {
      return '#FF9100'
    } else if (score >= 40 && score < 60) {
      return '#FFC400'
    } else if (score >= 60 && score < 80) {
      return '#CDDC39'
    } else if (score >= 80 && score < 90) {
      return '#64DD17'
    } else return '#00C853'
  }

  //most colors are being called from the 500 level
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
      } else if (status === 'Other') {
        return '#FF9800';
      }
    }
  };

  const getToggleButtonColor = (status) => {
    if (status === 'Active') {
      return 'success';
    } else if (status === 'Interview') {
      return 'secondary'
    } else if (status === 'Other') {
      return 'warning';
    } else {
      return 'error';
    }
  }

  return (
    <>
      <Paper
        component={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.20 }}
        whileHover={{ scale: 1.03 }}
        elevation={3}
        sx={{
          m: 3,
          p: 2,
          minHeight: 200,
          border: 'solid 5px',
          transition: 'background .5s',
          borderColor: getStatus(job.status, job.score),
          background: THEME[themeMode].card,
          borderRadius: 5,
          color: THEME[themeMode].textColor,
          fontFamily: 'Urbanist'
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent='space-between'
        >
          <Grid
            item
            sm={12}
          >
            <Grid
              container
              direction="row"
              justifyContent='space-between'
              sx={{ cursor: 'default', position: 'relative' }}
            >
              <Fab
                color='primary'
                onClick={() => !student || Object.values(student).length === 0
                  ? handleViewComments(user.uid, job)
                  : handleViewComments(student.id, job)
                }
                size='medium'
                sx={{
                  position: 'absolute',
                  left: -40,
                  top: -40
                }}
              >
                <EmailTwoTone />
              </Fab>
              <Typography
                sx={{ maxWidth: '87%' }}
                item
                sm={8}
                variant='h4'>
                {job.company}
              </Typography>
              <Tooltip title='Score' placement='left'>
                <Box item sm={4} sx={{ position: 'absolute', right: 0, top: 0, display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={parseInt(job.score)} sx={{ color: getScoreColor(job.score) }} thickness={5}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" sx={{ fontSize: 'large' }}>
                      {job.score}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
          <Box sx={{ cursor: 'default', width: '100%' }}>
            <Grid>
              <Typography variant='h5'>{job.jobTitle}</Typography>
            </Grid>
            <hr />
            <Grid container>
              <Typography>
                {format(new Date(job.dateApplied.replace(/-/g, '/')), 'PPP')}
              </Typography>
            </Grid>
          </Box>
          <Grid
            container
            direction="row"
            justifyContent="start"
          >
            <Tooltip
              title='Job Posting'
              disableInteractive
            >
              <span>
                <IconButton
                  target='_blank'
                  rel='noopener noreferrer'
                  href={job.jobPosting}
                  disabled={!job.jobPosting ? true : false}
                  color='primary'
                >
                  <WorkTwoTone />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title='Application Tracking System'
              disableInteractive
            >
              <span>
                <IconButton
                  target='_blank'
                  rel='noopener noreferrer'
                  href={job.ats}
                  disabled={!job.ats ? true : false}
                  color='primary'
                >
                  <InsertChartTwoTone />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title='Cover Letter'
              disableInteractive
            >
              <span>
                <IconButton
                  target='_blank'
                  rel='noopener noreferrer'
                  href={job.coverLetterLink}
                  disabled={!job?.coverLetterLink ? true : false}
                  color='primary'
                >
                  <DescriptionTwoTone />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title='Resume'
              disableInteractive
            >
              <span>
                <IconButton
                  target='_blank'
                  rel='noopener noreferrer'
                  href={job.resumeLink}
                  disabled={!job?.resumeLink ? true : false}
                  color='primary'
                >
                  <DescriptionTwoTone />
                </IconButton>
              </span>
            </Tooltip>
            {!student || Object.values(student).length === 0
              ? <>
                <Tooltip
                  title='Edit'
                  disableInteractive
                >
                  <span>
                    <IconButton
                      color='warning'
                      onClick={() => updateJobApplication(job)}>
                      <CreateTwoTone />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title='Delete'
                  disableInteractive
                >
                  <span>
                    <IconButton
                      color='error'
                      onClick={() => deleteJob(job.id, job.company)}>
                      <DeleteTwoTone />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
              : null
            }
          </Grid>
        </Grid>
        <Grid>
          {!student || Object.values(student).length === 0
            ?
            <ToggleButtonGroup
              sx={{
                my: 1
              }}
              color={getToggleButtonColor(job.status)}
              size='small'
              value={job.status}
              name='status'
              exclusive
              onChange={(e) => updateJobStatus(job.id, e)}
              fullWidth
            >
              <ToggleButton value='Active'>
                Active
              </ToggleButton>
              <ToggleButton value='Interview'>
                Interview
              </ToggleButton>
              <ToggleButton value='Other'>
                Other
              </ToggleButton>
              <ToggleButton value='Closed'>
                Closed
              </ToggleButton>
            </ToggleButtonGroup>
            : <Typography>{job.status}</Typography>
          }
        </Grid>
        {job.status === 'Interview' ?
          !student || Object.values(student).length === 0
            ?
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item
                md={12}
              >
                <TextField
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                  value={job.interviewDate}
                  onChange={(e) => updateInterviewDate(job.id, e)}
                  type='datetime-local'
                  name='interviewDate'
                />
              </Grid>
              {/* <Grid
                item
                md={2}
              >
                <Tooltip
                  title='Attended Interview'
                >
                  <IconButton
                    color='success'
                    onClick={() => updateAttendedInterview(job.id, job?.attendedInterview)}
                    size='large'
                  >
                    {job.attendedInterview ? <CheckCircleRounded /> : <RadioButtonUncheckedTwoTone />}
                  </IconButton>
                </Tooltip>
              </Grid> */}
            </Grid>
            : <Typography>{job.interviewDate ? format(new Date(job.interviewDate), 'Pp') : null}</Typography>
          : null
        }
        <Typography>{job.notes}</Typography>
        <Box
          sx={{
            pt: 1
          }}
        >
          <Accordion
            item
            disableGutters
            elevation={0}
            sx={{
              background: 'rgb(128,128,128, 15%)',
              color: THEME[themeMode].textColor
            }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDownRounded color='primary' />}
            >
              <Typography>{job.missingKeyWords.length === 0 && job.score === 0
                ? 'Not enough information for score'
                : `${100 - job.score}% of Keywords Missing From Application`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {job.missingKeyWords.length > 0 ?
                job.missingKeyWords.map(keyword => {
                  return (
                    <li key={keyword.concat(job.id)}>{keyword[0].toUpperCase() + keyword.slice(1)}</li>
                  )
                })
                : <Typography>{job.missingKeyWords.length === 0 && job.score === 0
                  ? 'Try adding the job description for a list of keywords.'
                  : 'Nice job!'}</Typography>}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
    </>
  )
}

export default CardView;