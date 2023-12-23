import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Paper,
  Box,
  Button,
  MenuList,
  MenuItem,
  IconButton,
  Menu,
  Fade,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress,
  Badge,
  List,
  ListItem
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
  Check,
  Close
} from '@mui/icons-material';
import format from 'date-fns/format';
import {
  updateDoc,
  doc
} from 'firebase/firestore';

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
    setSearchJobs,
    applicationCount,
    subCollection,
    feedback,
    setFeedback,
    setJobs,
  } = props;

  const [viewInterviewPrep, setViewInterviewPrep] = useState(false);

  const [viewDetails, setViewDetails] = useState(false);

  const [jobToView, setJobToView] = useState({});

  const [dailyFilter, setDailyFilter] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);

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

  const getSkillz = async (prompt) => {
    try {
      const user_token = currentUser.internalId;
      if (user_token) {
        const keywordRequest = await fetch(`https://openai-api-psi.vercel.app/${user_token}/extract_keywords/`, {
          // const keywordRequest = await fetch(`http://localhost:8000/${user_token}/extract_keywords/`, {
          method: 'POST',
          mode: "cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: prompt }),
        });

        const skillz = await keywordRequest.json();
        const skillzObject = JSON.parse(skillz);
        return skillzObject;
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  const getInterviewPrepQuestions = async (prompt) => {
    try {
      const user_token = currentUser.internalId;
      if (user_token) {
        const keywordRequest = await fetch(`https://openai-api-psi.vercel.app/${user_token}/interview_prep/`, {
          // const keywordRequest = await fetch(`http://localhost:8000/${user_token}/interview_prep/`, {
          method: 'POST',
          mode: "cors",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: prompt }),
        });

        const prepQuestions = await keywordRequest.json();
        const prepQuestionsObject = JSON.parse(prepQuestions);
        return prepQuestionsObject.interview_prep;
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleGetInterviewHelp = async () => {
    setAiLoading(true);
    try {
      const jobSkills = await getSkillz(jobToView.jobDescription);
      const personalSkills = await getSkillz(jobToView.resume);
      const interviewPrep = await getInterviewPrepQuestions(jobToView.jobDescription);

      const newJobs = [...searchJobs];
      const jobToUpdate = newJobs.find(job => job.id.includes(jobToView.id));

      jobToUpdate.jobHardSkills = jobSkills.hard_skills
      jobToUpdate.jobSoftSkills = jobSkills.soft_skills
      jobToUpdate.personalHardSkills = personalSkills.hard_skills
      jobToUpdate.personalSoftSkills = personalSkills.soft_skills
      jobToUpdate.interviewPrep = interviewPrep
      setSearchJobs(newJobs);
      setJobs(newJobs);

      await updateDoc(doc(subCollection, jobToView.id), {
        jobHardSkills: jobSkills.hard_skills,
        jobSoftSkills: jobSkills.soft_skills,
        personalHardSkills: personalSkills.hard_skills,
        personalSoftSkills: personalSkills.soft_skills,
        interviewPrep: interviewPrep
      });

    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'There was an issue with your request, please try again later.'
      });
    }
    setAiLoading(false);
  }

  const renderMessage = () => {
    if (viewDetails) {
      return (
        <AnimateKeyframes
          play
          iterationCount={1}
          keyframes={[
            "opacity: 0",
            "opacity: 1",
          ]}
        >
          <Box
            sx={{
              py: 5,
              px: 5,
              height: '100%',
            }}
          >
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="start"
            >
              <Grid
                item
                xl={6}
                sx={{
                  width: '100%',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: THEME[themeMode].subCard,
                    transition: 'color .5s, background .5s',
                  }}
                >
                  <Typography>
                    {jobToView.jobPostingKeyWords.length === 0
                      ? 'No Keywords Found'
                      : `We Found ${jobToView.jobPostingKeyWords.length} Keywords For You`
                    }
                  </Typography>
                  <Typography>
                    {jobToView.jobPostingKeyWords.length !== 0 &&
                      <em>{jobToView.score}% of them have been addressed so far.</em>
                    }
                  </Typography>
                  <List
                    dense={false}
                    disablePadding
                  >
                    {jobToView.jobPostingKeyWords.length === 0
                      ? 'Try adding the entire job description.'
                      : jobToView.jobPostingKeyWords.map((keyword, idx) => {
                        return (
                          jobToView.coverLetterKeyWords.includes(keyword) || jobToView.resumeKeyWords.includes(keyword)
                            ? <ListItem key={keyword.concat(idx)} disablePadding><ListItemIcon><Check color='success' /></ListItemIcon><ListItemText primary={keyword[0].toUpperCase() + keyword.slice(1)} /></ListItem>
                            : <ListItem key={keyword.concat(idx)} disablePadding><ListItemIcon><Close color='error' /></ListItemIcon><ListItemText sx={{ color: 'red' }} primary={<strong>{keyword[0].toUpperCase() + keyword.slice(1)}</strong>} /></ListItem>
                        )
                      })}
                  </List>
                </Paper>
              </Grid>
              <Grid
                item
                xl={6}
                sx={{
                  width: '100%',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: THEME[themeMode].subCard,
                    transition: 'color .5s, background .5s',
                  }}
                >
                  <Typography>Notes</Typography>
                  <Typography>{jobToView.notes ? jobToView.notes : <em>You have not added any notes yet.</em>}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </AnimateKeyframes >
      )
    } else if (viewInterviewPrep && (jobToView.hasOwnProperty('interviewPrep') && jobToView?.interviewPrep.length > 0)) {
      return (
        <AnimateKeyframes
          play
          iterationCount={1}
          keyframes={[
            "opacity: 0",
            "opacity: 1",
          ]}
        >
          <Box
            sx={{
              py: 5,
              px: 5,
              height: '100%',
            }}
          >
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="start"
            >
              <Grid
                item
                xl={3}
                sx={{
                  width: '50%',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: THEME[themeMode].subCard,
                    transition: 'color .5s, background .5s',
                  }}
                >
                  <Typography>Job Hard Skills</Typography>
                  <ul>
                    {jobToView.jobHardSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                  <Typography>Job Soft Skills</Typography>
                  <ul>
                    {jobToView.jobSoftSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                </Paper>
              </Grid>
              <Grid
                item
                xl={3}
                sx={{
                  width: '50%',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: THEME[themeMode].subCard,
                    transition: 'color .5s, background .5s',
                  }}
                >
                  <Typography>Personal Hard Skills</Typography>
                  <ul>
                    {jobToView.personalHardSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                  <Typography>Personal Soft Skills</Typography>
                  <ul>
                    {jobToView.personalSoftSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                </Paper>
              </Grid>
              <Grid
                item
                xl={6}
                sx={{
                  width: '100%'
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: THEME[themeMode].subCard,
                    transition: 'color .5s, background .5s',
                  }}
                >

                  <Typography>Interview Prep Questions</Typography>
                  <ol>
                    {jobToView.interviewPrep.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ol>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </AnimateKeyframes>
      )
    } else {
      if ((jobToView.resume || jobToView.coverLetter) && jobToView.jobDescription) {
        return (
          <Button
            variant={THEME[themeMode].buttonStyle}
            endIcon={
              !aiLoading ? <AutoAwesomeTwoTone />
                : <CircularProgress
                  color='inherit'
                  disableShrink
                  size='1rem'
                  thickness={7}
                />
            }
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            disabled={aiLoading}
            onClick={() => handleGetInterviewHelp()}
          >
            Get Application Help
          </Button>
        )
      } else {
        return <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >A Job Description and Resume / Cover Letter are required for this service.
        </Typography>
      }
    }
  }

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
              {currentUser?.organization !== 'Personal'
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
                {currentUser?.organization !== 'Personal'
                  ? job.lastResponseFrom
                    && job.lastResponseFrom !== user.uid
                    && job.unreadMessages > 0 ?
                    <MenuItem
                      onClick={() => !student || Object.values(student).length === 0
                        ? handleViewComments(user.uid, job)
                        : handleViewComments(student.id, job)
                      }>
                      <Badge color='error' overlap='circular' variant='dot'>
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
                      </Badge>
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
      </PopupState >
    )
  };

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
                  onClick={() => updateJobStatus(job.id, 'Active')}
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
                  onClick={() => updateJobStatus(job.id, 'Interview')}
                >
                  <ListItemIcon>
                    <WorkTwoTone color='secondary' />
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
                  onClick={() => updateJobStatus(job.id, 'Other')}

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
                  onClick={() => updateJobStatus(job.id, 'Closed')}
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
      width: 100,
      renderCell: (params) => {
        return !student ? renderStatus(params.row) : <Chip
          label={params.row.status}
          variant={THEME[themeMode].buttonStyle}
          color={getStatus(params.row.status)}
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
      width: 100,
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
    <Paper
      id='dataGrid'
      className='modal'
      sx={{
        overflowY: viewInterviewPrep || viewDetails ? 'auto' : 'none',
        borderRadius: 5,
        border: THEME[themeMode].border,
        background: THEME[themeMode].card,
        transition: 'color .5s, background .5s',
        height: '85vh',
        width: '95vw',
        position: !student ? 'absolute' : 'relative',
        top: !student ? '50%' : null,
        left: !student ? '50%' : null,
        transform: !student ? 'translate(-50%, -46%)' : null,
      }}>
      {viewInterviewPrep || viewDetails ?
        <AnimateKeyframes
          play
          iterationCount={1}
          keyframes={[
            "opacity: 0",
            "opacity: 1",
          ]}
        >
          <IconButton
            onClick={() => handleClose()}
            sx={{
              position: 'absolute',
              top: 10,
              left: 10
            }}
          >
            <CloseRounded />
          </IconButton>
          {renderMessage()}
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
          {!student &&
            <>
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
              <Button
                elevation={10}
                variant={THEME[themeMode].buttonStyle}
                color='success'
                onClick={() => setOpen(true)}
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20
                }}
              >
                Add New
              </Button>
            </>
          }
          <Box
            sx={{
              borderRadius: 5,
              transition: 'color .5s, background .5s',
              height: '75vh',
              width: '95vw',
              background: THEME[themeMode].card,
              pt: 8
            }}
            id='test'
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
                  width: '0.5em'
                },
                "& ::-webkit-scrollbar-thumb": {
                  backgroundColor: 'rgb(169, 169, 169)',
                  borderRadius: '1em',
                },
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
            // onSelectionModelChange={(jobId) => (handleEditJob(jobId[0]))}
            // selectedModel={jobToEdit}
            />
          </Box>
        </AnimateKeyframes>
      }
    </Paper >
  )
};

export default MasterList;