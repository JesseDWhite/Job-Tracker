import React, { useRef } from 'react';
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
import format from 'date-fns/format';
import strCompare from 'str-compare';

const initialValues = {
  company: '',
  dateApplied: format(new Date(), 'yyyy-MM-dd'),
  jobDescription: '',
  jobTitle: '',
  status: 'Active',
  jobPosting: '',
  ats: '',
  coverLetter: '',
  resume: '',
  notes: '',
  jobPostingKeyWords: [],
  coverLetterKeyWords: [],
  resumeKeyWords: [],
  missingKeyWords: [],
  score: 0,
  user: ''
}

const NewJob = (props) => {

  const {
    jobsReference,
    getJobs,
    formValues = initialValues,
    setFormValues,
    jobs,
    setJobs,
    searchJobs,
    setSearchJobs,
    user
  } = props;

  const fileInput = useRef();

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormValues({
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
      jobPostingKeyWords: extractKeyWords(formValues.jobDescription),
      coverLetterKeyWords: extractKeyWords(formValues.coverLetter),
      resumeKeyWords: extractKeyWords(formValues.resume),
      missingKeyWords: getMissingKeyWords(formValues.coverLetter, formValues.resume, formValues.jobDescription),
      score: formValues.coverLetter === ''
        && formValues.resume === ''
        && formValues.jobDescription === '' ? 0
        : getScore(formValues.coverLetter, formValues.resume, formValues.jobDescription),
      user: user?.uid
    });
    // setSearchJobs(newJobs);
    // setJobs(newJobs);
    getJobs();
    setFormValues(initialValues);
  };

  const extractKeyWords = (doc) => {
    let matches = [];
    const removeNonLetters = doc.replace(/[.,\/!$%\^&\*;:{}=\_`~()]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    const extractMatchingWords = removeNonLetters.split(' ').sort();

    for (let i = 0; i < KEYWORDS.length; i++) {
      for (let j = 0; j < extractMatchingWords.length; j++) {
        if (parseFloat(strCompare.jaro(extractMatchingWords[j], KEYWORDS[i]).toFixed(2)) >= 0.85) {
          matches.push(KEYWORDS[i]);
        }
      };
    };

    const docKeyWordsNoDups = [...new Set(matches)];

    return docKeyWordsNoDups;
  }

  const getMissingKeyWords = (coverLetter, resume, jobDescription) => {
    coverLetter = extractKeyWords(coverLetter);
    resume = extractKeyWords(resume);
    jobDescription = extractKeyWords(jobDescription);

    const combinedDocuments = coverLetter.concat(resume);
    const removeDuplicates = [...new Set(combinedDocuments)];
    const missingKeyWords = jobDescription.filter(e => !removeDuplicates.includes(e));

    const missingKeyWordsNoDups = [...new Set(missingKeyWords)];

    return missingKeyWordsNoDups;
  }

  const getScore = (coverLetter, resume, jobDescription) => {
    let scoreArrray = [];
    coverLetter = extractKeyWords(coverLetter);
    resume = extractKeyWords(resume);
    jobDescription = extractKeyWords(jobDescription);

    const newTotalScore = jobDescription.length;
    const combinedDocuments = coverLetter.concat(resume);
    const removeDuplicates = [...new Set(combinedDocuments)];
    for (let i = 0; i < jobDescription.length; i++) {
      for (let j = 0; j < removeDuplicates.length; j++) {
        if (parseFloat(strCompare.jaro(jobDescription[i], removeDuplicates[j]).toFixed(2)) >= 0.85) {
          scoreArrray.push(jobDescription[i]);
        }
      };
    };
    const newYourScore = scoreArrray.length;
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
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='company'
            label='Company'
            onChange={handleInputChange}
            value={formValues.company}
            fullWidth
          />
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xl={8}
            >
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                type='text'
                name='jobTitle'
                label='Job Title'
                onChange={handleInputChange}
                value={formValues.jobTitle}
              />
            </Grid>
            <Grid
              item
              xl={4}
            >
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                type='date'
                name='dateApplied'
                label='Date Applied'
                onChange={handleInputChange}
                value={formValues.dateApplied}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction='row'
            justifyContent='space-around'
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
          </Grid>
          <TextField
            sx={{
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='jobDescription'
            label='Job Description'
            onChange={handleInputChange}
            value={formValues.jobDescription}
            fullWidth />
          <TextField
            sx={{
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='jobPosting'
            label='Link To Job Posting'
            onChange={handleInputChange}
            value={formValues.jobPosting}
            fullWidth />
          <TextField
            sx={{
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='ats'
            label='Application Tracking System'
            onChange={handleInputChange}
            value={formValues.ats}
            fullWidth />
          {/* <Typography>CoverLetter</Typography> */}
          <TextField
            sx={{
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='coverLetter'
            label='Cover Letter Text'
            onChange={handleInputChange}
            value={formValues.coverLetter}
            fullWidth />
          {/* <input
            type='file'
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
              mb: 2,
              zIndex: 0
            }}
            type='text'
            name='resume'
            label='Resume Text'
            onChange={handleInputChange}
            value={formValues.resume}
            fullWidth />
          {/* <input
            type='file'
            accept='application/pdf'
            ref={fileInput}
            name='resume'
            onChange={handleInputChange}
            value={formValues.resume}
            id='resume'
          /> */}
          <TextField sx={{
            mb: 2,
            zIndex: 0
          }}
            type='text'
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