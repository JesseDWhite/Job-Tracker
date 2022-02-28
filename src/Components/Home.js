/* eslint-disable react-hooks/exhaustive-deps */
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
  setDoc
} from 'firebase/firestore';
import NewJob from './Forms/NewJob';
import {
  Grid,
  Modal,
  Fade,
  Backdrop,
  Box,
  Fab,
  Skeleton,
  Snackbar,
  Alert,
  Slide,
  AlertTitle
} from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { format } from 'date-fns';
import Auth from './Auth';
import { signOut, onAuthStateChanged, } from '@firebase/auth';
import { auth } from '../firebase';
import Header from '../Layout/Header';
import Profile from './Profile';
import MasterList from './MasterList';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';
import SignIn from './SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const userReference = collection(db, 'users');

  const organizationReference = collection(db, 'organizations');

  const [organization, setOrganization] = useState({});

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);

  const [jobToEdit, setJobToEdit] = useState({});

  const [applicationCount, setApplicationCount] = useState(0);

  const [sort, setSort] = useState(false);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({});

  const subCollection = collection(userReference, `${user?.uid}/jobs`);

  const [currentUser, setCurrentUser] = useState({});

  const [viewProfile, setViewProfile] = useState(false);

  const [themeMode, setThemeMode] = useState('lightMode');

  const darkTheme = createTheme({
    palette: {
      mode: themeMode === 'darkMode' ? 'dark' : 'light'
    }
  });

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

  const [feedback, setFeedback] = useState({
    open: false,
    type: null,
    title: null,
    message: null
  });

  const handleClose = () => {
    setFeedback({
      ...feedback,
      open: false
    });
  }

  onAuthStateChanged(auth, (current) => {
    setUser(current);
  });

  const seedData = async () => {
    const legacyJobs = query(jobsReference, where('user', '==', user?.uid));
    const legacySnapshot = await getDocs(legacyJobs);
    const extractedJobsList = legacySnapshot.docs.map((doc) => ({
      ...doc.data(), id: doc.id
    }));
    if (extractedJobsList.length > 0) {
      for (let i = 0; i < extractedJobsList.length; i++) {
        await setDoc(doc(subCollection, extractedJobsList[i].id), { ...extractedJobsList[i] });
      }
    }
  }

  const getUserData = async () => {
    const userObject = {
      name: user?.displayName,
      email: user?.email,
      signedUpOn: user?.metadata.creationTime,
      accessToken: '',
      organization: 'Personal',
      advisor: 'NOT YET ASSIGNED',
      advisorId: 'NOT YET ASSIGNED',
      cohort: 'NOT YET ASSIGNED',
      role: 'None',
      preferredTheme: 'lightMode',
      id: user?.uid,
    };
    const userQuery = query(userReference, where('id', '==', user?.uid));
    const querySnapshot = await getDocs(userQuery);
    const userData = querySnapshot.docs[0]?.data();
    if (!userData) {
      await setDoc(doc(userReference, user?.uid), userObject);
      setCurrentUser(userObject);
      getOrganization(userData);
      seedData();
    } else {
      setCurrentUser(userData);
      setThemeMode(userData.preferredTheme);
      getOrganization(userData);
    }
  }

  const getOrganization = async (userData) => {
    if (userData.role === 'Admin' || userData.role === 'Advisor') {
      //User will need to refresh the page if logging in for the first time if they have been made an Admin, or Advisor.
      const orgQuery = query(organizationReference, where('adminId', '==', userData.id));
      const querySnapshot = await getDocs(orgQuery);
      const orgData = querySnapshot.docs[0]?.data();
      setOrganization(orgData);
    } else {
      if (userData.accessToken) {
        //Get user roles, advisor, and cohort assigned to them.
        const userSubCollection = collection(organizationReference, `${userData.accessToken}/approvedUsers`);
        const orgQuery = query(userSubCollection, where('email', '==', userData.email));
        const querySnapshot = await getDocs(orgQuery);
        const orgData = querySnapshot.docs[0]?.data();
        console.log(orgData);
        console.log(userData)

        if (orgData) {
          //If user has been added to an organization.
          //Get information on the organization itself. Currently only capturing the name.
          const orgName = query(organizationReference, where('accessToken', '==', userData.accessToken));
          const nameSnapshot = await getDocs(orgName);
          const orgNameData = nameSnapshot.docs[0]?.data();
          //Get advisor information for the student.
          const advisorQuery = query(userReference, where('name', '==', orgData.advisor));
          const advisorSnapshot = await getDocs(advisorQuery);
          const advisorData = advisorSnapshot.docs[0]?.data();

          const newCurrentUser = {
            role: orgData.role,
            advisor: orgData.advisor,
            advisorId: advisorData.id,
            cohort: orgData.cohort,
            organization: orgNameData.name,
          };

          await updateDoc(doc(userReference, userData.id), newCurrentUser);
          setOrganization(orgNameData);
          setCurrentUser({ ...userData, newCurrentUser });
        } else {
          //If user has been removed from the organization, set account back to Personal.
          const newCurrentUser = {
            role: 'None',
            advisor: '',
            accessToken: '',
            advisorId: '',
            cohort: '',
            organization: ''
          }
          setCurrentUser({ ...userData, newCurrentUser });
          await updateDoc(doc(userReference, userData.id), newCurrentUser);
        }
      } else {
        //If user has removed the access token and removes themselves from the organization, set account back to Personal.
        const newCurrentUser = {
          role: 'None',
          advisor: '',
          advisorId: '',
          cohort: '',
          organization: ''
        }
        setCurrentUser({ ...userData, newCurrentUser });
        await updateDoc(doc(userReference, userData.id), newCurrentUser);
      }
    }
  }

  const getJobs = async () => {
    setOpen(false);
    if (user?.uid) {
      const userJobsList = await getDocs(subCollection);
      const extractedJobsList = userJobsList.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      }));
      extractedJobsList.sort((a, b) => {
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
      setSearchJobs(extractedJobsList);
      setJobs(extractedJobsList);
      getUserData();
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      setViewProfile(false);
      setLoading(true);
      setCurrentUser(null);
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
    newJobs.forEach(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '/')), 'yyyy-MM-dd');
      if (appDate === todaysDate && job.user === user?.uid) {
        setApplicationCount(prevState => prevState += 1);
      }
    });
  }

  const deleteJob = async (id, name) => {
    const newSearchJobs = [...searchJobs];
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => !job.id.includes(id));
    const filteredSearchJobs = newSearchJobs.filter(job => !job.id.includes(id));
    const jobDoc = doc(subCollection, id);
    setSearchJobs(filteredSearchJobs);
    setJobs(filteredJobs);
    setFeedback({
      ...feedback,
      open: true,
      type: 'warning',
      title: 'Deleted',
      message: `${name} has successfully been removed from your list`
    });
    await deleteDoc(jobDoc);
  }

  const updateJobStatus = async (id, e) => {
    const newStatus = e.target.value;
    const newJobs = [...searchJobs];
    const jobToUpdate = newJobs.find(job => job.id.includes(id));
    jobToUpdate.status = newStatus;
    const jobDoc = doc(subCollection, id);
    const updateStatus = { status: newStatus };
    setSearchJobs(newJobs);
    await updateDoc(jobDoc, updateStatus);
  }

  const updateInterviewDate = async (id, e) => {
    const newInterviewDate = e.target.value;
    const newJobs = [...searchJobs];
    const jobToUpdate = newJobs.find(job => job.id.includes(id));
    jobToUpdate.interviewDate = newInterviewDate;
    const jobDoc = doc(subCollection, id);
    const updateInterviewDate = { interviewDate: newInterviewDate }
    setSearchJobs(newJobs);
    await updateDoc(jobDoc, updateInterviewDate);
  }

  const updatePreferrdTheme = async (id) => {
    const userToUpdate = doc(userReference, id);
    if (themeMode === 'lightMode') {
      setThemeMode('darkMode');
      const newTheme = { preferredTheme: 'darkMode' };
      await updateDoc(userToUpdate, newTheme);
    } else {
      setThemeMode('lightMode');
      const newTheme = { preferredTheme: 'lightMode' };
      await updateDoc(userToUpdate, newTheme);
    }
  }

  const updateJobApplication = (job) => {
    const newJobToEdit = { ...job };
    setJobToEdit(newJobToEdit);
    setEditing(true);
    setOpen(true);
  }

  useEffect(() => {
    getJobs();
  }, [user]);

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs])

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          transition: 'color .5s, background .5s',
          background: THEME[themeMode].backgroundColor,
          mt: user?.email ? 8 : 0,
          minHeight: '100vh'
        }}
      >
        {!user?.email ? <SignIn /> : null}
        <Modal
          open={open}
          onClose={() => ((setOpen(!open), setEditing(false)))}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={open}>
            <Box container sx={modalStyle} className='modal'>
              {!user?.email
                ? <Auth />
                : <NewJob
                  themeMode={themeMode}
                  jobsReference={jobsReference}
                  subCollection={subCollection}
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
                  handleClose={handleClose}
                  feedback={feedback}
                  setFeedback={setFeedback}
                />
              }
            </Box>
          </Fade>
        </Modal>
        {user?.email && viewProfile
          ?
          <Grid>
            <AnimateKeyframes
              play
              iterationCount={1}
              keyframes={[
                "opacity: 0",
                "opacity: 1",
              ]}
            >
              <Profile
                feedback={feedback}
                setFeedback={setFeedback}
                getUserData={getUserData}
                userReference={userReference}
                organization={organization}
                organizationReference={organizationReference}
                setOrganization={setOrganization}
                user={user}
                currentUser={currentUser}
                logout={logout}
                jobs={jobs}
                themeMode={themeMode}
              />
            </AnimateKeyframes>
          </Grid>
          : <Grid
            display='flex'
          >
            <Grid
              sm={12}
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
                          sx={{ mt: 11.50, mx: 3 }}
                          container
                          direction="row"
                          justifyContent="start"
                        >
                          {Array.from(new Array(12)).map((skeleton, idx) => {
                            return (
                              <Grid
                                key={idx}
                                sm={6}
                                xl={3}
                                spacing={2}
                                item
                              >
                                <Skeleton key={skeleton} variant="rectangular" sx={{ mb: 8, mx: 3, height: 290, borderRadius: 5 }} />
                              </Grid>
                            )
                          })}
                        </Grid>
                      </Grid>
                    </AnimateKeyframes>
                    : <Grid sx={{ m: 3 }}>
                      <MasterList
                        themeMode={themeMode}
                        searchJobs={searchJobs}
                        jobs={jobs}
                        updateJobApplication={updateJobApplication}
                        jobToEdit={jobToEdit}
                        setJobToEdit={setJobToEdit}
                        editing={editing}
                        setEditing={setEditing}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        updateInterviewDate={updateInterviewDate}
                      />
                      <Fab
                        variant='extended'
                        sx={{
                          position: 'fixed',
                          top: 100,
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
        {user?.email
          ? <Header
            updatePreferrdTheme={updatePreferrdTheme}
            currentUser={currentUser}
            themeMode={themeMode}
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
          : null
        }
        <Snackbar
          sx={{ width: '100%' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={feedback.open}
          onClose={handleClose}
          TransitionComponent={Slide}
          autoHideDuration={4000}
        >
          <Alert
            variant="filled"
            severity={feedback.type}
            onClose={handleClose}
            sx={{ width: '45%' }}
          >
            <AlertTitle>{feedback.title}</AlertTitle>
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Home;