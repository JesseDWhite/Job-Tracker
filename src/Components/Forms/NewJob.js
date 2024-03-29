/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Modal,
  Fade,
  Backdrop,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Check, Close, Http, CancelRounded } from '@mui/icons-material';
import {
  updateDoc,
  addDoc,
  doc
} from 'firebase/firestore';
import { KEYWORDS } from '../../Constants/Keywords';
import format from 'date-fns/format';
import strCompare from 'str-compare';
import { THEME } from '../../Layout/Theme';
import { storage } from '../../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderIcon from '@mui/icons-material/Folder';

const NewJob = (props) => {

  const {
    subCollection,
    getJobs,
    user,
    editing,
    setEditing,
    jobToEdit,
    handleSetOpen,
    feedback,
    setFeedback,
    themeMode,
    currentUser,
    width,
  } = props;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width < 600 ? '95%' : 400,
    maxHeight: '85%',
    bgcolor: THEME[themeMode].card,
    color: THEME[themeMode].textColor,
    borderRadius: 5,
    boxShadow: 24,
    p: width <= 600 ? 0 : 4,
    overflowY: 'auto',
    border: THEME[themeMode].border
  };

  const [resumeKeywords, setResumeKeywords] = useState([]);

  const [coverLetterKeywords, setCoverLetterKeywords] = useState([]);

  const [jobPostingKeywords, setJobPostingKeywords] = useState([]);

  const [status, setStatus] = useState('Active');

  const [error, setError] = useState({})

  const initialValues = {
    company: editing ? jobToEdit.company : '',
    dateApplied: editing ? format(new Date(jobToEdit.dateApplied.replace(/-/g, '/')), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    jobDescription: editing ? jobToEdit.jobDescription : '',
    jobTitle: editing ? jobToEdit.jobTitle : '',
    status: status,
    jobPosting: editing ? jobToEdit.jobPosting : '',
    ats: editing ? jobToEdit.ats : '',
    resumeLink: editing ? jobToEdit.resumeLink : '',
    coverLetterLink: editing ? jobToEdit.coverLetterLink : '',
    coverLetter: editing ? jobToEdit.coverLetter : '',
    resume: editing ? jobToEdit.resume : currentUser?.storedResume ? currentUser.storedResume : '',
    notes: editing ? jobToEdit.notes : '',
    jobPostingKeyWords: editing ? jobToEdit.jobPostingKeyWords : [],
    coverLetterKeyWords: editing ? jobToEdit.coverLetterKeyWords : [],
    resumeKeyWords: editing ? jobToEdit.resumeKeyWords : [],
    missingKeyWords: editing ? jobToEdit.missingKeyWords : [],
    score: editing ? jobToEdit.score : 0,
    user: editing ? jobToEdit.user : '',
    interviewPrep: editing ? jobToEdit.interviewPrep : [],
    jobHardSkills: editing ? jobToEdit.jobHardSkills : [],
    jobSoftSkills: editing ? jobToEdit.jobSoftSkills : [],
    personalHardSkills: editing ? jobToEdit.personalHardSkills : [],
    personalSoftSkills: editing ? jobToEdit.personalSoftSkills : [],
    resumeFile: editing ? jobToEdit?.resumeFile : '',
    coverLetterFile: editing ? jobToEdit?.coverLetterFile : '',
  }

  // const initialFiles = {
  //   resumeFile: editing ? jobToEdit?.resumeFile : '',
  //   coverLetterFile: editing ? jobToEdit?.coverLetterFile : '',
  // }

  const [formValues, setFormValues] = useState(initialValues);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // const [file, setFile] = useState(initialFiles);

  useEffect(() => {
    if (editing) { setStatus(jobToEdit.status); }
    const newFormValues = { ...initialValues };
    setFormValues({
      ...formValues,
      ...newFormValues
    });
  }, [editing]);

  const handleErrorState = () => {
    const requiredFields = ['company', 'dateApplied', 'jobTitle', 'status', 'coverLetter', 'resume', 'coverLetterLink', 'resumeLink'];
    const formValuesCopy = { ...formValues };
    const validator = new RegExp(/^(https ?| ftp):\/\/[^\s\/$.?#].[^\s]*$/);
    let newErrorState = Object.assign(...requiredFields.map(key => ({
      [key]: !formValuesCopy[key] ? true : false
    })));
    if (formValues.coverLetter) {
      if (validator.test(formValuesCopy.coverLetter)) {
        newErrorState['coverLetter'] = true;
      }
    } else {
      newErrorState['coverLetter'] = false;
    }
    if (formValues.resume) {
      if (validator.test(formValuesCopy.resume)) {
        newErrorState['resume'] = true;
      }
    } else {
      newErrorState['resume'] = false;
    }
    if (formValues.coverLetterLink) {
      if (!validator.test(formValuesCopy.coverLetterLink)) {
        newErrorState['coverLetterLink'] = true;
      }
    } else {
      newErrorState['coverLetterLink'] = false;
    }
    if (formValues.resumeLink) {
      if (!validator.test(formValuesCopy.resumeLink)) {
        newErrorState['resumeLink'] = true;
      }
    } else {
      newErrorState['resumeLink'] = false;
    }
    setError(newErrorState);
    return newErrorState;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFile({
  //     ...file,
  //     [name]: files[0]
  //   });
  // };

  const handleToggleChange = (e, newStatus) => {
    setStatus(newStatus);
    setFormValues({
      ...formValues,
      status: newStatus
    });
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

  const validateFormFields = async (e) => {
    const errorState = handleErrorState();
    const errors = Object.values(errorState);
    const validator = (field) => field === true;
    e.preventDefault();
    if (errors.some(validator)) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Please complete the required fields before submitting.'
      });
    } else {
      if (editing) {
        createJob();
        setFeedback({
          ...feedback,
          open: true,
          type: 'info',
          title: 'Updated',
          message: `${formValues.jobTitle} has successfully been updated in your list`
        });
      } else {
        createJob();
        setFeedback({
          ...feedback,
          open: true,
          type: 'success',
          title: 'Added',
          message: `${formValues.jobTitle} has successfully been added to your list!`
        });
      }
    }
  }

  const createJob = async () => {
    if (editing) {
      await updateDoc(doc(subCollection, jobToEdit.id), {
        company: formValues.company,
        dateApplied: formValues.dateApplied,
        jobDescription: formValues.jobDescription,
        jobTitle: formValues.jobTitle,
        status: status,
        jobPosting: formValues.jobPosting,
        ats: formValues.ats,
        resumeLink: formValues.resumeLink,
        coverLetterLink: formValues.coverLetterLink,
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
        id: jobToEdit.id,
        jobHardSkills: formValues.jobHardSkills,
        jobSoftSkills: formValues.jobSoftSkills,
        personalHardSkills: formValues.personalHardSkills,
        personalSoftSkills: formValues.personalSoftSkills,
        interviewPrep: formValues.interviewPrep,
      });
    } else {
      await addDoc(subCollection, {
        company: formValues.company,
        dateApplied: formValues.dateApplied,
        jobDescription: formValues.jobDescription,
        jobTitle: formValues.jobTitle,
        status: status,
        jobPosting: formValues.jobPosting,
        ats: formValues.ats,
        resumeLink: formValues.resumeLink,
        coverLetterLink: formValues.coverLetterLink,
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
        jobHardSkills: formValues.jobHardSkills,
        jobSoftSkills: formValues.jobSoftSkills,
        personalHardSkills: formValues.personalHardSkills,
        personalSoftSkills: formValues.personalSoftSkills,
        interviewPrep: formValues.interviewPrep,
        // resumeFile: null !== file.resumeFile ? uploadResume(file.resumeFile) : '',
        // coverLetterFile: null !== file.coverLetterFile ? uploadCoverLetter(file.coverLetterFile) : ''
      });
    }
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

    docKeyWordsNoDups.sort();

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

    missingKeyWordsNoDups.sort();

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
    let percentage = jobDescription.length > 0
      ? newYourScore / newTotalScore * 100
      : 0;
    if (percentage > 100) percentage = 100;

    return parseInt(percentage.toFixed(0));
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
      // setFile({});
    }, 500);
  }

  const uploadResume = (doc) => {
    const docName = doc.name + v4();
    const fileRef = ref(storage, `resumes/${docName}`);
    uploadBytes(fileRef, doc);
    return 'resumes/' + docName;
  }

  const uploadCoverLetter = (doc) => {
    const docName = doc.name + v4();
    const fileRef = ref(storage, `coverLetters/${docName}`);
    uploadBytes(fileRef, doc);
    return 'coverLetters/' + docName;
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
            {width <= 600 &&
              <IconButton
                component='span'
                onClick={() => handleClose()}
                sx={{
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  display: 'inline-block'
                }}
              >
                <CancelRounded />
              </IconButton>
            }
            <Box
              sx={{
                px: width <= 600 ? 4 : 0,
                pb: width <= 600 ? 4 : 0
              }}
            >
              <Typography variant='h6' component='h2'>
                {jobPostingKeywords.length === 0
                  ? 'No Keywords Found'
                  : `We Found ${jobPostingKeywords.length} Keywords For You`
                }
              </Typography>
              <Typography component='h3'>
                {jobPostingKeywords.length !== 0 &&
                  <em>{getScore(formValues.coverLetter, formValues.resume, formValues.jobDescription)}% of them have been addressed so far.</em>
                }
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {jobPostingKeywords.length === 0
                  ? 'Try adding the entire job description.'
                  : jobPostingKeywords.map((keyword, idx) => {
                    return (
                      <List dense={true} disablePadding>
                        {coverLetterKeywords.includes(keyword) || resumeKeywords.includes(keyword)
                          ? <ListItem key={keyword.concat(idx)} disablePadding><ListItemIcon><Check color='success' /></ListItemIcon><ListItemText primary={keyword[0].toUpperCase() + keyword.slice(1)} /></ListItem>
                          : <ListItem key={keyword.concat(idx)} disablePadding><ListItemIcon><Close color='error' /></ListItemIcon><ListItemText sx={{ color: 'red' }} primary={<strong>{keyword[0].toUpperCase() + keyword.slice(1)}</strong>} /></ListItem>
                        }
                      </List>
                    )
                  })}
              </Typography>
            </Box>
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
            sx={{
              px: width <= 600 ? 4 : 0
            }}
          >
            <Grid xl={6} item>
              <Typography variant='h4' sx={{ textAlign: 'center' }}>Application Info</Typography>
              <Grid
                container
                direction='row'
                justifyContent='space-around'
                sx={{
                  my: 2
                }}
              >
                <ToggleButtonGroup
                  color={getToggleButtonColor(status)}
                  size='small'
                  value={status}
                  name='status'
                  exclusive
                  onChange={handleToggleChange}
                  fullWidth
                  sx={{
                    border: error.status && '1px solid red'
                  }}
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
              </Grid>
              <TextField
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                autoFocus
                size='small'
                type='text'
                name='company'
                label='Company'
                onChange={handleInputChange}
                value={formValues.company}
                fullWidth
                error={error.company}
              />
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                size='small'
                type='text'
                name='jobTitle'
                label='Job Title'
                onChange={handleInputChange}
                value={formValues.jobTitle}
                error={error.jobTitle}
              />
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                size='small'
                type='date'
                name='dateApplied'
                label='Date Applied'
                onChange={handleInputChange}
                value={formValues.dateApplied}
                error={error.dateApplied}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Http /></InputAdornment>
                }}
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                size='small'
                type='text'
                name='jobPosting'
                label='Link To Job Posting'
                onChange={handleInputChange}
                value={formValues.jobPosting}
                fullWidth />
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Http /></InputAdornment>
                }}
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                size='small'
                type='text'
                name='resumeLink'
                label='Link To Resume'
                onChange={handleInputChange}
                error={error.resumeLink}
                helperText={error.resumeLink ? "This doesn't look like a valid url." : false}
                value={formValues.resumeLink}
              />
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Http /></InputAdornment>
                }}
                sx={{
                  mb: 2,
                  zIndex: 0
                }}
                size='small'
                type='text'
                name='coverLetterLink'
                label='Link To Cover Letter'
                onChange={handleInputChange}
                error={error.coverLetterLink}
                helperText={error.coverLetterLink ? "This doesn't look like a valid url." : false}
                value={formValues.coverLetterLink}
              />
              {/* <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="start"
                spacing={2}
              >
                <Grid sm={6} item>
                  <Button
                    startIcon={file.resumeFile ? <FolderIcon /> : <FolderOutlinedIcon />}
                    component='label'
                    variant={THEME[themeMode].buttonStyle}
                    fullWidth
                    color='info'
                  >
                    <input hidden type="file" name='resumeFile' accept="application/pdf" onChange={handleFileChange} />
                    Resume
                  </Button>
                </Grid>
                <Grid sm={6} item>
                  <Button
                    startIcon={file.coverLetterFile ? <FolderIcon /> : <FolderOutlinedIcon />}
                    component='label'
                    variant={THEME[themeMode].buttonStyle}
                    fullWidth
                    color='info'
                  >
                    <input hidden type="file" name='coverLetterFile' accept="application/pdf" onChange={handleFileChange} />
                    Cover Letter
                  </Button>
                </Grid>
              </Grid> */}
            </Grid>
            <Grid xl={6} item>
              <Typography variant='h4' sx={{ textAlign: 'center', mb: 2 }}>Grade Application</Typography>
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
                  xs={12}
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
                      size='small'
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
                  xs={12}
                >
                  <Button
                    sx={{
                      height: '100%'
                    }}
                    fullWidth
                    type='button'
                    variant={THEME[themeMode].buttonStyle}
                    color='success'
                    onClick={() => ((setOpen(true), handleModalKeywordExtraction(formValues.jobDescription, 'jobPosting'), handleModalKeywordExtraction(formValues.resume, 'resume'), handleModalKeywordExtraction(formValues.coverLetter, 'coverLetter')))}
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
                  size='small'
                  type='text'
                  name='resume'
                  label='Resume'
                  onChange={handleInputChange}
                  value={formValues.resume}
                  error={error.resume}
                  helperText={error.resume ? 'This belongs in "Link To Resume" field.' : false}
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
                  size='small'
                  type='text'
                  name='coverLetter'
                  label='Cover Letter'
                  onChange={handleInputChange}
                  value={formValues.coverLetter}
                  error={error.coverLetter}
                  helperText={error.coverLetter ? 'This belongs in "Link To Cover Letter" field.' : false}
                  fullWidth />
              </Tooltip>
              <TextField sx={{
                mb: 2,
                zIndex: 0
              }}
                size='small'
                type='text'
                name='notes'
                label='Notes'
                multiline
                rows={6}
                onChange={handleInputChange}
                value={formValues.notes}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
              px: width <= 600 ? 4 : 0,
              pb: width <= 600 ? 4 : 0
            }}
          >
            <Grid
              item
              sm={editing ? 6 : 12}
              xs={12}
            >
              <Button
                sx={{
                  fontSize: 18,
                }}
                type='submit'
                color='primary'
                variant={THEME[themeMode].buttonStyle}
                disabled={loading}
                fullWidth
              >
                {editing ? 'Update' : 'ADD TO LIST'}
                {loading && <CircularProgress
                  color='success'
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-16px',
                    marginLeft: '-16px',
                  }}
                  disableShrink
                  size='2rem'
                  thickness={7}
                />}
              </Button>
            </Grid>
            {editing
              ?
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Button
                  sx={{
                    fontSize: 18,
                  }}
                  type='button'
                  variant={THEME[themeMode].buttonStyle}
                  color='error'
                  fullWidth
                  disabled={loading}
                  onClick={() => ((setEditing(!editing), handleSetOpen(false)))}
                >
                  Cancel
                </Button>
              </Grid>
              : null
            }
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default NewJob;