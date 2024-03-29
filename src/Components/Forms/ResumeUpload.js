import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
} from '@mui/material';
import {
  updateDoc,
  doc,
} from 'firebase/firestore';
import { THEME } from '../../Layout/Theme';

const ResumeUpload = (props) => {

  const {
    resume,
    setResume,
    feedback,
    setFeedback,
    userReference,
    currentUser,
    handleClose,
    getJobs,
    themeMode
  } = props;

  const getWindowDimensions = () => {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }

  const { width } = useWindowDimensions();

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
        height: '100%',
        px: width <= 600 ? 4 : 0,
        pb: width <= 600 ? 4 : 0
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
          variant={THEME[themeMode].buttonStyle}
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