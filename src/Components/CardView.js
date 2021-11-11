import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Rating,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
  ArrowDropDownCircleTwoTone,
} from '@mui/icons-material';
import format from 'date-fns/format';

const CardView = (props) => {

  const {
    job,
    getStatus,
    gradeApplication,
    deleteJob,
    updateJobStatus,
    editing,
    setEditing,
    jobidx,
    updateInterviewDate,
  } = props;

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          m: 3,
          p: 2,
          minHeight: 250,
          border: 'solid 5px',
          borderColor: getStatus(job.status),
          background: job.score > 89 ? 'linear-gradient(135deg, white 40%, gold)' : 'white',
          borderRadius: 5
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
            <Typography
              variant='h4'>
              {job.company}
            </Typography>
            <Grid
              sm={6}
            >
              <Rating
                readOnly
                value={gradeApplication(job.score)}
                size='large'
                sx={{
                  mt: 0.75
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent='start'
          >
            <Tooltip
              title='Job Posting'
            >
              <IconButton
                target='_blank'
                rel='noopener noreferrer'
                href={job.jobPosting}
                disabled={!job.jobPosting ? true : false}
                color='primary'
              >
                <WorkTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip
              title='Application Tracking System'
            >
              <IconButton
                target='_blank'
                rel='noopener noreferrer'
                href={job.ats}
                disabled={!job.ats ? true : false}
                color='primary'
              >
                <InsertChartTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip
              title='Cover Letter'
            >
              <IconButton
                href={job.coverLetter}
                disabled={!job.coverLetter ? true : false}
                download='Cover Letter'
                color='primary'
              >
                <DescriptionTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip
              title='Resume'
            >
              <IconButton
                href={job.resume}
                disabled={!job.resume ? true : false}
                download='Resume'
                color='primary'
              >
                <DescriptionTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip
              title='Delete'
            >
              <IconButton
                color='error'
                onClick={() => deleteJob(job.id, jobidx)}>
                <DeleteForeverTwoTone />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Typography variant='h5'>{job.jobTitle}</Typography>
        <Typography>
          {format(new Date(job.dateApplied.replace(/-/g, '\/')), 'PPP')}
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            id='status'
            name='status'
            value={job.status}
            onChange={(e) => updateJobStatus(job.id, jobidx, e)}
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
          component='float'
        >
          <Accordion
            disableGutters
            elevation={0}
            sx={{
              background: 'rgb(128,128,128, 15%)',
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownCircleTwoTone color='primary' />}
            >
              <Typography>{100 - job.score}% of Keywords Missing From Application</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {job.missingKeyWords.length > 0 ?
                job.missingKeyWords.map(keyWord => {
                  return (
                    <li>{keyWord}</li>
                  )
                })
                : <Typography>None!</Typography>}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper >
    </>
  )
}

export default CardView;