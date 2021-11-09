import React, { useState, useRef } from 'react';
import { addDoc } from 'firebase/firestore';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import { KEYWORDS } from '../Constants/Keywords';

const initialValues = {
  company: '',
  dateApplied: '',
  jobDescription: '',
  jobTitle: '',
  status: 'Active',
  jobPosting: '',
  ats: '',
  coverLetter: '',
  resume: '',
  notes: '',
  score: 0,
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

  const validateFormFields = () => {
    if (formValues.company === '' ||
      formValues.dateApplied === '' ||
      formValues.jobTitle === '' ||
      formValues.status === '') {
      console.log('gotta fill that bad boy out');
    } else {
      createJob();
    }
  }

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
      score: extractKeyWords(formValues.coverLetter, formValues.jobDescription)
    });
    getJobs();
    setFormvalues(initialValues);
  };

  const extractKeyWords = (myDoc, jobDescription) => {
    const removeNonLetterFromMyDoc = myDoc.replace(/[.,\/!$%\^&\*;:{}=\_`~()]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
    const removeNonLetterFromJobPosting = jobDescription.replace(/[.,\/!$%\^&\*;:{}=\_`~()]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
    const extractMatchingWordsMyDoc = removeNonLetterFromMyDoc.split(' ')
      .sort()
      .filter(e => KEYWORDS.includes(e));
    const extractMatchingWordsJobPosting = removeNonLetterFromJobPosting.split(' ')
      .sort()
      .filter(e => KEYWORDS.includes(e));
    const myDocKeyWordsNoDups = [...new Set(extractMatchingWordsMyDoc)];
    const jobPostingKeyWordsNoDups = [...new Set(extractMatchingWordsJobPosting)];
    console.log('Cover Letter', myDocKeyWordsNoDups);
    console.log('Job Description', jobPostingKeyWordsNoDups);
    return getScore(myDocKeyWordsNoDups, jobPostingKeyWordsNoDups)
  }

  const getScore = (myDoc, jobDescription) => {
    const newTotalScore = jobDescription.length;
    const newYourScoreArray = myDoc.filter(e => jobDescription.includes(e));
    const newYourScore = newYourScoreArray.length;
    const percentage = newYourScore / newTotalScore * 100;
    return percentage.toFixed(0);
  }

  const readFile = (file, id) => {
    file = document.getElementById(id).files[0];
    const URLObject = URL.createObjectURL(file);
    return URLObject;
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
            type="text"
            name='company'
            label='Company'
            onChange={handleInputChange}
            value={formValues.company}
            fullWidth
          />
          <TextField
            sx={{
              mb: 2
            }}
            type="date"
            name='dateApplied'
            initialValues='today'
            onChange={handleInputChange}
            value={formValues.dateApplied}
            fullWidth
          />
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='jobTitle'
            label='Job Title'
            onChange={handleInputChange}
            value={formValues.jobTitle}
            fullWidth />
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            sx={{
              mb: 2
            }}
          >
            <FormControl component='fieldset'>
              <FormLabel
                component='legend'
                sx={{
                  textAlign: 'center'
                }}
              >
                Status
              </FormLabel>
              <RadioGroup
                row
                name='status'
                defaultValue='Active'
                value={formValues.status}
                onChange={handleInputChange}
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
          </Grid>
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='jobDescription'
            label='Job Description'
            onChange={handleInputChange}
            value={formValues.jobDescription}
            fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='jobPosting'
            label='Link To Job Posting'
            onChange={handleInputChange}
            value={formValues.jobPosting}
            fullWidth />
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='ats'
            label='Application Tracking System'
            onChange={handleInputChange}
            value={formValues.ats}
            fullWidth />
          {/* <Typography>CoverLetter</Typography> */}
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='coverLetter'
            label='Cover Letter Text'
            onChange={handleInputChange}
            value={formValues.coverLetter}
            fullWidth />
          {/* <input
            type="file"
            accept='application/pdf'
            ref={fileInput}
            name='coverLetter'
            onChange={handleInputChange}
            value={formValues.coverLetter}
            id='coverLetter'
          /> */}
          {/* <Typography>Resume</Typography> */}
          <TextField
            sx={{
              mb: 2
            }}
            type="text"
            name='resume'
            label='Resume Text'
            onChange={handleInputChange}
            value={formValues.resume}
            fullWidth />
          {/* <input
            type="file"
            accept='application/pdf'
            ref={fileInput}
            name='resume'
            onChange={handleInputChange}
            value={formValues.resume}
            id='resume'
          /> */}
          <TextField sx={{
            mb: 2
          }}
            type="text"
            name='notes'
            label='Notes'
            onChange={handleInputChange}
            value={formValues.notes}
            fullWidth
          />
          <Button
            sx={{
              width: '100%'
            }}
            type='button'
            variant='contained'
            color='success'
            onClick={validateFormFields}>
            Create New Job
          </Button>
        </form>
      </Grid>
    </>
  );
};

export default NewJob;