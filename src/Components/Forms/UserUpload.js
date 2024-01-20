import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip
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
import { eachMonthOfInterval, format, subMonths } from 'date-fns'
import { THEME } from '../../Layout/Theme';

const UserUpload = (props) => {

  const {
    organization,
    organizationReference,
    setOpen,
    setFeedback,
    feedback,
    cohortList,
    getStudents,
    currentUser,
    themeMode
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

  const [advisors, setAdvisors] = useState([]);

  const subCollection = collection(organizationReference, `${organization.accessToken}/approvedUsers`);

  const handleSelectChange = (e) => {
    setCohort(e.target.value);
    getUsersToEdit(e.target.value);
  }

  const getAdvisors = async () => {
    const q = query(subCollection, where('cohort', '==', 'Advisors'));
    const qSnapShot = await getDocs(q);
    const qResults = qSnapShot.docs.map((advisor) => ({
      ...advisor.data(), id: advisor.id
    }));
    setAdvisors(qResults);
  }

  useEffect(() => {
    getAdvisors();
  }, []);

  const getLastYear = () => {
    const today = new Date();
    const yearAndAHalf = subMonths(today, 18);
    const lastYear = eachMonthOfInterval({
      start: yearAndAHalf,
      end: today
    });
    const convertedYears = lastYear.map(year => {
      return format(year, 'LLLL') + ' ' + format(year, 'y');
    });
    convertedYears.push('Advisors');
    const sortedList = convertedYears.reverse();

    return sortedList;
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
      if (newFormValues.length > 1) {
        newFormValues.splice(idx, 1);
        setFormValues(newFormValues);
      } else {
        setFormValues([initialValues]);
      }
      if (editing) await deleteDoc(doc(subCollection, id));
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
        px: width <= 600 ? 4 : 0,
        pb: width <= 600 ? 4 : 0
      }}
    >
      <Grid>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Manage Users Assigned To {organization.name}
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            mb: 2,
          }}
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <Button
              variant={THEME[themeMode].buttonStyle}
              component='label'
              endIcon={<PeopleAltTwoToneIcon />}
              fullWidth
            >
              <input type="file" onChange={(e) => handleFile(e)} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' hidden />
              Bulk Upload
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={() => editing ? (setEditing(false), setFormValues([initialValues], setCohort(''))) : setEditing(true)}
              variant={THEME[themeMode].buttonStyle}
              endIcon={editing ? <CloseRoundedIcon /> : <EditTwoToneIcon />}
              fullWidth
            >
              {editing ? 'Cancel' : 'Edit Existing'}
            </Button>
            <Grid item xs={12}>
              {loading && !editing ? <CircularProgress color='success' sx={{ ml: 2 }} disableShrink /> : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {editing &&
        <Grid
          sx={{ mb: 2 }}
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={10} sm={6}>
            <FormControl
              size='small'
              fullWidth
            >
              <InputLabel>Cohort To Edit</InputLabel>
              <Select
                label='Cohort To Edit'
                value={cohort.cohort}
                onChange={handleSelectChange}
              >
                {cohortList.map(cohort => {
                  return (<MenuItem value={cohort.cohort}>
                    {cohort.cohort}
                    {cohort.count > 0
                      && <Chip
                        sx={{
                          ml: 1
                        }}
                        label={cohort.count}
                        variant='contained'
                        size='small'
                      />
                    }
                  </MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            {loading && editing ? <CircularProgress sx={{ ml: 2, mt: 2 }} color='success' disableShrink /> : null}
          </Grid>
        </Grid>
      }
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
                    zIndex: 0,
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
                    <MenuItem value='Admin'>Admin</MenuItem>
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
                    {getLastYear().map(cohort => {
                      return <MenuItem key={cohort} value={cohort}>{cohort}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  sx={{
                    mb: 2,
                    zIndex: 0,
                  }}
                  size='small'
                  fullWidth>
                  <InputLabel>Advisor</InputLabel>
                  <Select
                    name='advisor'
                    label='Advisor'
                    onChange={(e) => handleInputChange(e, idx)}
                    value={entry.advisor}
                  >
                    {advisors.map(adv => {
                      return <MenuItem key={adv.id} value={adv.name}>{adv.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
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
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={THEME[themeMode].buttonStyle}
              color='success'
              type='button'
              disabled={editing || loading ? true : false}
              onClick={() => addNewEntry()}
            >
              Add Entry
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type='submit'
              variant={THEME[themeMode].buttonStyle}
              fullWidth
              disabled={loading}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default UserUpload;