import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
  ArrowDropDownCircleTwoTone,
  CreateTwoTone,
} from '@mui/icons-material';
import format from 'date-fns/format';
import { THEME } from '../Constants/Theme';

const CardView = (props) => {

  const {
    job,
    getStatus,
    deleteJob,
    updateJobStatus,
    jobidx,
    updateInterviewDate,
    updateJobApplication,
    themeMode
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
    } else return '#3D5AFE'
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
          borderColor: getStatus(job.status, job.score),
          background: job.score > 89 ? `linear-gradient(135deg, ${THEME[themeMode].card} 50%, #FDD835)` : THEME[themeMode].card,
          borderRadius: 5,
          color: THEME[themeMode].textColor
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent='space-between'
        >
          <Grid
            sm={12}
          >
            <Grid
              container
              direction="row"
              justifyContent='space-between'
            >
              <Typography
                sx={{ maxWidth: '80%' }}
                noWrap
                item
                sm={8}
                variant='h4'>
                {job.company}
              </Typography>
              <Box item sm={4} sx={{ position: 'relative', right: 0, display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={parseInt(job.score)} sx={{ color: getScoreColor(job.score) }} thickness={6}
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
                  <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', fontSize: 'large' }}>
                    {job.score}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid>
            <Typography variant='h5'>{job.jobTitle}</Typography>
          </Grid>
          <Grid container>
            <Typography>
              {format(new Date(job.dateApplied.replace(/-/g, '/')), 'PPP')}
            </Typography>
          </Grid>
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
                  // href={job.coverLetter}
                  disabled={!job.coverLetter ? true : false}
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
                  // href={job.resume}
                  disabled={!job.resume ? true : false}
                  color='primary'
                >
                  <DescriptionTwoTone />
                </IconButton>
              </span>
            </Tooltip>
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
                  <DeleteForeverTwoTone />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            id='status'
            name='status'
            value={job.status}
            onChange={(e) => updateJobStatus(job.id, e)}
          >
            <FormControlLabel
              value='Active'
              control={<Radio color='success' />}
              label='Active'
            />
            <FormControlLabel
              value='Interview'
              control={<Radio color='primary' />}
              label='Interview'
              color='success'
            />
            <FormControlLabel
              value='Closed'
              control={<Radio color='error' />}
              label='Closed'
            />
          </RadioGroup>
        </FormControl>
        {job.status === 'Interview' ?
          <TextField
            fullWidth
            sx={{
              mb: 2,
            }}
            value={job.interviewDate}
            onChange={(e) => updateInterviewDate(job.id, jobidx, e)}
            type='datetime-local'
            name='interviewDate'
          /> : null
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
              expandIcon={<ArrowDropDownCircleTwoTone color='primary' />}
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