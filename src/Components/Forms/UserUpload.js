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
  ListItemText,
  Select,
  Switch,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Check, Close, AddBoxTwoTone } from '@mui/icons-material';
import {
  updateDoc,
  addDoc,
  doc,
  arrayUnion,
  query,
  where,
  collection,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import format from 'date-fns/format';
import { THEME } from '../../Layout/Theme';
import { createTheme } from '@mui/material/styles';

const UserUpload = (props) => {

  const {
    organization,
    organizationReference,
    currentUser,
    setOrganization
  } = props;

  const initialValues =
  {
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
      } else {
        formValues.forEach(user => {
          setDoc(doc(subCollection, user.id), user);
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const getUsersToEdit = async (date) => {
    try {
      const userQuery = query(subCollection, where('cohort', '==', date));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.docs[0]?.data()) {
        alert('No users for that cohort yet');
      } else {
        const results = querySnapshot.docs.map((user) => {
          return { ...user.data(), id: user.id }
        });
        setFormValues(results);
      }
    } catch (error) {
      alert(error.message);
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
    if (formValues.length > 1) {
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
          control={<Switch />}
          label='Edit Existing'
          checked={editing}
          onChange={() => setEditing(!editing)}
        />
      </Grid>
      {editing
        ? <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="start"
          spacing={2}
        >
          <Grid item md={8}>
            <FormControl fullWidth>
              <InputLabel>Cohort To Edit</InputLabel>
              <Select
                value={cohort}
                onChange={handleSelectChange}
              >
                <MenuItem value='March 2021'>March 2021</MenuItem>
                <MenuItem value='January 2021'>January 2021</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4}>
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
                <Grid md={6} item>
                  <Typography>
                    User # {idx + 1}
                  </Typography>
                  <Button
                    sx={{
                      my: 2
                    }}
                    type='button'
                    variant='contained'
                    color='error'
                    disabled={formValues.length > 1 ? false : true}
                    onClick={() => deleteEntry(idx, entry.id)}
                  >
                    Delete
                  </Button>
                  <TextField
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    autoFocus
                    type='text'
                    name='email'
                    label='Email'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.email}
                    fullWidth
                    size='small'
                  />
                  <TextField
                    fullWidth
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    type='text'
                    name='role'
                    label='Role'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.role}
                    size='small'
                  />
                  <TextField
                    fullWidth
                    sx={{
                      mb: 2,
                      zIndex: 0
                    }}
                    type='text'
                    name='cohort'
                    label='Cohort'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.cohort}
                    size='small'
                  />
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