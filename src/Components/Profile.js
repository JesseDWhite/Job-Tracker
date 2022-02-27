/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Grid,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Box,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  BackupTwoTone,
  KeyTwoTone,
  HighlightOffTwoTone,
  ApartmentTwoTone,
} from '@mui/icons-material';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { THEME } from '../Layout/Theme';
import { DataGrid } from '@mui/x-data-grid';
import Analytics from './Charts/Analytics';
import UserUpload from './Forms/UserUpload';

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser,
    themeMode,
    organization,
    setOrganization,
    organizationReference,
    userReference,
    getUserData
  } = props;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    maxHeight: '85%',
    bgcolor: THEME[themeMode].card,
    color: THEME[themeMode].textColor,
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto'
  };

  const [average, setAverage] = useState(0);

  const [open, setOpen] = useState(false);

  const [addToken, setAddToken] = useState(false);

  const [currentCohort, setCurrentCohort] = useState('March 2022');

  const [allStudents, setAllStudents] = useState([]);

  const [cohortStudents, setCohortStudents] = useState([]);

  const [accessToken, setAccessToken] = useState(currentUser?.accessToken);

  const subCollection = collection(organizationReference, `${organization.accessToken}/approvedUsers`);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleChange = (e) => {
    const { value } = e.target;
    setAccessToken(value);
  }

  const handleSelectChange = (e) => {
    setCurrentCohort(e.target.value);
  }

  const uploadAccessToken = async (token) => {
    const docToUpdate = doc(userReference, currentUser.id);
    await updateDoc(docToUpdate, { accessToken: token.trim() });
    setAddToken(false);
    getUserData();
  }

  const columnsTest = [
    // { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'cohort', headerName: 'Cohort', width: 200 },
    { field: 'email', headerName: 'Email', width: 400 },
    { field: 'role', headerName: 'Role', width: 200 },
  ];

  const getStudents = async (userData) => {
    if (userData?.role === 'Admin' || userData?.role === 'Advisor') {
      try {
        const q = query(subCollection, where('cohort', '==', currentCohort));
        const qSnapShot = await getDocs(q);
        const qResults = qSnapShot.docs.map((student) => ({
          ...student.data(), id: student.id
        }));
        const myStudents = qResults.filter(student => student.advisor === userData?.name);

        // const q2 = query(subCollection, where('advisor', '==', userData?.name));
        // const querySnapshot = await getDocs(q2);
        // const studentsList = querySnapshot.docs.map((student) => {
        //   return student.data();
        // });

        setCohortStudents(myStudents);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  const getTotalApplicationAverage = () => {
    const newJobs = [...jobs];
    setAverage(0);
    const averageToDivide = newJobs.length;
    newJobs.map(job => {
      return (
        setAverage(prevState => prevState += parseInt(job.score))
      )
    })
    setAverage(prevState => parseInt(prevState / averageToDivide));
  }

  useEffect(() => {
    getTotalApplicationAverage();
    getStudents(currentUser);
  }, [currentCohort]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle} className='modal'>
            <UserUpload
              setOpen={setOpen}
              organization={organization}
              organizationReference={organizationReference}
              currentUser={currentUser}
              setOrganization={setOrganization}
            />
          </Box>
        </Fade>
      </Modal>
      <Grid display='flex' sx={{ ml: 3, mr: 3 }}>
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="start"
          spacing={4}
        >
          <Grid sx={{ mt: 4 }} sm={6} xl={4} item>
            <Card
              elevation={3}
              sx={{
                maxWidth: 500,
                minHeight: '100%',
                p: 3,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor
              }}
              container
            >
              <Tooltip title='Add Token'>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 125,
                    left: 500
                  }}
                  color='warning'
                  onClick={() => setAddToken(true)}>
                  <KeyTwoTone />
                </IconButton>
              </Tooltip>
              <CardMedia
                sx={{
                  borderRadius: '100%',
                  width: 200,
                  objectFit: 'contain',
                  mr: 'auto',
                  ml: 'auto',
                  textAlign: 'center'
                }}
                component='img'
                alt='user profile photo'
                image={user?.photoURL.replace('s96-c', 's400-c')}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  component='div'
                  sx={{ textAlign: 'center' }}
                >
                  <Chip
                    sx={{ px: 3, fontSize: '1rem' }}
                    label={currentUser.role}
                    color='info'
                    variant='contained'
                  />
                </Typography>
                <Typography
                  gutterBottom
                  variant='h3'
                  component='div'
                  sx={{ textAlign: 'center' }}
                >
                  {currentUser.name}
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                >
                  {addToken
                    ? <Grid item sm={10}>
                      <TextField
                        label="Access Token"
                        variant="outlined"
                        size='small'
                        value={accessToken}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    : accessToken
                      ? <Grid item sm={12}>
                        <Typography sx={{ textAlign: 'center', color: 'gray' }}>
                          Access Token: {currentUser.accessToken}
                        </Typography>
                      </Grid>
                      : null
                  }
                  <Grid item sm={1}>
                    {addToken
                      ? <Tooltip title='Upload Token'>
                        <IconButton
                          color='info'
                          onClick={() => uploadAccessToken(accessToken)}>
                          <BackupTwoTone />
                        </IconButton>
                      </Tooltip>
                      : null
                    }
                  </Grid>
                  <Grid item sm={1}>
                    {addToken
                      ? <Tooltip title='Cancel'>
                        <IconButton
                          color='error'
                          onClick={() => ((setAddToken(false), setAccessToken('')))}>
                          <HighlightOffTwoTone />
                        </IconButton>
                      </Tooltip>
                      : null
                    }
                  </Grid>
                </Grid>
                <hr />
                {currentUser.accessToken
                  ? <Box>
                    <Typography
                      sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                      gutterBottom
                      component='div'
                    >
                      {currentUser.organization} <ApartmentTwoTone />
                    </Typography>
                    <Typography
                      sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                      gutterBottom
                      component='div'
                    >
                      Advisor: {currentUser.advisor}
                    </Typography>
                    <Typography
                      sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                      gutterBottom
                      component='div'
                    >
                      Cohort: {currentUser.cohort}
                    </Typography>

                  </Box>
                  : null
                }
                <Typography
                  sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                  gutterBottom
                  variant='h5'
                  component='div'
                >
                  {`Average Score: ${average > 0 ? average : 0}/100`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='contained'
                  color='error'
                  onClick={logout}
                >
                  Sign Out
                </Button>
                {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
                  ? <Button
                    fullWidth
                    color='info'
                    variant='contained'
                    onClick={() => setOpen(true)}>
                    Manage Users
                  </Button>
                  : null
                }
              </CardActions>
            </Card>
          </Grid>
          <Grid sx={{ mt: 4 }} sm={12} xl={8} item>
            <Analytics jobs={jobs} themeMode={themeMode} />
          </Grid>
          <Grid sm={12} xl={8} item>
            {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
              ? <Paper
                elevation={3}
                sx={{
                  transition: 'color .5s, background .5s',
                  height: 600,
                  width: '100%',
                  background: THEME[themeMode].card,
                  mb: 4
                }}>
                <Box
                  sx={{
                    p: 2
                  }}
                >
                  <FormControl
                    sx={{ width: '30%' }}
                    size='small'>
                    <InputLabel>Cohort To View</InputLabel>
                    <Select
                      value={currentCohort}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value='March 2022'>March 2022</MenuItem>
                      <MenuItem value='January 2022'>January 2022</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <DataGrid
                  sx={{
                    transition: 'color .5s, background .5s',
                    color: THEME[themeMode].textColor,
                    border: 'none'
                  }}
                  rows={cohortStudents}
                  columns={columnsTest}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                />
              </Paper>
              : null
            }
          </Grid>
          {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
            ? <Grid sm={6} xl={4} item>
              <Card
                elevation={3}
                sx={{
                  maxWidth: 500,
                  minHeight: 600,
                  p: 3,
                  mb: 10,
                  transition: 'color .5s, background .5s',
                  background: THEME[themeMode].card,
                  color: THEME[themeMode].textColor
                }}
                container
              >
                <CardContent>
                  TOTAL APPLICATIONS
                </CardContent>
                <CardActions>
                  HERE ARE SOME ACTIONS IF YOU WANT
                </CardActions>
              </Card>
            </Grid>
            : null}
        </Grid>
      </Grid>
    </>
  )
}

export default Profile;