/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
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
  MenuList,
  Menu,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  BackupTwoTone,
  KeyTwoTone,
  HighlightOffTwoTone,
  PersonAddAltTwoTone,
  CancelRounded,
  LogoutTwoTone,
  MoreVert,
  UploadFileTwoTone,
  ForumTwoTone,
  EditTwoTone,
  DeleteTwoTone
} from '@mui/icons-material';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getCountFromServer
} from 'firebase/firestore';
import { THEME } from '../../Layout/Theme';
import { DataGrid } from '@mui/x-data-grid';
import Analytics from '../Charts/Analytics';
import DoughnutChart from '../Charts/DoughnutChart';
import UserUpload from '../Forms/UserUpload';
import ResumeUpload from '../Forms/ResumeUpload';
import UpdateProfile from '../Forms/UpdateProfile';
import { eachMonthOfInterval, format, subMonths } from 'date-fns'
import { styled } from '@mui/material/styles';
import MasterList from '../MasterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

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
    getJobs,
    setSearchJobs,
    width
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
    width: width <= 600 ? '95%' : 750,
    maxHeight: '85%',
    minHeight: '10%',
    bgcolor: THEME[themeMode].card,
    color: THEME[themeMode].textColor,
    borderRadius: 5,
    boxShadow: 24,
    pt: width <= 600 ? 0 : 4,
    px: width <= 600 ? 0 : 4,
    pb: width <= 600 ? 0 : 4,
    overflowY: 'auto',
    border: THEME[themeMode].border
  };

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      headerAlign: 'center',
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
      width: 350,
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
    {
      field: 'advisor',
      headerName: 'Advisor',
      headerAlign: 'center',
      width: 200,
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} variant='filled' />
      }
    },
    {
      field: 'totalApplications',
      headerName: 'Total Apps',
      headerAlign: 'center',
      width: 100,
      align: 'center',
      renderCell: (params) => {
        return <span style={{ cursor: 'default' }}>{params.value}</span>
      }
    },
  ];

  const [average, setAverage] = useState(0);

  const [open, setOpen] = useState(false);

  const [resumeUpload, setResumeUpload] = useState(false);

  const [updateProfile, setUpdateProfile] = useState(false);

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

  const [resume, setResume] = useState(currentUser?.storedResume);

  const [username, setUsername] = useState(currentUser.name);

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

  const getLastYear = async () => {
    let cohorts = [];
    const today = new Date();
    const yearAndAHalf = subMonths(today, 18);
    const lastYear = eachMonthOfInterval({
      start: yearAndAHalf,
      end: today
    });
    let convertedYears = lastYear.map(year => {
      return format(year, 'LLLL') + ' ' + format(year, 'y');
    });
    convertedYears.push('Advisors')
    for (let i = 0; i < convertedYears.length; i++) {
      const q = query(subCollection, where('cohort', '==', convertedYears[i]));
      const snapshot = await getCountFromServer(q);
      if (snapshot.data().count > 0) {
        cohorts.push({ 'cohort': convertedYears[i], 'count': snapshot.data().count });
      }
    }
    cohorts.sort((a, b) => {
      const newA = new Date(a.cohort);
      const newB = new Date(b.cohort);
      if (newA < newB) return 1;
      if (newA > newB) return -1;
      return 0;
    });
    setCohortList(cohorts);
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

  const deleteAccessToken = async () => {
    const docToUpdate = doc(userReference, currentUser.id);
    await updateDoc(docToUpdate, { accessToken: '' });
    setFeedback({
      ...feedback,
      open: true,
      type: 'error',
      title: 'Removed',
      message: `Your access token has successfully been removed and you no longer have access to ${currentUser.organization}.`
    });
    setAccessToken('');
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
    });
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
      setResumeUpload(false);
      setUpdateProfile(false);
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
    if (viewStudent.length) {
      setTimeout(() => {
        document.getElementById('studentApplications').scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 700);
    }
  }, [viewStudent]);

  const determineModelContents = () => {
    if (resumeUpload) {
      return <ResumeUpload
        resume={resume}
        setResume={setResume}
        userReference={userReference}
        currentUser={currentUser}
        feedback={feedback}
        setFeedback={setFeedback}
        handleClose={handleClose}
        getJobs={getJobs}
        jobs={jobs}
        themeMode={themeMode}
      />
    } else if (updateProfile) {
      return <UpdateProfile
        username={username}
        setUsername={setUsername}
        userReference={userReference}
        currentUser={currentUser}
        feedback={feedback}
        setFeedback={setFeedback}
        handleClose={handleClose}
        getJobs={getJobs}
        jobs={jobs}
        subCollection={subCollection}
        themeMode={themeMode}
      />
    } else {
      return <UserUpload
        currentUser={currentUser}
        getStudents={getStudents}
        cohortList={cohortList}
        feedback={feedback}
        setFeedback={setFeedback}
        setOpen={setOpen}
        organization={organization}
        organizationReference={organizationReference}
        setOrganization={setOrganization}
        themeMode={themeMode}
      />
    }
  }

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
            {width <= 600 &&
              <IconButton
                component='span'
                onClick={() => handleClose()}
                sx={{
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  display: 'inline-block',
                  zIndex: 10
                }}
              >
                <CancelRounded />
              </IconButton>
            }
            {determineModelContents()}
          </Box>
        </Fade>
      </Modal>
      <Grid display='flex' sx={{ ml: width <= 600 ? 1 : 3, mr: width <= 600 ? 1 : 3, pt: 12 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="start"
          spacing={4}
        >
          <Grid xs={12} sm={6} xl={4} item>
            <Card
              elevation={3}
              sx={{
                borderRadius: 5,
                minHeight: '100%',
                pt: 3,
                pl: width <= 600 ? 1 : 3,
                pr: width <= 600 ? 1 : 3,
                pb: 1,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor,
                position: 'relative',
                border: THEME[themeMode].border
              }}
              container
            >
              <PopupState variant="popover">
                {(popupState) => (
                  <Box>
                    <IconButton
                      id='options-button'
                      aria-label='options'
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: 10
                      }}
                      {...bindTrigger(popupState)}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id='options-menu'
                      anchorEl='options-button'
                      MenuListProps={{
                        'aria-labelledby': 'options-button'
                      }}
                      {...bindMenu(popupState)}
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 500 }}
                      onClose={() => ((popupState.close(), setResumeUpload(false), setUpdateProfile(false)))}
                    >
                      <MenuList>
                        <MenuItem
                          onClick={() => ((setResumeUpload(true), setOpen(true), popupState.close()
                          ))}
                        >
                          <ListItemIcon>
                            <UploadFileTwoTone />
                            <ListItemText
                              sx={{
                                pl: 2,
                              }}
                            >
                              Upload Resume
                            </ListItemText>
                          </ListItemIcon>
                        </MenuItem>
                        {currentUser.role === 'Admin' || currentUser.role === 'Advisor' ?
                          <MenuItem
                            onClick={() => ((setResumeUpload(false), setOpen(true), popupState.close()
                            ))}
                          >
                            <ListItemIcon>
                              <PersonAddAltTwoTone />
                              <ListItemText
                                sx={{
                                  pl: 2,
                                }}
                              >
                                Manage Users
                              </ListItemText>
                            </ListItemIcon>
                          </MenuItem>
                          : null}
                        <MenuItem
                          onClick={() => ((setUpdateProfile(true), setOpen(true), popupState.close()
                          ))}>
                          <ListItemIcon>
                            <EditTwoTone />
                            <ListItemText
                              sx={{
                                pl: 2
                              }}
                            >
                              Edit Profile
                            </ListItemText>
                          </ListItemIcon>
                        </MenuItem>
                        <MenuItem
                          component='a'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://forms.gle/cy3TvnmfxrgkZY8K6'
                        >
                          <ListItemIcon>
                            <ForumTwoTone />
                            <ListItemText
                              sx={{
                                pl: 2
                              }}
                            >
                              Feedback
                            </ListItemText>
                          </ListItemIcon>
                        </MenuItem>
                        <MenuItem
                          onClick={logout}>
                          <ListItemIcon>
                            <LogoutTwoTone />
                            <ListItemText
                              sx={{
                                pl: 2
                              }}
                            >
                              Sign Out
                            </ListItemText>
                          </ListItemIcon>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                )}
              </PopupState>
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
                  alignItems='center'
                  spacing={2}
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  {addToken
                    ? <Grid item xs={12} sm={9}>
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
                    <Grid item xs={12}>
                      <Typography sx={{ textAlign: 'center', color: 'gray' }}>
                        Access Token: {accessToken}
                      </Typography>
                    </Grid>
                  }
                  <Grid item xs={4} sm={1}>
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
                  <Grid item xs={4} sm={1}>
                    {addToken &&
                      <Tooltip title='Delete Token'>
                        <IconButton
                          color='error'
                          disabled={accessToken ? false : true}
                          onClick={() => deleteAccessToken()}>
                          <DeleteTwoTone />
                        </IconButton>
                      </Tooltip>
                    }
                  </Grid>
                  <Grid item xs={4} sm={1}>
                    {addToken &&
                      <Tooltip title='Cancel'>
                        <IconButton
                          onClick={() => ((setAddToken(false), setAccessToken(backupToken)))}>
                          <HighlightOffTwoTone />
                        </IconButton>
                      </Tooltip>
                    }
                  </Grid>
                </Grid>
                {currentUser.accessToken && currentUser.organization
                  ?
                  <Box>
                    <hr />
                    <Grid
                      container
                      justifyContent='space-around'
                      direction='row'
                      sx={{
                        mt: 3
                      }}
                    >
                      <Card
                        item
                        xs={6}
                        sx={{
                          p: 1,
                          width: '40%',
                          height: 75,
                          borderRadius: 3,
                          position: 'relative',
                          transition: 'color .5s, background .5s',
                          background: THEME[themeMode].subCard,
                          color: THEME[themeMode].textColor,
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            textAlign: 'center',
                            fontSize: '15px'
                          }}
                        >
                          Organization
                        </Typography>
                        <hr />
                        <Typography
                          sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: '18px'
                          }}
                        >
                          {currentUser.organization}
                        </Typography>
                      </Card>
                      <Card
                        item
                        xs={6}
                        sx={{
                          p: 1,
                          width: '40%',
                          height: 75,
                          borderRadius: 3,
                          position: 'relative',
                          transition: 'color .5s, background .5s',
                          background: THEME[themeMode].subCard,
                          color: THEME[themeMode].textColor,
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            textAlign: 'center',
                            fontSize: '15px'
                          }}
                        >
                          Advisor
                        </Typography>
                        <hr />
                        <Typography
                          sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: '18px'
                          }}
                        >
                          {currentUser.advisor}
                        </Typography>
                      </Card>
                      <Card
                        item
                        xs={6}
                        sx={{
                          mt: 1,
                          p: 1,
                          width: '40%',
                          height: 75,
                          borderRadius: 3,
                          position: 'relative',
                          transition: 'color .5s, background .5s',
                          background: THEME[themeMode].subCard,
                          color: THEME[themeMode].textColor,
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            textAlign: 'center',
                            fontSize: '15px'
                          }}
                        >
                          Cohort
                        </Typography>
                        <hr />
                        <Typography
                          sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: '18px'
                          }}
                        >
                          {currentUser.cohort}
                        </Typography>
                      </Card>
                      <Card
                        item
                        xs={6}
                        sx={{
                          mt: 1,
                          p: 1,
                          width: '40%',
                          height: 75,
                          borderRadius: 3,
                          position: 'relative',
                          transition: 'color .5s, background .5s',
                          background: THEME[themeMode].subCard,
                          color: THEME[themeMode].textColor,
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            textAlign: 'center',
                            fontSize: '15px'
                          }}
                        >
                          Average Score
                        </Typography>
                        <hr />
                        <Typography
                          sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: '18px'
                          }}
                        >
                          {average > 0 ? average : 0}
                        </Typography>
                      </Card>
                    </Grid>
                  </Box>
                  : null}
              </CardContent>
            </Card>
          </Grid>
          {(currentUser.role === 'Admin' || currentUser.role === 'Advisor') && width <= 1536
            ? <Grid xs={12} sm={6} xl={4} item>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 5,
                  height: '100%',
                  p: 3,
                  transition: 'color .5s, background .5s',
                  background: THEME[themeMode].card,
                  color: THEME[themeMode].textColor,
                  position: 'relative',
                  border: THEME[themeMode].border
                }}
                container
              >
                <Typography variant='h5' textAlign='center'>Application Breakdown</Typography>
                <hr />
                <CardContent sx={{ height: '100%' }}>
                  <DoughnutChart jobs={Object.keys(student).length !== 0 ? studentApplications : jobs} themeMode={themeMode} />
                </CardContent>
              </Card>
            </Grid>
            : null}
          <Grid xs={12} xl={8} item>
            <Analytics jobs={jobs} themeMode={themeMode} width={width} />
          </Grid>
          <Grid xs={12} xl={8} item>
            {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
              ?
              <Paper
                id='dataGrid'
                elevation={3}
                sx={{
                  borderRadius: 5,
                  background: THEME[themeMode].card,
                  transition: 'color .5s, background .5s',
                  border: THEME[themeMode].border
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
                    <InputLabel>{width <= 600 ? 'Cohort' : 'Cohort To View'}</InputLabel>
                    <Select
                      label={width <= 600 ? 'Cohort' : 'Cohort To View'}
                      value={currentCohort.cohort}
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
                  <ToggleButtonGroup
                    color='info'
                    sx={{ position: 'absolute', top: 16, right: 16 }}
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
                        width: '0.5em',
                        height: '0.5em'
                      },
                      "& ::-webkit-scrollbar-thumb": {
                        backgroundColor: 'rgb(169, 169, 169)',
                        borderRadius: '1em',
                      },
                      "& ::-webkit-scrollbar-corner": {
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                      }
                    }}
                    rows={cohortStudents}
                    columns={columns}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    onSelectionModelChange={(newStudent) => setViewStudent(newStudent)}
                    selectedModel={viewStudent}
                  />
                </Paper>
              </Paper>
              : null
            }
          </Grid>
          {(currentUser.role === 'Admin' || currentUser.role === 'Advisor') && width > 1536
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
                  position: 'relative',
                  border: THEME[themeMode].border
                }}
                container
              >
                <Typography variant='h5' textAlign='center'>Application Breakdown</Typography>
                <hr />
                <CardContent sx={{ height: '100%' }}>
                  <DoughnutChart jobs={Object.keys(student).length !== 0 ? studentApplications : jobs} themeMode={themeMode} />
                </CardContent>
              </Card>
            </Grid>
            : null}
          <Grid item xs={12}>
            {Object.keys(student).length !== 0 &&
              <Box
                sx={{
                  transition: 'color .5s',
                  color: THEME[themeMode].textColor,
                }}>
                <Box
                  sx={{
                    pb: 3,
                    position: 'relative'
                  }}
                >
                  <MasterList
                    themeMode={themeMode}
                    searchJobs={studentApplications}
                    jobs={studentApplications}
                    student={student}
                    handleViewComments={handleViewComments}
                    user={user}
                    setSearchJobs={setSearchJobs}
                    currentUser={currentUser}
                    handleViewStudentClose={handleViewStudentClose}
                  />
                </Box>
              </Box>}
            <div id='studentApplications' />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile;