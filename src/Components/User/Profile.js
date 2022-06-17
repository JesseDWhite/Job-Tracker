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
  Badge,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  BackupTwoTone,
  KeyTwoTone,
  HighlightOffTwoTone,
  ApartmentTwoTone,
  PersonAddAltTwoTone,
  CancelTwoTone,
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
import { THEME } from '../../Layout/Theme';
import { DataGrid } from '@mui/x-data-grid';
import Analytics from '../Charts/Analytics';
import DoughnutChart from '../Charts/DoughnutChart';
import UserUpload from '../Forms/UserUpload';
import { eachMonthOfInterval, format, subMonths } from 'date-fns'
import { styled } from '@mui/material/styles';
import MasterList from '../MasterList';

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
    handleViewComments,
  } = props;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      border: `4px solid ${THEME[themeMode].card}`,
      borderRadius: '100%',
      width: 40,
      height: 40,
      transition: 'border .5s',
      zIndex: 0
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

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        return <Avatar src={params.value} />
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
    {
      field:
        'cohort',
      headerName:
        'Cohort',
      width: 200,
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 400,
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} variant='filled' />
      }
    },
    {
      field: 'totalApplications',
      headerName: 'Total Apps',
      width: 100,
      align: 'center',
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
  ];

  const [average, setAverage] = useState(0);

  const [open, setOpen] = useState(false);

  const [addToken, setAddToken] = useState(false);

  const [cohortList, setCohortList] = useState([]);

  const [currentCohort, setCurrentCohort] = useState('');

  const [cohortStudents, setCohortStudents] = useState([]);

  const [viewType, setViewType] = useState('My Students');

  const [viewStudent, setViewStudent] = useState([]);

  const [student, setStudent] = useState({});

  const [studentApplications, setStudentApplications] = useState([]);

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

  const handleToggleChange = (e, newViewType) => {
    setViewType(newViewType);
  };

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
    setCohortList(sortedList);
    setCurrentCohort(sortedList[1]);
  }

  const uploadAccessToken = async (token) => {
    const docToUpdate = doc(userReference, currentUser.id);
    await updateDoc(docToUpdate, { accessToken: token.trim() });
    setFeedback({
      ...feedback,
      open: true,
      type: 'success',
      title: 'Uploaded',
      message: `Access Token submitted. Make sure your account admin has added you to the network and refresh your page.`
    });
    setAddToken(false);
  }

  const getStudents = async (userData) => {
    if (userData?.role === 'Admin' || userData?.role === 'Advisor') {
      try {
        const q = query(subCollection, where('cohort', '==', currentCohort));
        const qSnapShot = await getDocs(q);
        const qResults = qSnapShot.docs.map((student) => ({
          ...student.data(), id: student.id
        }));
        const myStudents = qResults.filter(student => student.advisor === userData?.name);
        if (viewType === 'My Students') {
          setCohortStudents(myStudents);
        } else {
          setCohortStudents(qResults);
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

  const getStudentsApplications = async () => {
    if (viewStudent.length > 0) {
      try {
        const studentQuery = query(userReference, where('internalId', '==', viewStudent[0]));
        const studentSnapshot = await getDocs(studentQuery);
        const studentResult = studentSnapshot.docs[0]?.data();
        if (!studentResult) {
          setFeedback({
            ...feedback,
            open: true,
            type: 'error',
            title: 'Error',
            message: 'This student has not added their access key to their account yet'
          });
        } else {
          const applications = await getDocs(collection(userReference, `${studentResult.id}/jobs`));
          const applicationResults = applications.docs.map((app) => ({
            ...app.data(),
            id: app.id,
          }));
          applicationResults.sort((a, b) => {
            const newA = a.dateApplied;
            const newB = b.dateApplied;
            if (newA < newB) return 1;
            if (newA > newB) return -1;
            return 0;
          });
          setStudentApplications(applicationResults);
          setStudent(studentResult);
        }
      } catch (error) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: 'There was an issue connecting to the network. Please try again.'
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

  const getScoreColor = (score) => {
    if (score < 20) {
      return '#FF3D00'
    } else if (score >= 20 && score < 40) {
      return '#FF9100'
    } else if (score >= 40 && score < 60) {
      return '#FFC400'
    } else if (score >= 60 && score < 80) {
      return '#CDDC39'
    } else if (score >= 80 && score < 90) {
      return '#64DD17'
    } else return '#00C853'
  }

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setViewStudent([]);
    }, 500);
  }

  const handleViewStudentClose = () => {
    setTimeout(() => {
      setStudent({});
      setStudentApplications([]);
    }, 500);
    document.getElementById('dataGrid').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  useEffect(() => {
    getStudents(currentUser);
  }, [currentCohort, viewType]);

  useEffect(() => {
    getUserData(jobs); //This might not need to be called here. Already being called within getJobs.
    getLastYear();
    getTotalApplicationAverage();
  }, []);

  useEffect(() => {
    getStudentsApplications();
  }, [viewStudent]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => handleClose()}
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
      <Grid display='flex' sx={{ ml: 3, mr: 3, pt: 12 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="start"
          spacing={4}
        >
          <Grid sm={6} xl={4} item>
            <Card
              elevation={3}
              sx={{
                borderRadius: 5,
                minHeight: '100%',
                p: 3,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor
              }}
              container
            >
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
                    : accessToken &&
                    <Grid item sm={12}>
                      <Typography sx={{ textAlign: 'center', color: 'gray' }}>
                        Access Token: {accessToken}
                      </Typography>
                    </Grid>
                  }
                  <Grid item sm={1}>
                    {addToken &&
                      <Tooltip title='Upload Token'>
                        <IconButton
                          color='info'
                          disabled={accessToken ? false : true}
                          onClick={() => uploadAccessToken(accessToken)}>
                          <BackupTwoTone />
                        </IconButton>
                      </Tooltip>
                    }
                  </Grid>
                  <Grid item sm={1}>
                    {addToken &&
                      <Tooltip title='Cancel'>
                        <IconButton
                          color='error'
                          onClick={() => ((setAddToken(false), setAccessToken(backupToken)))}>
                          <HighlightOffTwoTone />
                        </IconButton>
                      </Tooltip>
                    }
                  </Grid>
                </Grid>
                <hr />
                {/* <Box sx={{
                  mb: 1
                }}
                >
                  <LinearProgress variant="determinate" value={average} />
                </Box> */}
                {/* <Grid
                  container
                  justifyContent='space-around'
                  direction='row'
                >
                  <Card
                    item
                    xs={6}
                    sx={{
                      p: 1,
                      width: '40%',
                      height: 75,
                      borderRadius: 3,
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                      }}
                    >
                      <ApartmentTwoTone sx={{ fontSize: 50 }} />
                    </Box>
                    <Box

                    >
                      <Typography>
                        {currentUser.organization}
                      </Typography>
                    </Box>
                  </Card>
                  <Card
                    item
                    xs={6}
                    sx={{
                      p: 1,
                      width: '40%',
                      height: 75,
                      borderRadius: 3
                    }}
                  >
                    Content
                  </Card>
                  <Card
                    item
                    xs={6}
                    sx={{
                      mt: 1,
                      p: 1,
                      width: '40%',
                      height: 75,
                      borderRadius: 3
                    }}
                  >
                    Content
                  </Card>
                  <Card
                    item
                    xs={6}
                    sx={{
                      mt: 1,
                      p: 1,
                      width: '40%',
                      height: 75,
                      borderRadius: 3
                    }}
                  >
                    Content
                  </Card>
                </Grid> */}
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
          <Grid sm={12} xl={8} item>
            <Analytics jobs={jobs} themeMode={themeMode} />
          </Grid>
          <Grid sm={12} xl={8} item>
            {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
              ?
              <Paper
                id='dataGrid'
                elevation={3}
                sx={{
                  borderRadius: 5,
                  background: THEME[themeMode].card,
                  transition: 'color .5s, background .5s'
                }}
              >
                <Box
                  sx={{
                    pt: 2,
                    pl: 2,
                    position: 'relative'
                  }}
                >
                  <FormControl
                    sx={{ width: '30%' }}
                    size='small'
                  >
                    <InputLabel>Cohort To View</InputLabel>
                    <Select
                      label='Cohort To View'
                      value={currentCohort}
                      onChange={handleSelectChange}
                    >
                      {cohortList.map(cohort => { return (<MenuItem value={cohort}>{cohort}</MenuItem>) })}
                    </Select>
                  </FormControl>
                  <ToggleButtonGroup
                    color='info'
                    sx={{ position: 'absolute', top: 14, right: 16 }}
                    value={viewType}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="List of students"
                    size='small'
                  >
                    <ToggleButton value="My Students" aria-label="My Students">My Students</ToggleButton>
                    <ToggleButton value="All Students" aria-label="All Students">All Students</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 5,
                    transition: 'color .5s, background .5s',
                    height: 586,
                    width: '100%',
                    background: THEME[themeMode].card,
                  }}>
                  <DataGrid
                    sx={{
                      transition: 'color .5s, background .5s',
                      color: THEME[themeMode].textColor,
                      border: 'none',
                      "& ::-webkit-scrollbar": {
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        width: '0.5em'
                      },
                      "& ::-webkit-scrollbar-thumb": {
                        backgroundColor: 'rgb(169, 169, 169)',
                        borderRadius: '1em'
                      }
                    }}
                    rows={cohortStudents}
                    columns={columns}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    onSelectionModelChange={(newStudent) => (setViewStudent(newStudent))}
                    selectedModel={viewStudent}
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
                  borderRadius: 5,
                  height: '100%',
                  p: 3,
                  transition: 'color .5s, background .5s',
                  background: THEME[themeMode].card,
                  color: THEME[themeMode].textColor,
                  position: 'relative'
                }}
                container
              >
                <Typography variant='h5' textAlign='center'>Application Breakdown</Typography>
                <CardContent sx={{ height: '100%' }}>
                  <DoughnutChart jobs={Object.keys(student).length !== 0 ? studentApplications : jobs} themeMode={themeMode} />
                </CardContent>
              </Card>
            </Grid>
            : null}
          <Grid item sx={{ width: '100%' }}>
            <div id='studentApplications' />
            {Object.keys(student).length !== 0 &&
              <Box
                sx={{
                  transition: 'color .5s',
                  color: THEME[themeMode].textColor,
                }}>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  direction="row"
                >
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 5,
                      p: 3,
                      mb: 3,
                      width: 500,
                      transition: 'color .5s, background .5s',
                      background: THEME[themeMode].card,
                      color: THEME[themeMode].textColor,
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <Tooltip title='Close' placement='left'>
                      <IconButton
                        size='large'
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          mr: 1.5,
                          mt: 1.5
                        }}
                        onClick={() => handleViewStudentClose()}
                      >
                        <CancelTwoTone fontSize='inherit' />
                      </IconButton>
                    </Tooltip>
                    <Chip
                      avatar={<Avatar>{student.totalApplications}</Avatar>}
                      label='Total Applications'
                      variant={themeMode === 'darkMode' ? 'outlined' : 'contained'}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        ml: 3,
                        mt: 3,
                        cursor: 'default'
                      }}
                    />
                    <Box>
                      <img src={student.profilePhoto} alt={student.name} style={{ borderRadius: '100%', width: 100 }} />
                    </Box>
                    <Typography variant='p' textAlign='center'>Currently Viewing</Typography>
                    <Typography variant='h5' textAlign='center'>{student.name}</Typography>
                  </Paper>
                </Grid>
                <MasterList
                  themeMode={themeMode}
                  searchJobs={studentApplications}
                  jobs={studentApplications}
                  student={student}
                  handleViewComments={handleViewComments}
                  user={user}
                />
              </Box>}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile;