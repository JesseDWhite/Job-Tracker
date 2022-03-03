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
  Select,
  Fab,
  Badge
} from '@mui/material';
import {
  BackupTwoTone,
  KeyTwoTone,
  HighlightOffTwoTone,
  ApartmentTwoTone,
  PersonAddAltTwoTone,
  VpnKeyTwoTone,
  LogoutTwoTone
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
import DoughnutChart from './Charts/DoughnutChart';
import UserUpload from './Forms/UserUpload';
import { eachMonthOfInterval, subYears, format } from 'date-fns'
import { styled } from '@mui/material/styles';

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
    getUserData,
    setFeedback,
    feedback,
    totalApplications
  } = props;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      border: `4px solid ${THEME[themeMode].card}`,
      borderRadius: '100%',
      width: 40,
      height: 40,
      transition: 'border .5s'
    },
    '& .MuiBadge-badge:hover': {
      background: 'rgb(214, 142, 34)',
      cursor: 'pointer',
      transition: 'background .5s'
    },
  }));

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
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

  const [cohortList, setCohortList] = useState([]);

  const [currentCohort, setCurrentCohort] = useState('');

  const [allStudents, setAllStudents] = useState([]);

  const [cohortStudents, setCohortStudents] = useState([]);

  const [accessToken, setAccessToken] = useState(currentUser?.accessToken);

  const [backupToken] = useState(currentUser?.accessToken);

  const subCollection = collection(organizationReference, `${organization.accessToken}/approvedUsers`);

  const handleChange = (e) => {
    const { value } = e.target;
    setAccessToken(value);
  }

  const handleSelectChange = (e) => {
    setCurrentCohort(e.target.value);
  }

  const getLastYear = () => {
    const today = new Date();
    const oneYear = subYears(today, 1);
    const lastYear = eachMonthOfInterval({
      start: oneYear,
      end: today
    });
    const convertedYears = lastYear.map(year => {
      return format(year, 'LLLL') + ' ' + format(year, 'y');
    });
    convertedYears.push('Advisor');
    setCohortList(convertedYears);
    setCurrentCohort(convertedYears[convertedYears.length - 2]);
  }

  const uploadAccessToken = async (token) => {
    const docToUpdate = doc(userReference, currentUser.id);
    await updateDoc(docToUpdate, { accessToken: token.trim() });
    setFeedback({
      ...feedback,
      open: true,
      type: 'success',
      title: 'Uploaded',
      message: `Access Token submitted. Make sure your account admin has added you to the network and restart your program.`
    });
    setAddToken(false);
    // getUserData();
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
        setCohortStudents(myStudents);
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

  useEffect(() => {
    getUserData();
    getLastYear();
  }, [])

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
              currentUser={currentUser}
              getStudents={getStudents}
              cohortList={cohortList}
              feedback={feedback}
              setFeedback={setFeedback}
              setOpen={setOpen}
              organization={organization}
              organizationReference={organizationReference}
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
                minHeight: '100%',
                p: 3,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor
              }}
              container
            >
              {/* <Tooltip title={addToken ? 'Cancel' : 'Add Token'} placement='right'>
                <Fab
                  sx={{
                    position: 'absolute',
                    top: 260,
                    left: 380,
                    transition: 'border .5s',
                    border: '4px solid',
                    borderColor: THEME[themeMode].card,
                    boxShadow: 'none'
                  }}
                  size='small'
                  color='warning'
                  onClick={() => addToken ? (setAddToken(false), setAccessToken(backupToken)) : setAddToken(true)}>
                  <KeyTwoTone />
                </Fab>
              </Tooltip> */}
              <Box sx={{ textAlign: 'center' }}>
                <StyledBadge
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  color='warning'
                  badgeContent={<KeyTwoTone />}
                  overlap='circular'
                  onClick={() => addToken ? (setAddToken(false), setAccessToken(backupToken)) : setAddToken(true)}>
                  <CardMedia
                    sx={{
                      borderRadius: '100%',
                      width: 200,
                      objectFit: 'contain',
                    }}
                    component='img'
                    alt='user profile photo'
                    image={user?.photoURL.replace('s96-c', 's400-c')}
                  />
                </StyledBadge>
              </Box>
              <CardContent sx={{ cursor: 'default' }}>
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
                          Access Token: {accessToken}
                        </Typography>
                      </Grid>
                      : null
                  }
                  <Grid item sm={1}>
                    {addToken
                      ? <Tooltip title='Upload Token'>
                        <IconButton
                          color='info'
                          disabled={accessToken ? false : true}
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
                          onClick={() => ((setAddToken(false), setAccessToken(backupToken)))}>
                          <HighlightOffTwoTone />
                        </IconButton>
                      </Tooltip>
                      : null
                    }
                  </Grid>
                </Grid>
                <hr />
                {currentUser.accessToken && currentUser.organization
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
                  startIcon={<LogoutTwoTone />}
                  variant='contained'
                  color='error'
                  onClick={logout}
                >
                  Sign Out
                </Button>
                {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
                  ? <Button
                    fullWidth
                    startIcon={<PersonAddAltTwoTone />}
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
              ?
              <Paper
                elevation={3}
                sx={{
                  background: THEME[themeMode].card,
                }}
              >
                <Box
                  sx={{
                    pt: 2,
                    pl: 2
                  }}
                >
                  <FormControl
                    sx={{ width: '30%' }}
                    size='small'
                  >
                    <InputLabel>Cohort To View</InputLabel>
                    <Select
                      value={currentCohort}
                      onChange={handleSelectChange}
                    >
                      {cohortList.map(cohort => {
                        return (
                          <MenuItem value={cohort}>{cohort}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    transition: 'color .5s, background .5s',
                    height: 600,
                    width: '100%',
                    background: THEME[themeMode].card,
                    mb: 4
                  }}>
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
              </Paper>
              : null
            }
          </Grid>
          {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
            ? <Grid sm={6} xl={4} item>
              <Card
                elevation={3}
                sx={{
                  minWidth: 500,
                  minHeight: '100%',
                  p: 3,
                  mb: 10,
                  transition: 'color .5s, background .5s',
                  background: THEME[themeMode].card,
                  color: THEME[themeMode].textColor
                }}
                container
              >
                <CardContent sx={{ height: 550 }}>
                  <DoughnutChart jobs={jobs} themeMode={themeMode} />
                </CardContent>
              </Card>
            </Grid>
            : null}
        </Grid>
      </Grid>
    </>
  )
}

export default Profile;