import React, { useState, useEffect } from 'react';
import {
  Chip,
  Paper,
  Box,
  MenuList,
  MenuItem,
  IconButton,
  Menu,
  Fade,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Grid
} from '@mui/material';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';
import { DataGrid } from '@mui/x-data-grid';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {
  WorkTwoTone,
  DescriptionTwoTone,
  DeleteTwoTone,
  CreateTwoTone,
  CheckCircleTwoTone,
  DoNotDisturbOnTwoTone,
  HelpTwoTone,
  AutoAwesomeTwoTone,
  CloseRounded,
  VisibilityTwoTone,
  ForumTwoTone,
  MenuRounded,
  AccessTimeTwoTone,
} from '@mui/icons-material';
import format from 'date-fns/format';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import Details from './Details';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

const MasterList = (props) => {

  const {
    searchJobs,
    jobs,
    updateJobApplication,
    deleteJob,
    updateJobStatus,
    themeMode,
    student,
    handleViewComments,
    user,
    currentUser,
    setOpen,
    loading,
    setLoading,
    setSearchJobs,
    applicationCount,
    subCollection,
    feedback,
    setFeedback,
    setJobs,
    updateInterviewDate,
    handleViewStudentClose
  } = props;

  const [viewInterviewPrep, setViewInterviewPrep] = useState(false);

  const [viewDetails, setViewDetails] = useState(false);

  const [jobToView, setJobToView] = useState({});

  const [dailyFilter, setDailyFilter] = useState(false);

  const downloadFile = (doc) => {
    const file = getDownloadURL(ref(storage, doc));
    return file;
  }

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
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

  const { height, width } = useWindowDimensions();

  const getStatus = (status) => {
    if (status === 'Active') {
      return 'success';
    } else if (status === 'Interview') {
      return 'secondary';
    } else if (status === 'Closed') {
      return 'error';
    } else if (status === 'Other') {
      return 'warning';
    }
  };

  const handleViewInterviewPrep = (jobId) => {
    setViewInterviewPrep(true);
    const jobToView = searchJobs.filter(job => job.id.includes(jobId));
    setJobToView(jobToView[0]);
  }

  const handleViewDetails = (jobId) => {
    setViewDetails(true);
    const jobToView = searchJobs.filter(job => job.id.includes(jobId));
    setJobToView(jobToView[0]);
  }

  const handleEditJob = (jobId) => {
    const jobToEdit = searchJobs.filter(job => job.id.includes(jobId));
    updateJobApplication(jobToEdit[0])
  }

  const handleClose = () => {
    setViewInterviewPrep(false);
    setViewDetails(false);
    setJobToView({});
  }

  //Only show job apps that have been added today.
  useEffect(() => {
    const newJobs = [...jobs];
    if (dailyFilter) {
      const todaysDate = format(new Date(), 'yyyy-MM-dd');
      const todaysJobs = newJobs.filter(job => job.dateApplied === todaysDate);
      setSearchJobs(todaysJobs);
    } else {
      setSearchJobs(newJobs);
    }
  }, [dailyFilter]);

  const renderActions = (job) => {
    return (
      <PopupState variant="popover">
        {(popupState) => (
          <Box>
            <IconButton
              id='options-button'
              aria-label='options'
              {...bindTrigger(popupState)}
            >
              {'Personal' !== currentUser.organization
                && job.lastResponseFrom
                && job.lastResponseFrom !== user.uid
                && job.unreadMessages > 0
                ? <Badge color='error' variant='dot'>
                  <MenuRounded />
                </Badge>
                : <MenuRounded />
              }
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
              onClose={() => popupState.close()}
            >
              <MenuList>
                <MenuItem
                  onClick={() => handleViewDetails(job.id)}
                >
                  <ListItemIcon>
                    <VisibilityTwoTone />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      View Details
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                {'Personal' !== currentUser.organization &&
                  <MenuItem
                    onClick={() => handleViewInterviewPrep(job.id)}
                  >
                    <ListItemIcon>
                      <AutoAwesomeTwoTone />
                      <ListItemText
                        sx={{
                          pl: 2,
                        }}
                      >
                        Interview Prep
                      </ListItemText>
                    </ListItemIcon>
                  </MenuItem>
                }
                {'Personal' !== currentUser.organization
                  ? job.lastResponseFrom
                    && job.lastResponseFrom !== user.uid
                    && job.unreadMessages > 0 ?
                    <MenuItem
                      onClick={() => !student || Object.values(student).length === 0
                        ? handleViewComments(user.uid, job)
                        : handleViewComments(student.id, job)
                      }>
                      <ListItemIcon>
                        <Badge color='error' variant='dot'>
                          <ForumTwoTone />
                        </Badge>
                        <ListItemText
                          sx={{
                            pl: 2,
                          }}
                        >
                          Comments
                        </ListItemText>
                      </ListItemIcon>
                    </MenuItem>
                    : <MenuItem
                      onClick={() => !student || Object.values(student).length === 0
                        ? handleViewComments(user.uid, job)
                        : handleViewComments(student.id, job)
                      }>
                      <ListItemIcon>
                        <ForumTwoTone />
                        <ListItemText
                          sx={{
                            pl: 2,
                          }}
                        >
                          Comments
                        </ListItemText>
                      </ListItemIcon>
                    </MenuItem>
                  : null
                }
                <MenuItem
                  onClick={() => handleEditJob(job.id)}
                  disabled={student ? true : false}
                >
                  <ListItemIcon>
                    <CreateTwoTone />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Edit
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem
                  onClick={() => deleteJob(job.id, job.company)}
                  disabled={student ? true : false}
                >
                  <ListItemIcon>
                    <DeleteTwoTone />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Delete
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )
        }
      </PopupState>
    )
  };

  const getStatusIcon = (status) => {
    let icon = <CheckCircleTwoTone color='success' />;
    if (status === 'Closed') icon = <DoNotDisturbOnTwoTone color='error' />;
    if (status === 'Other') icon = <HelpTwoTone color='warning' />;
    if (status === 'Interview') icon = <AccessTimeTwoTone color='secondary' />;
    return icon;
  }

  const renderStatus = (job) => {
    return (
      <PopupState variant="popover">
        {(popupState) => (
          <Box>
            <Chip
              id='status-button'
              aria-label='options'
              {...bindTrigger(popupState)}
              label={job.status}
              variant={THEME[themeMode].buttonStyle}
              color={getStatus(job.status)}
              {...bindTrigger(popupState)}
              icon={getStatusIcon(job.status)}
            />
            <Menu
              id='status-menu'
              anchorEl='options-button'
              MenuListProps={{
                'aria-labelledby': 'status-button'
              }}
              {...bindMenu(popupState)}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 500 }}
              onClose={() => popupState.close()}
            >
              <MenuList>
                <MenuItem
                  onClick={() => ((updateJobStatus(job.id, 'Active'), popupState.close()))}
                >
                  <ListItemIcon>
                    <CheckCircleTwoTone color='success' />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Active
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem
                  onClick={() => ((updateJobStatus(job.id, 'Interview'), popupState.close()))}
                >
                  <ListItemIcon>
                    <AccessTimeTwoTone color='secondary' />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Interview
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem
                  onClick={() => ((updateJobStatus(job.id, 'Other'), popupState.close()))}

                >
                  <ListItemIcon>
                    <HelpTwoTone color='warning' />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Other
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem
                  onClick={() => ((updateJobStatus(job.id, 'Closed'), popupState.close()))}
                >
                  <ListItemIcon>
                    <DoNotDisturbOnTwoTone color='error' />
                    <ListItemText
                      sx={{
                        pl: 2,
                      }}
                    >
                      Closed
                    </ListItemText>
                  </ListItemIcon>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </PopupState>
    )
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      width: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return renderActions(params.row)
      }
    },
    {
      field: 'company',
      headerName: 'Company',
      headerAlign: 'left',
      width: 300,
      align: 'left',
      filterable: false,
      sortable: true,
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      headerAlign: 'left',
      width: 300,
    },
    {
      field:
        'status',
      headerName:
        'Status',
      headerAlign: 'center',
      align: 'center',
      width: 115,
      renderCell: (params) => {
        return !student ? renderStatus(params.row) : <Chip
          label={params.row.status}
          variant={THEME[themeMode].buttonStyle}
          color={getStatus(params.row.status)}
          icon={getStatusIcon(params.row.status)}
        />
      }
    },
    {
      field: 'dateApplied',
      headerName: 'Date Applied',
      headerAlign: 'center',
      width: 150,
      align: 'center',
      filterable: true,
      sortable: true,
      renderCell: (params) => {
        return format(new Date(params.value.replace(/-/g, '/')), 'PP')
      }
    },
    {
      field: 'score',
      headerName: 'Score',
      headerAlign: 'center',
      width: 115,
      align: 'center',
      filterable: true,
      sortable: true,
    },
    {
      field: 'jobPosting',
      headerName: 'Job Posting',
      headerAlign: 'center',
      width: 150,
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <IconButton
          target='_blank'
          rel='noopener noreferrer'
          component='a'
          href={params.row.jobPosting}
          disabled={!params.row.jobPosting ? true : false}
        >
          <WorkTwoTone />
        </IconButton>
      }
    },
    {
      field: 'resumeLink',
      headerName: 'Resume',
      headerAlign: 'center',
      width: 150,
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <IconButton
          target='_blank'
          rel='noopener noreferrer'
          component='a'
          href={params.row.resumeLink}
          disabled={!params.row.resumeLink ? true : false}
        >
          <DescriptionTwoTone />
        </IconButton>
      }
    },
    {
      field: 'coverLetterLink',
      headerName: 'Cover Letter',
      headerAlign: 'center',
      width: 150,
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <IconButton
          target='_blank'
          rel='noopener noreferrer'
          component='a'
          href={params.row.coverLetterLink}
          disabled={!params.row.coverLetterLink ? true : false}
        >
          <DescriptionTwoTone />
        </IconButton>
      }
    },
  ];

  return (
    <AnimateKeyframes
      play
      iterationCount={1}
      keyframes={[
        "opacity: 0",
        "opacity: 1",
      ]}
    >
      <Grid
        display='flex'
        sx={{
          ml: !student ? width <= 600 ? 1 : 3 : null,
          mr: !student ? width <= 600 ? 1 : 3 : null,
          pt: !student ? 12 : null,
        }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}

        >
          <Grid xs={12} item
            sx={{
              "& ::-webkit-scrollbar": {
                display: 'none'
              }
            }}
          >
            <Paper
              id='dataGrid'
              sx={{
                overflowY: viewInterviewPrep || viewDetails ? 'auto' : 'none',
                borderRadius: 5,
                border: THEME[themeMode].border,
                background: THEME[themeMode].card,
                transition: 'color .5s, background .5s',
                height: '85vh',
                width: '100%',
              }}
              elevation={3}
            >
              {viewInterviewPrep || viewDetails ?
                <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={[
                    "opacity: 0",
                    "opacity: 1",
                  ]}
                >
                  <Box sx={{ position: 'relative' }}>
                    <IconButton
                      onClick={() => handleClose()}
                      sx={{
                        position: 'absolute',
                        top: width < 600 ? 5 : 10,
                        left: width < 600 ? 5 : 10
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  </Box>
                  <Details
                    updateJobStatus={updateJobStatus}
                    viewDetails={viewDetails}
                    themeMode={themeMode}
                    jobToView={jobToView}
                    currentUser={currentUser}
                    searchJobs={searchJobs}
                    setSearchJobs={setSearchJobs}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    subCollection={subCollection}
                    setJobs={setJobs}
                    updateInterviewDate={updateInterviewDate}
                    viewInterviewPrep={viewInterviewPrep}
                    student={student}
                    renderStatus={renderStatus}
                    loading={loading}
                    setLoading={setLoading}
                    width={width}
                  />
                </AnimateKeyframes>
                :
                <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={[
                    "opacity: 0",
                    "opacity: 1",
                  ]}
                >
                  {student ?
                    <Box sx={{ position: 'relative' }}>
                      <Chip
                        sx={{
                          zIndex: 10,
                          position: 'absolute',
                          top: 20,
                          left: 20
                        }}
                        variant={THEME[themeMode].buttonStyle}
                        onDelete={() => handleViewStudentClose()}
                        label={student.name}
                        avatar={<Avatar src={student.profilePhoto} />}
                      />
                    </Box>
                    :
                    <Box sx={{ position: 'relative' }}>
                      <Chip
                        sx={{
                          zIndex: 10,
                          position: 'absolute',
                          top: 20,
                          left: 20
                        }}
                        color='primary'
                        variant={THEME[themeMode].buttonStyle}
                        onClick={() => applicationCount >= 1 ? setDailyFilter(!dailyFilter) : setDailyFilter(false)}
                        label={dailyFilter ? 'GO BACK' : applicationCount === 1 ? 'APPLICATION TODAY' : 'APPLICATIONS TODAY'}
                        avatar={<Avatar>{applicationCount}</Avatar>}
                      />
                      <Chip
                        sx={{
                          zIndex: 10,
                          position: 'absolute',
                          top: 20,
                          right: 20
                        }}
                        color='success'
                        variant={THEME[themeMode].buttonStyle}
                        onClick={() => setOpen(true)}
                        label='ADD NEW'
                        icon={<AddCircleTwoToneIcon />}
                      />
                    </Box>
                  }
                  <Box
                    sx={{
                      borderRadius: 5,
                      transition: 'color .5s, background .5s',
                      height: '75vh',
                      width: '100%',
                      background: THEME[themeMode].card,
                      pt: 8
                    }}
                  >
                    <DataGrid
                      sx={{
                        transition: 'color .5s, background .5s',
                        color: THEME[themeMode].textColor,
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
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
                      initialState={{
                        sorting: {
                          sortModel: [{ field: 'dateApplied', sort: 'desc' }],
                        },
                      }}
                      rows={searchJobs}
                      columns={columns}
                      pageSize={20}
                      rowsPerPageOptions={[20]}
                      disableRowSelectionOnClick
                      loading={loading}
                    />
                  </Box>
                </AnimateKeyframes>
              }
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </AnimateKeyframes>
  )
};

export default MasterList;