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
  FormControl
} from '@mui/material';
import {
  WorkTwoTone,
  InsertChartTwoTone,
  DescriptionTwoTone,
  DeleteForeverTwoTone,
} from '@mui/icons-material';

const ListView = (props) => {

  const {
    job,
    getStatus,
    gradeApplication,
    deleteJob,
    updateJobStatus
  } = props;

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        p: 1.50,
        width: '100%',
        border: 'solid 5px',
        borderColor: getStatus(job.status),
        background: job.score > 80 ? 'linear-gradient(135deg, white 40%, gold)' : 'white'
      }}
    >
      <Grid>
        <Typography
          variant='h4'>
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
              onChange={(e) => updateJobStatus(job.id, e)}
            >
              <FormControlLabel
                value='Active'
                control={<Radio color='success' />}
                label='Active'
              />
              <FormControlLabel
                value='Closed'
                control={<Radio color='error' />}
                label='Closed'
              />
              <FormControlLabel
                value='Interview'
                control={<Radio color='primary' />}
                label='Interview'
                color='success'
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
                onClick={() => deleteJob(job.id)}>
                <DeleteForeverTwoTone />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ListView;