import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  updateDoc,
  getDocs,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { format, subMonths } from 'date-fns'
import { THEME } from '../../Layout/Theme';

const UpdateProfile = (props) => {

  const {
    username,
    setUsername,
    feedback,
    setFeedback,
    userReference,
    currentUser,
    handleClose,
    getJobs,
    subCollection,
    themeMode
  } = props;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  }

  const [stashName] = useState(username);

  const handleAdvisorNameChange = async () => {
    if (currentUser.role === 'Advisor' && username !== stashName) {
      //need to update all of the current cohort member advisor names to the new one here
      const today = new Date();
      const yearAndAHalf = subMonths(today, 18);
      const formattedDate = format(yearAndAHalf, 'LLLL') + ' ' + format(yearAndAHalf, 'y');

      try {
        const queryOne = query(subCollection, (where('cohort', '>=', formattedDate), where('advisor', '==', stashName)));
        const queryTwo = query(subCollection, (where('cohort', '==', 'advisors'), where('advisor', '==', stashName)));
        const students = await getDocs(queryOne);
        const advisors = await getDocs(queryTwo);
        const extractStudents = students.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }));
        const extractAdvisors = advisors.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }));
        const combineLists = extractStudents.concat(extractAdvisors);
        for (let i = 0; i < combineLists.length; i++) {
          if (combineLists[i].advisor === stashName) {
            const docToUpdate = doc(subCollection, combineLists[i].id);
            await updateDoc(docToUpdate, { advisor: username });
          }
        }
      } catch (error) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `There was an issue updating your username.`
        });
      }

    }
    if (currentUser.internalId && currentUser.accessToken) {
      try {
        const docToUpdate = doc(subCollection, currentUser.internalId);
        await updateDoc(docToUpdate, { name: username });
      } catch (error) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `There was an issue updating your username.`
        });
      }

    }
  }

  const validateFormFields = (e) => {
    e.preventDefault();
    if (username) {
      updateProfile(username);
      handleClose();
      getJobs();
    } else {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Username cannot be blank.'
      });
    }
  }

  const updateProfile = async (name) => {
    try {
      const docToUpdate = doc(userReference, currentUser.id);
      await updateDoc(docToUpdate, { name: name });
      handleAdvisorNameChange();
      setFeedback({
        ...feedback,
        open: true,
        type: 'success',
        title: 'Uploaded',
        message: 'You have successfully updated your profile.'
      });
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue updating your username.`
      });
    }

  }

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

  return (
    <Box
      sx={{
        height: '100%',
        px: width <= 600 ? 4 : 0,
        pb: width <= 600 ? 4 : 0
      }}
    >
      <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
        Update Your Information
      </Typography>
      <form method='POST' action='#' onSubmit={(e) => validateFormFields(e)}>
        <TextField
          label='Username'
          name='username'
          fullWidth
          value={username}
          onChange={handleInputChange}
          helperText='More options to come in later update'
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
          Update Profile
        </Button>
      </form>
    </Box>
  )
}

export default UpdateProfile;