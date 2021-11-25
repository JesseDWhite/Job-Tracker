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
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
  ArrowDropDownCircleTwoTone,
} from '@mui/icons-material';

const ListView = (props) => {

  const {
    job,
    getStatus,
    gradeApplication,
    deleteJob,
    updateJobStatus,
    editing,
    setEditing,
    jobidx
  } = props;

  return (
    <>
      <span>
        {job.score > 89 ? <img src="https://media.giphy.com/media/YTJYm96ivBVIlHNRq7/source.gif" alt="sparkles" style={{ position: 'absolute', width: 100, }} /> : null}
      </span>
      <Paper
        elevation={3}
        sx={{
          mt: 3,
          ml: 3,
          p: 1.50,
          width: '100%',
          border: 'solid 5px',
          borderColor: getStatus(job.status),
          background: job.score > 89 ? 'linear-gradient(135deg, white 40%, gold)' : 'white',
          borderRadius: 5
        }}
      >
        <Grid>
          <Typography
            variant='h5'>
            {job.company} - {job.jobTitle}
            <Rating
              readOnly
              value={gradeApplication(job.score)}
              size='large'
              sx={{
                float: 'right',
                mt: 0.75
              }}
            />
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
          >
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
                />
                <FormControlLabel
                  value='Closed'
                  control={<Radio color='error' />}
                  label='Closed'
                />
              </RadioGroup>
            </FormControl>
            <Grid>
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
                <Typography>{job.missingKeyWords.length === 0 && job.score === 0
                  ? 'Not enough information for score'
                  : `${100 - job.score}% of Keywords Missing From Application`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {job.missingKeyWords.length > 0 ?
                  job.missingKeyWords.map(keyword => {
                    return (
                      <li>{keyword[0].toUpperCase() + keyword.slice(1)}</li>
                    )
                  })
                  : <Typography>{job.missingKeyWords.length === 0 && job.score === 0
                    ? 'Try adding the job description for a list of keywords.'
                    : 'Nice job!'}</Typography>}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Paper>
    </>
  )
}

export default ListView;