import React, { useState, useRef } from 'react';
import { addDoc } from 'firebase/firestore';
import {
  TextField,
  Button,
  Grid
} from '@mui/material';

const initialValues = {
  company: '',
  dateApplied: '',
  jobDescription: '',
  jobTitle: '',
  status: '',
  jobPosting: '',
  ats: '',
  coverLetter: '',
  resume: '',
  notes: ''
}

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
      coverLetter: formValues.coverLetter,
      resume: formValues.resume,
      notes: formValues.notes,
    });
    getJobs();
    setFormvalues(initialValues);
  };

  return (
    <>
      <h3>New Job</h3>
      <Grid>
        <form>
          <TextField sx={{
            mb: 2
          }}
            type="text" name='company' label='Company' onChange={handleInputChange} value={formValues.company} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="date" name='dateApplied' label='Date Applied' onChange={handleInputChange} value={formValues.dateApplied} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="text" name='jobTitle' label='Job Title' onChange={handleInputChange} value={formValues.jobTitle} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="text" name='status' label='Status' onChange={handleInputChange} value={formValues.status} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="text" name='jobDescription' label='Job Description' onChange={handleInputChange} value={formValues.jobDescription} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="text" name='jobPosting' label='Link To Job Posting' onChange={handleInputChange} value={formValues.jobPosting} fullWidth />
          <TextField sx={{
            mb: 2
          }}
            type="text" name='ats' label='Application Tracking System' onChange={handleInputChange} value={formValues.ats} fullWidth />
          <Button
            variant='outlined'
            color='secondary'
            compnent='label'
          >
            <input
              type="file"
              accept='text/pdf'
              ref={fileInput}
              name='coverLetter'
              onChange={handleInputChange}
              value={formValues.coverLetter}
            />
            Cover Letter
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            compnent='label'
          >
            <input
              type="file"
              accept='text/pdf'
              ref={fileInput}
              name='resume'
              onChange={handleInputChange}
              value={formValues.resume}
            />
            Resume
          </Button>
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