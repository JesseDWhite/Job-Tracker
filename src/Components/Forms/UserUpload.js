import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  Box,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  CircularProgress
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
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import * as XLSX from 'xlsx';

const UserUpload = (props) => {

  const {
    organization,
    organizationReference,
    setOpen,
    setFeedback,
    feedback,
    cohortList,
    getStudents,
    currentUser
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

  const [loading, setLoading] = useState(false);

  const [cohort, setCohort] = useState('');

  const subCollection = collection(organizationReference, `${organization.accessToken}/approvedUsers`);

  const handleSelectChange = (e) => {
    setCohort(e.target.value);
    getUsersToEdit(e.target.value);
  }

  const addUserList = async (e) => {
    e.preventDefault();
    if (formValues.some(entry => !entry.email) || formValues.some(entry => !entry.cohort)) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Please fill out at least the "Email" and "Cohort" sections before submitting.'
      });
    } else {
      try {
        if (!editing) {
          formValues.forEach(user => {
            addDoc(subCollection, user);
          });
          getStudents(currentUser);
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
          getStudents(currentUser);
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
  }

  const getUsersToEdit = async (date) => {
    try {
      setLoading(true);
      const userQuery = query(subCollection, where('cohort', '==', date));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.docs[0]?.data()) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `There are no users assigned to the ${date} cohort yet`
        });
        setLoading(false);
        setFormValues([initialValues]);
      } else {
        const results = querySnapshot.docs.map((user) => {
          return { ...user.data(), id: user.id }
        });
        setLoading(false);
        setFormValues(results);
      }
    } catch (error) {
      setLoading(false);
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
    if (!formValues[idx].email && editing) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `You must select a cohort to edit before you can delete a field`
      });
    } else {
      const newFormValues = [...formValues];
      newFormValues.splice(idx, 1);
      setFormValues(newFormValues);
      if (editing) {
        await deleteDoc(doc(subCollection, id));
      }
    }
  }

  const handleFile = async (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const updatedForm = [...formValues];
      const bulkStudents = jsonData.map((student, idx) => {
        return {
          ...updatedForm[idx],
          name: student.Name,
          email: student.Email,
          role: student.Role,
          cohort: student.Cohort,
          advisor: student.Advisor,
        }
      });
      setFormValues(bulkStudents);
      setLoading(false);
    } catch {
      setLoading(false);
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue uploading this file. You may need to re-format how the data is being provided.`
      });
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Manage Users Assigned To {organization.name}
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          sx={{
            mb: 2
          }}
        >
          <Button
            variant='contained'
            component='label'
            endIcon={<PeopleAltTwoToneIcon />}
          >
            <input type="file" onChange={(e) => handleFile(e)} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' hidden />
            Bulk Upload
          </Button>
          <Button
            onClick={() => editing ? (setEditing(false), setFormValues([initialValues], setCohort(''))) : setEditing(true)}
            variant='contained'
            endIcon={editing ? <CloseRoundedIcon /> : <EditTwoToneIcon />}
            sx={{
              ml: 5
            }}
          >
            {editing ? 'Cancel' : 'Edit Existing'}
          </Button>
          {loading && <CircularProgress color='success' sx={{ ml: 2 }} disableShrink />}
        </Grid>
      </Grid>
      {editing &&
        <Grid
          sx={{ mb: 2 }}
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={3}
        >
          <Grid item sm={6}>
            <FormControl
              size='small'
              fullWidth
            >
              <InputLabel>Cohort To Edit</InputLabel>
              <Select
                label='Cohort To Edit'
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
        </Grid>
      }
      <Grid display='flex'>
        <form action="#" method='POST' onSubmit={(e) => addUserList(e)}>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="start"
            spacing={3}
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
                      label='Role'
                      onChange={(e) => handleInputChange(e, idx)}
                      value={entry.role}
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
                      label='Cohort'
                      value={entry.cohort}
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
            spacing={3}
          >
            <Grid item sm={6}>
              <Button
                fullWidth
                variant='contained'
                color='success'
                type='button'
                disabled={editing || loading ? true : false}
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
                disabled={loading ? true : false}
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