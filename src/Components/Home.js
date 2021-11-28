import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Grid,
  Paper,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import Auth from './Auth';
import {
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { auth } from '../firebase';
import Header from './Header';
import CardView from './CardView';
import ListView from './ListView';
import { AnimateKeyframes } from 'react-simple-animate';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [cardView, setCardView] = useState(true);

  const [editing, setEditing] = useState(false);

  const [jobToEdit, setJobToEdit] = useState({});

  const [applicationCount, setApplicationCount] = useState(0);

  const [user, setUser] = useState({});

  const [sort, setSort] = useState(false);

  const [loading, setLoading] = useState(true);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const getJobs = async () => {
    if (user?.uid) {
      const querySnapshot = query(jobsReference, where('user', '==', user?.uid))
      const data = await getDocs(querySnapshot);
      const newSearchJobs = data.docs.map((doc) =>
      ({
        ...doc.data(), id: doc.id
      }));

      newSearchJobs.sort((a, b) => {
        const newA = a.dateApplied;
        const newB = b.dateApplied;
        if (newA < newB) {
          return 1;
        }
        if (newA > newB) {
          return -1;
        }
        return 0;
      })
      setSearchJobs(newSearchJobs);
      setJobs(newSearchJobs);
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  }

  const sortByDate = () => {
    const newJobs = [...searchJobs];
    const sortedByDate = newJobs.sort((a, b) => {
      const newA = a.dateApplied;
      const newB = b.dateApplied;
      if (newA < newB) {
        return 1;
      }
      if (newA > newB) {
        return -1;
      }
      return 0;
    })
    setSearchJobs(sortedByDate);
    setSort(!sort);
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByName = newJobs.sort((a, b) => {
      const newA = a.company.toLowerCase();
      const newB = b.company.toLowerCase();
      if (newA < newB) {
        return -1;
      }
      if (newA > newB) {
        return 1;
      }
      return 0;
    })
    setSearchJobs(sortedByName);
    setSort(!sort);
  }

  const getApplicationTotal = () => {
    const newJobs = [...jobs];
    setApplicationCount(0);
    const todaysDate = format(new Date(), 'yyyy-MM-dd');
    newJobs.map(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '\/')), 'yyyy-MM-dd');
      if (appDate === todaysDate && job.user === user?.uid) {
        setApplicationCount(prevState => prevState += 1);
      }
    });
  }

  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      console.log(text)
    };
    reader.readAsText(e.target.files[0])
  }

  const deleteJob = async (id, jobidx) => {
    const newJobs = [...jobs];
    newJobs.splice(jobidx, 1);
    const jobDoc = doc(db, 'jobs', id);
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await deleteDoc(jobDoc);
  }

  const updateJobStatus = async (id, jobidx, e) => {
    const newStatus = e.target.value;
    const newJobs = [...jobs];
    newJobs[jobidx].status = newStatus;
    const jobDoc = doc(db, 'jobs', id);
    const updateStatus = { status: newStatus };
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await updateDoc(jobDoc, updateStatus);
  }

  const updateInterviewDate = async (id, jobidx, e) => {
    const newInterviewDate = e.target.value;
    const newJobs = [...jobs];
    newJobs[jobidx].interviewDate = newInterviewDate;
    const jobDoc = doc(db, 'jobs', id);
    const updateInterviewDate = { interviewDate: newInterviewDate }
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await updateDoc(jobDoc, updateInterviewDate);
  }

  const updateJobApplication = (job) => {
    const newJobToEdit = { ...job };
    setJobToEdit(newJobToEdit);
    setEditing(true);
  }

  const gradeApplication = (score) => {
    if (score < 20) {
      return 1
    } else if (score >= 20 && score < 40) {
      return 2
    } else if (score >= 40 && score < 70) {
      return 3
    } else if (score >= 70 && score < 90) {
      return 4
    } else return 5
  }

  const getStatus = (status) => {
    if (status === 'Active') {
      return '#4CAF50';
    } else if (status === 'Interview') {
      return '#673AB7';
    } else if (status === 'Closed') {
      return '#F44336';
    }
  };

  const getTotalApplicationCount = (status) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

  useEffect(() => {
    getJobs();
  }, [user]);

  useEffect(() => {
  }, [cardView])

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs])

  return (
    <>
      <Grid
        display='flex'
        sx={{
          mt: 10
        }}
      >
        {/* <input
          type='file'
          accept='.doc,.docx,application/msword,application/pdf'
          onChange={(e) => showFile(e)}
          name='coverLetter'
          id='coverLetter'
        /> */}
        <Grid
          sm={8}
          sx={{
            m: 3,
          }}
        >
          <Grid>
            {user?.email ?
              loading
                ? <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={[
                    "opacity: 0",
                    "opacity: 1",
                  ]}
                >
                  <LinearProgress sx={{ width: '100%' }} />
                </AnimateKeyframes>
                : <Grid>
                  <Grid>
                    <AnimateKeyframes
                      play
                      iterationCount={1}
                      keyframes={[
                        "opacity: 0",
                        "opacity: 1",
                      ]}
                    >
                      {searchJobs.every(job => job.status !== 'Interview')
                        ? null
                        :
                        <Typography
                          variant='h4'
                          sx={{
                            mt: 3,
                            ml: 2
                          }}
                        >
                          Upcoming Interviews <Chip label={getTotalApplicationCount('Interview')} />
                        </Typography>
                      }
                    </AnimateKeyframes>
                    <Grid
                      container
                      direction='row'
                      justifyContent='start'
                    >
                      {searchJobs.map((job, jobidx) => {
                        return (
                          job.status === 'Interview' ?
                            <Grid
                              sm={cardView ? 6 : 8}
                              xl={cardView ? 4 : 11}
                            >
                              {cardView ?
                                <AnimateKeyframes
                                  play
                                  iterationCount={1}
                                  keyframes={[
                                    "opacity: 0",
                                    "opacity: 1",
                                  ]}
                                >
                                  <CardView
                                    key={job.id}
                                    updateJobApplication={updateJobApplication}
                                    jobToEdit={jobToEdit}
                                    setJobToEdit={setJobToEdit}
                                    editing={editing}
                                    setEditing={setEditing}
                                    job={job}
                                    getStatus={getStatus}
                                    gradeApplication={gradeApplication}
                                    deleteJob={deleteJob}
                                    updateJobStatus={updateJobStatus}
                                    jobidx={jobidx}
                                    updateInterviewDate={updateInterviewDate}
                                  />
                                </AnimateKeyframes>
                                :
                                <AnimateKeyframes
                                  play
                                  iterationCount={1}
                                  keyframes={["opacity: 0", "opacity: 1"]}
                                >
                                  <ListView
                                    key={job.id}
                                    updateJobApplication={updateJobApplication}
                                    jobToEdit={jobToEdit}
                                    editing={editing}
                                    setEditing={setEditing}
                                    job={job}
                                    getStatus={getStatus}
                                    gradeApplication={gradeApplication}
                                    deleteJob={deleteJob}
                                    updateJobStatus={updateJobStatus}
                                    jobidx={jobidx}
                                  />
                                </AnimateKeyframes>
                              }
                            </Grid>
                            : null
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid>
                    <AnimateKeyframes
                      play
                      iterationCount={1}
                      keyframes={["opacity: 0", "opacity: 1"]}
                    >
                      {searchJobs.every(job => job.status !== 'Active')
                        ? null
                        :
                        <Typography
                          variant='h4'
                          sx={{
                            mt: 3,
                            ml: 2
                          }}
                        >
                          Active Applications <Chip label={getTotalApplicationCount('Active')} />
                          {/* <Pagination color='primary' variant='outlined' count={10} /> */}
                        </Typography>
                      }
                    </AnimateKeyframes>
                    <Grid
                      container
                      direction='row'
                      justifyContent='start'
                    >
                      {searchJobs.map((job, jobidx) => {
                        return (
                          job.status === 'Active' ?
                            <Grid
                              sm={cardView ? 6 : 8}
                              xl={cardView ? 4 : 11}
                            >
                              {cardView ?
                                <AnimateKeyframes
                                  play
                                  iterationCount={1}
                                  keyframes={["opacity: 0", "opacity: 1"]}
                                >
                                  <CardView
                                    key={job.id}
                                    updateJobApplication={updateJobApplication}
                                    jobToEdit={jobToEdit}
                                    setJobToEdit={setJobToEdit}
                                    editing={editing}
                                    setEditing={setEditing}
                                    job={job}
                                    getStatus={getStatus}
                                    gradeApplication={gradeApplication}
                                    deleteJob={deleteJob}
                                    updateJobStatus={updateJobStatus}
                                    jobidx={jobidx}
                                    updateInterviewDate={updateInterviewDate}
                                  />
                                </AnimateKeyframes>
                                :
                                <AnimateKeyframes
                                  play
                                  iterationCount={1}
                                  keyframes={["opacity: 0", "opacity: 1"]}
                                >
                                  <ListView
                                    key={job.id}
                                    updateJobApplication={updateJobApplication}
                                    jobToEdit={jobToEdit}
                                    editing={editing}
                                    setEditing={setEditing}
                                    job={job}
                                    getStatus={getStatus}
                                    gradeApplication={gradeApplication}
                                    deleteJob={deleteJob}
                                    updateJobStatus={updateJobStatus}
                                    jobidx={jobidx}
                                  />
                                </AnimateKeyframes>
                              }
                            </Grid>
                            : null
                        );
                      })}
                    </Grid>
                  </Grid>
                  <AnimateKeyframes
                    play
                    iterationCount={1}
                    keyframes={["opacity: 0", "opacity: 1"]}
                  >
                    {searchJobs.every(job => job.status !== 'Closed')
                      ? null
                      :
                      <Typography
                        variant='h4'
                        sx={{
                          mt: 3,
                          ml: 2
                        }}
                      >
                        Closed Applications <Chip label={getTotalApplicationCount('Closed')} />
                      </Typography>
                    }
                  </AnimateKeyframes>
                  <Grid
                    container
                    direction='row'
                    justifyContent='start'
                  >
                    {searchJobs.map((job, jobidx) => {
                      return (
                        job.status === 'Closed' ?
                          <Grid
                            sm={cardView ? 6 : 8}
                            xl={cardView ? 4 : 11}
                          >
                            {cardView ?
                              <AnimateKeyframes
                                play
                                iterationCount={1}
                                keyframes={["opacity: 0", "opacity: 1"]}
                              >
                                <CardView
                                  key={job.id}
                                  updateJobApplication={updateJobApplication}
                                  jobToEdit={jobToEdit}
                                  setJobToEdit={setJobToEdit}
                                  editing={editing}
                                  setEditing={setEditing}
                                  job={job}
                                  getStatus={getStatus}
                                  gradeApplication={gradeApplication}
                                  deleteJob={deleteJob}
                                  updateJobStatus={updateJobStatus}
                                  jobidx={jobidx}
                                  updateInterviewDate={updateInterviewDate}
                                />
                              </AnimateKeyframes>
                              :
                              <AnimateKeyframes
                                play
                                iterationCount={1}
                                keyframes={["opacity: 0", "opacity: 1"]}
                              >
                                <ListView
                                  key={job.id}
                                  updateJobApplication={updateJobApplication}
                                  jobToEdit={jobToEdit}
                                  editing={editing}
                                  setEditing={setEditing}
                                  job={job}
                                  getStatus={getStatus}
                                  gradeApplication={gradeApplication}
                                  deleteJob={deleteJob}
                                  updateJobStatus={updateJobStatus}
                                  jobidx={jobidx}
                                />
                              </AnimateKeyframes>
                            }
                          </Grid>
                          : null
                      );
                    })}
                  </Grid>
                </Grid>
              : null
            }
          </Grid>
        </Grid>
        <Grid
          sm={4}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              mr: 3,
            }}
          >
            {!user?.email ?
              <Auth />
              :
              <AnimateKeyframes
                play
                iterationCount={1}
                keyframes={["opacity: 0", "opacity: 1"]}
              >
                <NewJob
                  jobsReference={jobsReference}
                  getJobs={getJobs}
                  editing={editing}
                  setEditing={setEditing}
                  jobToEdit={jobToEdit}
                  jobs={jobs}
                  setJobs={setJobs}
                  searchJobs={searchJobs}
                  setSearchJobs={setSearchJobs}
                  user={user}
                />
              </AnimateKeyframes>
            }
          </Paper>
        </Grid>
      </Grid>
      <Header
        user={user}
        logout={logout}
        sortByDate={sortByDate}
        sortByName={sortByName}
        cardView={cardView}
        setCardView={setCardView}
        sort={sort}
        setSort={setSort}
        jobs={jobs}
        setSearchJobs={setSearchJobs}
        applicationCount={applicationCount}
        setApplicationCount={setApplicationCount}
      />
    </>
  );
};

export default Home;