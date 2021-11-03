import React, { useState, useRef } from 'react';
import { addDoc } from 'firebase/firestore';
import {
  TextField,
  Button,
  Grid,
  Typography,
} from '@mui/material';

const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

const initialValues = {
  company: '',
  dateApplied: getTodaysDate(),
  jobDescription: '',
  jobTitle: '',
  status: '',
  jobPosting: '',
  ats: '',
  coverLetter: '',
  resume: '',
  notes: ''
}

console.log(initialValues);

const NewJob = (props) => {

  const { jobsReference, getJobs } = props;

  const [formValues, setFormvalues] = useState(initialValues);

  const fileInput = useRef();

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setFormvalues({
      ...formValues,
      [name]: value
    });
  };

  const createJob = async () => {
    await addDoc(jobsReference, {
      company: formValues.company,
      dateApplied: formValues.dateApplied,
      jobDescription: formValues.jobDescription,
      jobTitle: formValues.jobTitle,
      status: formValues.status,
      jobPosting: formValues.jobPosting,
      ats: formValues.ats,
      coverLetter: formValues.coverLetter ? readFile(formValues.coverLetter, 'coverLetter') : null,
      resume: formValues.resume ? readFile(formValues.resume, 'resume') : null,
      notes: formValues.notes,
    });
    getJobs();
    setFormvalues(initialValues);
  };

  const readFile = (file, id) => {
    file = document.getElementById(id).files[0];
    const URLObject = URL.createObjectURL(file);
    return URLObject
  }

  return (
    <>
      <Typography
        variant='h3'
        sx={{
          textAlign: 'center'
        }}
      >
        NEW JOB
      </Typography>
      <Grid>
        <form method='post'>
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='company' label='Company' onChange={handleInputChange} value={formValues.company} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="date" name='dateApplied' initialValues='today' onChange={handleInputChange} value={formValues.dateApplied} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='jobTitle' label='Job Title' onChange={handleInputChange} value={formValues.jobTitle} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='status' label='Status' onChange={handleInputChange} value={formValues.status} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='jobDescription' label='Job Description' onChange={handleInputChange} value={formValues.jobDescription} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='jobPosting' label='Link To Job Posting' onChange={handleInputChange} value={formValues.jobPosting} fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text" name='ats' label='Application Tracking System' onChange={handleInputChange} value={formValues.ats} fullWidth />
          {/* <Button
            variant='outlined'
            color='secondary'
            compnent='label'
          > */}
          <Typography>CoverLetter</Typography>
          <input
            type="file"
            accept='application/pdf'
            ref={fileInput}
            name='coverLetter'
            onChange={handleInputChange}
            value={formValues.coverLetter}
            id='coverLetter'
          />
          {/* Cover Letter */}
          {/* </Button> */}
          {/* <Button
            variant='outlined'
            color='secondary'
            compnent='label'
          > */}
          <Typography>Resume</Typography>
          <input
            type="file"
            accept='application/pdf'
            ref={fileInput}
            name='resume'
            onChange={handleInputChange}
            value={formValues.resume}
            id='resume'
          />
          {/* Resume */}
          {/* </Button> */}
          <TextField sx={{
            mb: 2
          }}
            type="text" name='notes' label='Notes' onChange={handleInputChange} value={formValues.notes} fullWidth />
          <Button
            type='button'
            variant='contained'
            color='success'
            onClick={createJob}>
            Create New Job
          </Button>
        </form>
      </Grid>
    </>
  );
};

export default NewJob;