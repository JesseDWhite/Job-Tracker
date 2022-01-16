import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Modal,
  Fade,
  Backdrop,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Check, Close, AddBoxTwoTone } from '@mui/icons-material';
import { db } from '../firebase';
import {
  updateDoc,
  addDoc,
  doc
} from 'firebase/firestore';
import { KEYWORDS } from '../Constants/Keywords';
import format from 'date-fns/format';
import strCompare from 'str-compare';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '85%',
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const NewJob = (props) => {

  const {
    jobsReference,
    subCollection,
    getJobs,
    user,
    editing,
    setEditing,
    jobToEdit,
    handleSetOpen,
    feedback,
    setFeedback
  } = props;

  const [resumeKeywords, setResumeKeywords] = useState([]);

  const [coverLetterKeywords, setCoverLetterKeywords] = useState([]);

  const [jobPostingKeywords, setJobPostingKeywords] = useState([]);

  const initialValues = {
    company: editing ? jobToEdit.company : '',
    dateApplied: editing ? format(new Date(jobToEdit.dateApplied.replace(/-/g, '\/')), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    jobDescription: editing ? jobToEdit.jobDescription : '',
    jobTitle: editing ? jobToEdit.jobTitle : '',
    status: editing ? jobToEdit.status : 'Active',
    jobPosting: editing ? jobToEdit.jobPosting : '',
    ats: editing ? jobToEdit.ats : '',
    coverLetter: editing ? jobToEdit.coverLetter : '',
    resume: editing ? jobToEdit.resume : '',
    notes: editing ? jobToEdit.notes : '',
    jobPostingKeyWords: editing ? jobToEdit.jobPostingKeyWords : [],
    coverLetterKeyWords: editing ? jobToEdit.coverLetterKeyWords : [],
    resumeKeyWords: editing ? jobToEdit.resumeKeyWords : [],
    missingKeyWords: editing ? jobToEdit.missingKeyWords : [],
    score: editing ? jobToEdit.score : 0,
    user: editing ? jobToEdit.user : ''
  }

  const [formValues, setFormValues] = useState(initialValues);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newFormValues = { ...initialValues };
    setFormValues({
      ...formValues,
      ...newFormValues
    });
  }, [editing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const validateFormFields = (e) => {
    e.preventDefault();
    if (!formValues.company || !formValues.jobTitle) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Please fill out at least the "Company" and "Job Title" sections before submitting.'
      });
    } else {
      if (editing) {
        createJob();
        setFeedback({
          ...feedback,
          open: true,
          type: 'info',
          title: 'Updated',
          message: `${formValues.company} has successfully been updated in your list`
        });
      } else {
        createJob();
        setFeedback({
          ...feedback,
          open: true,
          type: 'success',
          title: 'Added',
          message: `${formValues.company} has successfully been added to your list!`
        });
      }
    }
  }

  const createJob = async () => {
    !editing
      ? await addDoc(jobsReference, {
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
        score: !formValues.coverLetter && !formValues.resume && !formValues.jobDescription ? 0
          : getScore(formValues.coverLetter, formValues.resume, formValues.jobDescription),
        user: user?.uid
      })
      : await updateDoc(doc(db, 'jobs', jobToEdit.id), {
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
        score: !formValues.coverLetter && !formValues.resume && !formValues.jobDescription ? 0
          : getScore(formValues.coverLetter, formValues.resume, formValues.jobDescription),
        user: user?.uid,
        id: jobToEdit.id
      });
    getJobs();
    setEditing(false);
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
    const percentage = jobDescription.length > 0
      ? newYourScore / newTotalScore * 100
      : 0;

    return parseInt(percentage.toFixed(0));
  }

  const readFile = (file, id) => {
    file = document.getElementById(id).files[0];
    const URLObject = URL.createObjectURL(file);
    return URLObject;
  }

  const handleModalKeywordExtraction = (doc, docType) => {
    const newDocKeywords = extractKeyWords(doc);
    if (docType === 'resume') {
      setResumeKeywords(newDocKeywords);
    } else if (docType === 'coverLetter') {
      setCoverLetterKeywords(newDocKeywords);
    } else if (docType === 'jobPosting') {
      setJobPostingKeywords(newDocKeywords);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setResumeKeywords([]);
      setCoverLetterKeywords([]);
      setJobPostingKeywords([]);
    }, 500);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle} className='modal'>
            <Typography variant='h6' component='h2'>
              {jobPostingKeywords.length === 0
                ? 'No Keywords Found'
                : `We Found ${jobPostingKeywords.length} Keywords For You`
              }
            </Typography>
            <Typography component='h3'>
              {jobPostingKeywords.length === 0
                ? null
                : <em>{getScore(formValues.coverLetter, formValues.resume, formValues.jobDescription)}% of them have been address so far.</em>
              }
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {jobPostingKeywords.length === 0
                ? 'Try adding the entire job description.'
                : jobPostingKeywords.map(keyword => {
                  return (
                    <List dense={true} disablePadding>
                      {coverLetterKeywords.includes(keyword) || resumeKeywords.includes(keyword)
                        ? <ListItem disablePadding><ListItemIcon><Check color='success' /></ListItemIcon><ListItemText primary={keyword[0].toUpperCase() + keyword.slice(1)} /></ListItem>
                        : <ListItem disablePadding><ListItemIcon><Close color='error' /></ListItemIcon><ListItemText sx={{ color: 'red' }} primary={<strong>{keyword[0].toUpperCase() + keyword.slice(1)}</strong>} /></ListItem>
                      }
                    </List>
                  )
                })}
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Grid
        display='flex'
      >
        <form method='POST' action='#' onSubmit={(e) => validateFormFields(e)}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="start"
            spacing={2}
          >
            <Grid lg={6} item>
              <TextField
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                autoFocus
                type='text'
                name='company'
                label='Company'
                onChange={handleInputChange}
                value={formValues.company}
                fullWidth
              />
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
            </Grid>
            <Grid lg={6} item>
              <Grid
                sx={{
                  mb: 2,
                }}
                container
                spacing={2}
              >
                <Grid
                  item
                  sm={8}
                >
                  <Tooltip
                    placement='left'
                    title='Insert the entire job description text'
                    arrow
                  >
                    <TextField
                      sx={{
                        zIndex: 0
                      }}
                      type='text'
                      name='jobDescription'
                      label='Job Description'
                      onChange={handleInputChange}
                      value={formValues.jobDescription}
                      fullWidth />
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  sm={4}
                >
                  <Button
                    sx={{
                      height: '100%'
                    }}
                    fullWidth
                    type='button'
                    variant='contained'
                    color='success'
                    onClick={() => (setOpen(true), handleModalKeywordExtraction(formValues.jobDescription, 'jobPosting'), handleModalKeywordExtraction(formValues.resume, 'resume'), handleModalKeywordExtraction(formValues.coverLetter, 'coverLetter'))}
                    disabled={!formValues.jobDescription ? true : false}
                  >
                    Keywords
                  </Button>
                </Grid>
              </Grid>
              <Tooltip
                placement='left'
                title='Insert the entire resume text'
                arrow
              >
                <TextField
                  sx={{
                    mb: 2,
                    zIndex: 0
                  }}
                  type='text'
                  name='resume'
                  label='Resume'
                  onChange={handleInputChange}
                  value={formValues.resume}
                  fullWidth />
              </Tooltip>
              <Tooltip
                placement='left'
                title='Insert the entire cover letter text'
                arrow
              >
                <TextField
                  sx={{
                    mb: 2,
                    zIndex: 0
                  }}
                  type='text'
                  name='coverLetter'
                  label='Cover Letter'
                  onChange={handleInputChange}
                  value={formValues.coverLetter}
                  fullWidth />
              </Tooltip>
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
            </Grid>
          </Grid>
          <Button
            sx={{
              background: 'linear-gradient(270deg, rgb(69, 69, 255), rgb(221, 192, 255))',
              fontSize: 18,
            }}
            type='submit'
            variant='contained'
            startIcon={<AddBoxTwoTone />}
            fullWidth
          >
            {editing ? `Update ${formValues.company}` : 'ADD TO LIST'}
          </Button>
          {editing
            ? <Button
              sx={{
                mt: 2
              }}
              type='button'
              variant='contained'
              color='error'
              fullWidth
              onClick={() => (
                setEditing(!editing),
                handleSetOpen(false)
              )}
            >
              Cancel
            </Button>
            : null
          }
        </form >
      </Grid>
    </>
  );
};

export default NewJob;