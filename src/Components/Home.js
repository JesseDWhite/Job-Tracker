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
  Typography,
  Chip,
  Modal,
  Fade,
  Backdrop,
  Box,
  Fab,
  Skeleton
} from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { format } from 'date-fns';
import Auth from './Auth';
import {
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { auth } from '../firebase';
import Header from './Header';
import CardView from './CardView';
import Profile from './Profile';
import Analytics from './Analytics';
import { AnimateKeyframes } from 'react-simple-animate';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 500,
  maxHeight: '85%',
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);

  const [jobToEdit, setJobToEdit] = useState({});

  const [applicationCount, setApplicationCount] = useState(0);

  const [user, setUser] = useState({});

  const [sort, setSort] = useState(false);

  const [loading, setLoading] = useState(true);

  const [viewProfile, setViewProfile] = useState(false);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const getJobs = async () => {
    setOpen(false);
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
      setViewProfile(false);
      setLoading(true);
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
    const newJobs = [...searchJobs];
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

  const deleteJob = async (id) => {
    const newSearchJobs = [...searchJobs];
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => !job.id.includes(id))
    const filteredSearchJobs = newSearchJobs.filter(job => !job.id.includes(id))
    const jobDoc = doc(db, 'jobs', id);
    setSearchJobs(filteredSearchJobs);
    setJobs(filteredJobs);
    await deleteDoc(jobDoc);
  }

  const updateJobStatus = async (id, jobidx, e) => {
    const newStatus = e.target.value;
    const newJobs = [...searchJobs];
    newJobs[jobidx].status = newStatus;
    const jobDoc = doc(db, 'jobs', id);
    const updateStatus = { status: newStatus };
    setSearchJobs(newJobs);
    await updateDoc(jobDoc, updateStatus);
  }

  const updateInterviewDate = async (id, jobidx, e) => {
    const newInterviewDate = e.target.value;
    const newJobs = [...searchJobs];
    newJobs[jobidx].interviewDate = newInterviewDate;
    const jobDoc = doc(db, 'jobs', id);
    const updateInterviewDate = { interviewDate: newInterviewDate }
    setSearchJobs(newJobs);
    await updateDoc(jobDoc, updateInterviewDate);
  }

  const updateJobApplication = (job) => {
    const newJobToEdit = { ...job };
    setJobToEdit(newJobToEdit);
    setEditing(true);
    setOpen(true);
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
    const newJobs = [...searchJobs];
    const filteredJobs = newJobs.filter(job => job.status.includes(status));
    const count = filteredJobs.length;
    return count;
  }

  useEffect(() => {
    if (!user?.email) {
      setOpen(true);
      setLoading(true);
    } else {
      getJobs();
    }
  }, [user]);

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs])

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(!open)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box container sx={modalStyle}>
            {!user?.email
              ? <Auth />
              : <NewJob
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
                handleSetOpen={setOpen}
              />
            }
          </Box>
        </Fade>
      </Modal>
      {user?.email && viewProfile
        ?
        <Grid
          display='flex'
          sx={{
            mt: 10
          }}
        >
          <Grid
            sm={4}
            sx={{
              m: 3
            }}
          >
            <AnimateKeyframes
              play
              iterationCount={1}
              keyframes={[
                "opacity: 0",
                "opacity: 1",
              ]}
            >
              <Profile
                user={user}
                logout={logout}
                jobs={jobs}
              />
            </AnimateKeyframes>
          </Grid>
          <Grid
            sm={8}
            sx={{
              m: 3
            }}
          >
            <AnimateKeyframes
              play
              iterationCount={1}
              keyframes={[
                "opacity: 0",
                "opacity: 1",
              ]}
            >
              <Analytics
                jobs={jobs}
                applicationCount={applicationCount}
              />
            </AnimateKeyframes>
          </Grid>
        </Grid>
        : <Grid
          display='flex'
          sx={{
            mt: 10
          }}
        >
          <Grid
            sm={12}
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
                    <Grid display='flex'>
                      <Grid
                        sx={{
                          mt: 12
                        }}
                        container
                        direction="row"
                        justifyContent="start"
                      >
                        {Array.from(new Array(8)).map(skeleton => {
                          return (
                            <Grid
                              sm={6}
                              xl={3}
                              spacing={2}
                              item
                            >
                              <Skeleton key={skeleton} variant="rectangular" sx={{ mb: 6, mx: 3, height: 350, borderRadius: 5 }} />
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
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
                                sm={6}
                                xl={3}
                              >
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
                                sm={6}
                                xl={3}
                              >
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
                              sm={6}
                              xl={3}
                            >
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
                            </Grid>
                            : null
                        );
                      })}
                    </Grid>
                    <Fab
                      variant='extended'
                      sx={{
                        position: 'fixed',
                        top: 110,
                        right: 30,
                        backgroundColor: 'green',
                        '&:hover': {
                          backgroundColor: 'darkGreen'
                        },
                        color: 'white'
                      }}
                      onClick={() => setOpen(!open)}
                    >
                      <AddCircleTwoToneIcon sx={{ mr: 1 }} />
                      ADD NEW
                    </Fab>
                  </Grid>
                : null
              }
            </Grid>
          </Grid>
        </Grid>
      }
      <Header
        viewProfile={viewProfile}
        setViewProfile={setViewProfile}
        user={user}
        logout={logout}
        sortByDate={sortByDate}
        sortByName={sortByName}
        sort={sort}
        setSort={setSort}
        jobs={jobs}
        setSearchJobs={setSearchJobs}
        applicationCount={applicationCount}
        setApplicationCount={setApplicationCount}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default Home;