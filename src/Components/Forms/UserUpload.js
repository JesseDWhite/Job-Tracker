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
import {
  updateDoc,
  addDoc,
  doc
} from 'firebase/firestore';
import format from 'date-fns/format';
import { THEME } from '../../Layout/Theme';
import { createTheme } from '@mui/material/styles';

const UserUpload = () => {

  const initialValues =
  {
    email: '',
    role: '',
    cohort: '',
    advisor: '',
    advisorId: ''
  }

  const [formValues, setFormValues] = useState([initialValues]);

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

  const deleteEntry = (idx) => {
    if (formValues.length > 1) {
      const newFormValues = [...formValues];
      newFormValues.splice(idx, 1);
      setFormValues(newFormValues);
    }
  }

  return (
    <Box>
      <Typography component='h2' sx={{ mb: 3, textAlign: 'center' }}>
        Add Users You Would Like In Your Organization
      </Typography>
      <Grid display='flex'>
        <form action="#" method='POST'>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="start"
            spacing={2}
          >
            {formValues.map((entry, idx) => {
              return (
                <Box sx={{ m: 2 }}>
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
                    onClick={() => deleteEntry(idx)}
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
                  />
                </Box>
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