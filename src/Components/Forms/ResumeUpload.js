import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  updateDoc,
  doc,
} from 'firebase/firestore';

const ResumeUpload = (props) => {

  const {
    resume,
    setResume,
    feedback,
    setFeedback,
    userReference,
    currentUser,
    handleClose,
    getJobs
  } = props;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setResume(value);
  }

  const validateFormFields = (e) => {
    e.preventDefault();
    if (resume) {
      uploadResume(resume);
      handleClose();
      getJobs()
    } else {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Resume must be filled out before submitting.'
      });
    }
  }

  const uploadResume = async (resume) => {
    const docToUpdate = doc(userReference, currentUser.id);
    await updateDoc(docToUpdate, { storedResume: resume });
    setFeedback({
      ...feedback,
      open: true,
      type: 'success',
      title: 'Uploaded',
      message: 'You have successfully stored your resume for future applications to read.'
    });
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%'
      }}
    >
      <form method='POST' action='#' onSubmit={(e) => validateFormFields(e)}>
        <TextField
          label='Resume'
          name='resume'
          fullWidth
          multiline
          rows={25}
          value={resume}
          onChange={handleInputChange}
          helperText='Upload your resume to be used in future job application scoring'
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          sx={{
            mt: 2
          }}
          type='submit'
          variant='contained'
          color='info'
          fullWidth
        >
          Upload resume
        </Button>
      </form>
    </Box>
  )
}

export default ResumeUpload;