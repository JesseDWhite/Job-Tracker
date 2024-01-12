import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  List,
  ListItem,
  TextField
} from '@mui/material';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';
import {
  AutoAwesomeTwoTone,
  Check,
  Close,
} from '@mui/icons-material';
import format from 'date-fns/format';
import {
  updateDoc,
  doc
} from 'firebase/firestore';

const Details = (props) => {

  const {
    viewDetails,
    themeMode,
    jobToView,
    renderStatus,
    currentUser,
    searchJobs,
    setSearchJobs,
    feedback,
    setFeedback,
    subCollection,
    setJobs,
    updateInterviewDate,
    viewInterviewPrep,
    student,
    setLoading,
    width
  } = props;

  const [aiLoading, setAiLoading] = useState(false);

  const getGrade = (score) => {
    if (score < 20) {
      return 'F'
    } else if (score >= 20 && score < 40) {
      return 'D'
    } else if (score >= 40 && score < 60) {
      return 'C'
    } else if (score >= 60 && score < 80) {
      return 'B'
    } else if (score >= 80 && score < 90) {
      return 'A'
    } else return 'A+'
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

  const handleGetInterviewHelp = async () => {
    setAiLoading(true);
    setLoading(true);
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
    setLoading(false);
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
              px: width < 600 ? 2 : 5,
              height: '100%',
            }}
          >
            <Grid
              container
              spacing={3}
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
                    border: THEME[themeMode].border
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Typography
                      sx={{
                        fontSize: '1.75em',
                      }}
                    >
                      {jobToView.company} - <span style={{
                        color: getScoreColor(jobToView.score),
                      }}>
                        {getGrade(jobToView.score)}
                      </span>
                    </Typography>
                    {renderStatus(jobToView)}
                  </Grid>
                  <Typography>{jobToView.jobTitle}</Typography>
                  <Typography>{format(new Date(jobToView.dateApplied.replace(/-/g, '/')), 'PPP')}</Typography>
                  <Typography>{jobToView.jobPosting}</Typography>
                  {jobToView.status === 'Interview' ?
                    !student || Object.values(student).length === 0
                      ?
                      <TextField
                        sx={{
                          mt: 1,
                          width: '50%'
                        }}
                        value={jobToView.interviewDate}
                        onChange={(e) => updateInterviewDate(jobToView.id, e)}
                        type='datetime-local'
                        name='interviewDate'
                        size='small'
                        label='Interview Date'
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      : <Typography>{jobToView.interviewDate ? format(new Date(jobToView.interviewDate), 'Pp') : null}</Typography>
                    : null
                  }
                  <hr />
                  <Typography>Notes</Typography>
                  <Typography>{jobToView.notes ? jobToView.notes : <em>No notes have been added yet.</em>}</Typography>
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
                    border: THEME[themeMode].border
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.50em'
                    }}
                  >
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
                  <hr />
                  <List
                    dense={true}
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
            </Grid>
          </Box>
        </AnimateKeyframes>
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
              px: width < 600 ? 2 : 5,
              height: '100%',
            }}
          >
            <Grid
              container
              spacing={3}
              direction="row"
              justifyContent="center"
              alignItems="start"
            >
              <Grid
                item
                xl={3}
                sm={6}
                xs={12}
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
                    border: THEME[themeMode].border
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem', textAlign: 'center' }}>Their Hard Skills</Typography>
                  <hr />
                  <ul>
                    {jobToView.jobHardSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem', textAlign: 'center' }}>Their Soft Skills</Typography>
                  <hr />
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
                sm={6}
                xs={12}
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
                    border: THEME[themeMode].border
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem', textAlign: 'center' }}>Your Hard Skills</Typography>
                  <hr />
                  <ul>
                    {jobToView.personalHardSkills.map(skill => {
                      return <li>{skill}</li>
                    })}
                  </ul>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem', textAlign: 'center' }}>Your Soft Skills</Typography>
                  <hr />
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
                xs={12}
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
                    border: THEME[themeMode].border
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem', textAlign: 'center' }}>Interview Prep Questions</Typography>
                  <hr />
                  <ol>
                    {jobToView.interviewPrep.map(skill => {
                      return <li style={{ padding: 3 }}>{skill}</li>
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
        >
          A Job Description and Resume / Cover Letter are required for this service.
        </Typography>
      }
    }
  }

  return renderMessage();
}

export default Details;