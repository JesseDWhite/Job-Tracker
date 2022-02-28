import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Box,
  Select,
  Switch,
  MenuItem,
  InputLabel,
  IconButton
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  addDoc,
  doc,
  query,
  where,
  collection,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

const UserUpload = (props) => {

  const {
    organization,
    organizationReference,
    setOpen,
    setFeedback,
    feedback,
    cohortList
  } = props;

  const initialValues =
  {
    name: '',
    email: '',
    role: '',
    cohort: '',
    advisor: '',
    advisorId: ''
  }


  const [formValues, setFormValues] = useState([initialValues]);

  const [editing, setEditing] = useState(false);

  const [cohort, setCohort] = useState('');

  const subCollection = collection(organizationReference, `${organization.accessToken}/approvedUsers`);

  const handleSelectChange = (e) => {
    setCohort(e.target.value);
  }

  const addUserList = async (e) => {
    e.preventDefault();
    try {
      if (!editing) {
        formValues.forEach(user => {
          addDoc(subCollection, user);
        });
        setOpen(false);
        setFeedback({
          ...feedback,
          open: true,
          type: 'success',
          title: 'Added',
          message: `${formValues.length} ${formValues.length > 1 ? 'users have' : 'user has'} successfully been added to ${organization.name}`
        });
      } else {
        formValues.forEach(user => {
          setDoc(doc(subCollection, user.id), user);
        });
        setOpen(false);
        setFeedback({
          ...feedback,
          open: true,
          type: 'info',
          title: 'Updated',
          message: `Users assigned to ${organization.name} have successfully been updated`
        });
      }
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue connecting to ${organization.name}, please try again`
      });
    }
  }

  const getUsersToEdit = async (date) => {
    try {
      const userQuery = query(subCollection, where('cohort', '==', date));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.docs[0]?.data()) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `There are no users assined to the ${date} cohort yet`
        });
      } else {
        const results = querySnapshot.docs.map((user) => {
          return { ...user.data(), id: user.id }
        });
        setFormValues(results);
      }
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue connecting to ${organization.name}, please try again`
      });
    }
  }

  const handleInputChange = (e, idx) => {
    const { name, value } = e.target;
    const updatedForm = [...formValues];
    updatedForm[idx] = { ...updatedForm[idx], [name]: value }
    setFormValues(updatedForm);
  };

  const addNewEntry = () => {
    const newFormValues = [...formValues];
    newFormValues[newFormValues.length] = initialValues;
    setFormValues(newFormValues);
  }

  const deleteEntry = async (idx, id) => {
    if (id) {
      const newFormValues = [...formValues];
      newFormValues.splice(idx, 1);
      setFormValues(newFormValues);
      if (editing) {
        await deleteDoc(doc(subCollection, id));
      }
    }
  }

  return (
    <Box>
      <Grid>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Add Users You Would Like In {organization.name}
        </Typography>
        <FormControlLabel
          sx={{ mb: 1 }}
          control={<Switch />}
          label='Edit Existing'
          checked={editing}
          onChange={() => setEditing(!editing)}
        />
      </Grid>
      {editing
        ? <Grid
          sx={{ mb: 3 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item md={8}>
            <FormControl size='small' fullWidth>
              <InputLabel>Cohort To Edit</InputLabel>
              <Select
                value={cohort}
                onChange={handleSelectChange}
              >
                {cohortList.map(cohort => {
                  return (
                    <MenuItem value={cohort}>{cohort}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={4}>
            <Button sx={{ height: '100%' }} fullWidth color='primary' variant='contained' onClick={() => getUsersToEdit(cohort)}>Find Cohort</Button>
          </Grid>
        </Grid>
        : null
      }
      <Grid display='flex'>
        <form action="#" method='POST' onSubmit={(e) => addUserList(e)}>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="start"
            spacing={2}
          >
            {formValues.map((entry, idx) => {
              return (
                <Grid sm={6} item>
                  <Typography>
                    <IconButton color='error' disabled={editing ? false : formValues.length > 1 ? false : true} onClick={() => deleteEntry(idx, entry.id)}>
                      <DeleteTwoToneIcon />
                    </IconButton>
                    User # {idx + 1}
                  </Typography>
                  <TextField
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    autoFocus
                    type='text'
                    name='name'
                    label='Name'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.name}
                    fullWidth
                    size='small'
                  />
                  <TextField
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    required
                    type='text'
                    name='email'
                    label='Email'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.email}
                    fullWidth
                    size='small'
                  />
                  <FormControl
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    size='small'
                    fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name='role'
                      onChange={(e) => handleInputChange(e, idx)}
                    >
                      <MenuItem value='Student'>Student</MenuItem>
                      <MenuItem value='Alumni'>Alumni</MenuItem>
                      <MenuItem value='Advisor'>Advisor</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    required
                    size='small'
                    fullWidth>
                    <InputLabel>Cohort</InputLabel>
                    <Select
                      name='cohort'
                      onChange={(e) => handleInputChange(e, idx)}
                    >
                      {cohortList.map(cohort => {
                        return (
                          <MenuItem value={cohort}>{cohort}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    type='text'
                    name='advisor'
                    label='Advisor'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.advisor}
                    size='small'
                  />
                </Grid>
              )
            })}
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="start"
            spacing={2}
          >
            <Grid item sm={6}>
              <Button
                fullWidth
                variant='contained'
                color='success'
                type='button'
                disabled={editing ? true : false}
                onClick={() => addNewEntry()}
              >
                Add Entry
              </Button>
            </Grid>
            <Grid item sm={6}>
              <Button
                type='submit'
                variant='contained'
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
}

export default UserUpload;