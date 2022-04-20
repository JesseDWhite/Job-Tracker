import React, { useState } from 'react';
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
  Checkbox,
  Switch
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteTwoTone,
  CreateTwoTone,
  KeyboardArrowDownRounded,
  Check,
} from '@mui/icons-material';
import format from 'date-fns/format';
import { THEME } from '../Layout/Theme';

const CardView = (props) => {

  const {
    job,
    getStatus,
    deleteJob,
    updateJobStatus,
    updateInterviewDate,
    updateJobApplication,
    updateAttendedInterview,
    themeMode,
    student
  } = props;

  // const [checked, setChecked] = useState(job?.attendedInterview);

  // const handleCheckedChange = (id, e) => {
  //   setChecked(!checked);
  //   updateAttendedInterview(id, e);
  // }

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
      <span>
        {job.score > 89 ? <img src="https://media.giphy.com/media/YTJYm96ivBVIlHNRq7/source.gif" alt="sparkles" style={{ position: 'absolute', width: 100, }} /> : null}
      </span>
      <Paper
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
          <Box sx={{ cursor: 'default' }}>
            <Grid>
              <Typography variant='h5'>{job.jobTitle}</Typography>
            </Grid>
            <Grid container>
              <Typography>
                {format(new Date(job.dateApplied.replace(/-/g, '/')), 'PPP')}
              </Typography>
            </Grid>
          </Box>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
          >
            <Tooltip
              title='Job Posting'
            >
              <span>
                <IconButton
                  sx={{
                    pl: 0
                  }}
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
              {/* <Grid item md={2}>
                <Tooltip title='Attended Interview' placement='right'>
                  <ToggleButton
                    value='check'
                    color='success'
                    selected={checked ? true : false}
                    onChange={(e) => { handleCheckedChange(job.id, e) }}>
                    <Check />
                  </ToggleButton>
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