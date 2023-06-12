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
  setDoc,
  limit,
  orderBy,
  startAfter,
  getDoc
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
  AlertTitle,
} from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import { format } from 'date-fns';
import { signOut, onAuthStateChanged, } from '@firebase/auth';
import { auth } from '../firebase';
import Header from '../Layout/Header';
import Profile from './User/Profile';
import MasterList from './MasterList';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';
import SignIn from './User/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Comments from './Comments';

const Main = () => {

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

  const [currentUser, setCurrentUser] = useState({});

  const [viewProfile, setViewProfile] = useState(false);

  const [themeMode, setThemeMode] = useState('lightMode');

  const [totalApplications, setTotalApplications] = useState(0);

  const [viewComments, setViewComments] = useState(false);

  const [comments, setComments] = useState([]);

  const jobsReference = collection(db, 'jobs');

  const userReference = collection(db, 'users');

  const organizationReference = collection(db, 'organizations');

  const subCollection = collection(userReference, `${user?.uid}/jobs`);

  const [feedback, setFeedback] = useState({
    open: false,
    type: null,
    title: null,
    message: null
  });

  const darkTheme = createTheme({
    palette: {
      mode: themeMode === 'darkMode' ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Readex Pro',
      h3: {
        fontWeight: 500,
      },
      caption: {
        fontWeight: 100
      }
    },
  });

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 525,
    maxWidth: viewComments ? 525 : null,
    maxHeight: '85%',
    bgcolor: THEME[themeMode].card,
    color: THEME[themeMode].textColor,
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto'
  };

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
    if (user?.uid === 'KbNvTmy7BYW5B60S0wnB3mEHGGs1'
      || user?.uid === 'hJJQlYERrWbK6J44QdtMLUHOQbK2'
      || user?.uid === '8LiiJKeXXaNqghA15AvlMSlmwtI2') {
      try {
        const legacyJobs = query(jobsReference, where('user', '==', user?.uid));
        const legacySnapshot = await getDocs(legacyJobs);
        const extractedJobsList = legacySnapshot.docs.map((doc) => ({
          ...doc.data(), id: doc.id, resumeLink: '', coverLetterLink: '', attendedInterview: false
        }));
        if (extractedJobsList.length > 0) {
          for (let i = 0; i < extractedJobsList.length; i++) {
            await setDoc(doc(subCollection, extractedJobsList[i].id), { ...extractedJobsList[i] });
          }
        }
      } catch (error) {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `There was an issue connecting to the network, please try again`
        });
      }
    }
  }

  const getUserData = async (applications) => {
    try {
      const userObject = {
        name: user?.displayName,
        email: user?.email,
        profilePhoto: user?.photoURL.replace('s96-c', 's400-c'),
        signedUpOn: user?.metadata.creationTime,
        accessToken: '',
        organization: 'Personal',
        advisor: '',
        advisorId: '',
        cohort: '',
        role: 'Personal',
        preferredTheme: 'lightMode',
        id: user?.uid,
        totalApplications: applications ? applications.length : 0,
        totalInterviews: 0,
        storedResume: ''
      };
      const userQuery = query(userReference, where('id', '==', user?.uid));
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs[0]?.data();
      if (!userData) { //If the user is logging in for the very first time.
        await setDoc(doc(userReference, user?.uid), userObject);
        setCurrentUser(userObject);
        seedData();
      } else { //Will run every time after the initial sign up.
        //If the user has updated their profile photo for google, update to the most recent.
        const updatedUserPhoto = { profilePhoto: user?.photoURL.replace('s96-c', 's400-c') };
        const userToUpdate = doc(userReference, userData.id);
        await updateDoc(userToUpdate, updatedUserPhoto);
        //Might need to refresh to see their updated photo.
        setCurrentUser(userData);
        setThemeMode(userData.preferredTheme);
        getOrganization(userData);
        seedData();
      }
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue connecting to the network, please try again`
      });
    }
  }

  const getOrganization = async (userData) => {
    //Standard user parameters for resetting user information
    const defaultUserParams = {
      role: 'Personal',
      advisor: '',
      accessToken: '',
      advisorId: '',
      cohort: '',
      internalId: '',
      organization: 'Personal'
    }
    if (userData?.accessToken) {
      try {
        //Get user roles, advisor, and cohort assigned to them.
        const approvedUsersSubCollection = collection(organizationReference, `${userData?.accessToken}/approvedUsers`);
        const approvedUsersQuery = query(approvedUsersSubCollection, where('email', '==', userData?.email));
        const querySnapshot = await getDocs(approvedUsersQuery);
        const approvedUserData = querySnapshot.docs[0]?.data();

        if (approvedUserData) {
          //If user has been added to an organization by an admin.
          //Get information on the organization itself. Currently only using the name.
          const orgName = query(organizationReference, where('accessToken', '==', userData?.accessToken));
          const nameSnapshot = await getDocs(orgName);
          const orgNameData = nameSnapshot.docs[0]?.data();

          //Grap the advisor's information for the student.
          const advisorQuery = query(userReference, where('name', '==', approvedUserData.advisor));
          const advisorSnapshot = await getDocs(advisorQuery);
          const advisorData = advisorSnapshot.docs[0]?.data();

          //Add the approved user id and total applications to the approvedUsers doc.
          const setInternalId = querySnapshot.docs.map((student) => ({
            ...student.data(),
            id: student.id,
            totalApplications: userData?.totalApplications,
            photo: userData?.profilePhoto
          }));
          const studentToUpdate = doc(approvedUsersSubCollection, setInternalId[0].id);
          await updateDoc(studentToUpdate, setInternalId[0]);

          //Update the users account with the organization info.
          const newCurrentUser = {
            role: approvedUserData.role,
            advisor: approvedUserData.advisor ? approvedUserData.advisor : 'Not yet assigned',
            advisorId: advisorData ? advisorData.id : 'Not yet assigned',
            cohort: approvedUserData.cohort,
            organization: orgNameData.name,
            internalId: setInternalId[0].id,
          };
          await updateDoc(doc(userReference, userData?.id), newCurrentUser);
          setOrganization(orgNameData);
          setCurrentUser({ ...userData, newCurrentUser });
        } else {
          setFeedback({
            ...feedback,
            open: true,
            type: 'error',
            title: 'Error',
            message: `The Access Token you provided is either incorrect, or not associated with an organization anymore`
          });
          await updateDoc(doc(userReference, userData?.id), defaultUserParams);
          setCurrentUser({ ...userData, defaultUserParams });
        }
      } catch (error) {
        //If the user tries to upload an access token that does not exist.
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: `Access Token ${userData.accessToken} is not associated with any organization`
        });
        setCurrentUser({ ...userData, defaultUserParams });
        await updateDoc(doc(userReference, userData.id), defaultUserParams);
      }
    }
  }

  const getJobs = async () => {
    try {
      setOpen(false);
      if (user?.uid) {
        const userJobsList = await getDocs(subCollection);
        const extractedJobsList = userJobsList.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }));
        if (extractedJobsList.length > 0) {
          extractedJobsList.sort((a, b) => {
            const newA = a.dateApplied;
            const newB = b.dateApplied;
            if (newA < newB) return 1;
            if (newA > newB) return -1;
            return 0;
          });
          const userToUpdate = doc(userReference, user?.uid);
          const newTotal = { totalApplications: extractedJobsList.length };
          await updateDoc(userToUpdate, newTotal);
          setSearchJobs(extractedJobsList);
          setJobs(extractedJobsList);
          setTotalApplications(extractedJobsList.length);
          getUserData(extractedJobsList);
          setLoading(false);
        } else {
          setSearchJobs(extractedJobsList);
          setJobs(extractedJobsList);
          setTotalApplications(extractedJobsList.length);
          getUserData(extractedJobsList);
          setLoading(false);
        }
      }
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: `There was an issue connecting to the network, please try again`
      });
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
      if (newA < newB) return 1;
      if (newA > newB) return -1;
      return 0;
    });
    setSearchJobs(sortedByDate);
    setSort(!sort);
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByName = newJobs.sort((a, b) => {
      const newA = a.company.toLowerCase();
      const newB = b.company.toLowerCase();
      if (newA < newB) return -1;
      if (newA > newB) return 1;
      return 0;
    });
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
    setTotalApplications(newJobs.length);
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
    setJobs(newJobs);
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

  const updateAttendedInterview = async (id, attended) => {
    const newAttended = !attended;
    const newJobs = [...searchJobs];
    const jobToUpdate = newJobs.find(job => job.id.includes(id));
    jobToUpdate.attendedInterview = newAttended;
    const jobDoc = doc(subCollection, id);
    const updateAttendedInterview = { attendedInterview: newAttended };
    setSearchJobs(newJobs);
    setJobs(newJobs);
    await updateDoc(jobDoc, updateAttendedInterview);
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

  const handleViewComments = async (id, job) => {
    setViewComments(true);
    setOpen(true);
    setJobToEdit(job);

    //Gather comments from a specific user's job application as well as the job document.
    const commentsSubColletion = collection(userReference, `${id}/jobs/${job.id}/comments`);

    //Only grab a certain number of the most recent comments as to not overload the servers.
    const commentsSnapshot = query(commentsSubColletion, orderBy('timeStamp', 'desc'), limit(25));
    const commentsResults = await getDocs(commentsSnapshot);

    if (commentsResults) {
      const extractedComments = commentsResults.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      }));

      const sortedByDate = extractedComments.sort((a, b) => {
        const newA = a.timeStamp;
        const newB = b.timeStamp;
        if (newA < newB) return -1;
        if (newA > newB) return 1;
        return 0;
      });

      //Mark any comments not tied to the current user as read when viewing them.
      sortedByDate.forEach(comment => {
        if (comment.userId !== user.uid) {
          comment.read = true;
          updateDoc(doc(commentsSubColletion, comment.id), { read: true });
        }
      });
      setComments(sortedByDate);

      //Update state for unread count only for the main view. Loosly apply the same rule to the advisro view.
      if (!viewProfile) {
        const newJobs = [...jobs];
        const jobToUpdate = newJobs.find(app => app.id.includes(job.id));
        jobToUpdate.unreadMessages = 0;
        setJobs(newJobs);
        setSearchJobs(newJobs);
      } else {
        job.unreadMessages = 0;
      }

      const jobDoc = doc(userReference, `${id}/jobs`, job.id);
      const jobResults = await getDoc(jobDoc);
      const extractedJob = jobResults.data();

      //Update the unread messages to 0 if this user was not the last to leave a message and if there are current unread messages.
      if (extractedJob.lastResponseFrom !== user.uid && extractedJob.unreadMessages > 0) {
        await updateDoc(jobDoc, {
          unreadMessages: 0
        });
      }
    }
  }

  const handleShowMoreComments = async (id, job) => {
    //Gather comments from a specific user's job application.
    const commentsSubColletion = collection(userReference, `${id}/jobs/${job.id}/comments`);

    //Only grab a certain number of the most recent comments as to not overload the servers.
    const commentsSnapshot = query(commentsSubColletion, orderBy('timeStamp', 'desc'), limit(comments.length));
    const snapshotResults = await getDocs(commentsSnapshot);

    //Use the last comment as the starting point for the following query.
    const lastVisibleComment = snapshotResults.docs[snapshotResults.docs.length - 1];

    //Gather the 10 previous comments from the already displaying comments.
    const nextCommentsSnapshot = query(commentsSubColletion, orderBy('timeStamp', 'desc'), startAfter(lastVisibleComment), limit(10));
    const nextCommentsResults = await getDocs(nextCommentsSnapshot);

    if (nextCommentsResults) {

      const extractedComments = nextCommentsResults.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      }));

      //Add the older 10 comments to the comments array for sorting.
      const newComments = comments.concat(extractedComments);

      const sortedByDate = newComments.sort((a, b) => {
        const newA = a.timeStamp;
        const newB = b.timeStamp;
        if (newA < newB) return -1;
        if (newA > newB) return 1;
        return 0;
      });

      //Mark any comments not tied to the current user as read when viewing them.
      sortedByDate.forEach(comment => {
        if (comment.userId !== user.uid) {
          comment.read = true;
          updateDoc(doc(commentsSubColletion, comment.id), { read: true })
        }
      });

      setComments(sortedByDate);
    }
  }


  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      setEditing(false);
      setJobToEdit({});
      setComments([]);
      setViewComments(false);
    }, 500);
  }

  useEffect(() => {
    getJobs();
  }, [user]);

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          transition: 'color .5s, background .5s',
          background: THEME[themeMode].backgroundColor,
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {!user?.email ? <SignIn />
          : viewProfile
            ? <Grid>
              <AnimateKeyframes
                play
                iterationCount={1}
                keyframes={[
                  "opacity: 0",
                  "opacity: 1",
                ]}
              >
                <Profile
                  totalApplications={totalApplications}
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
                  setSearchJobs={setSearchJobs}
                  setViewProfile={setViewProfile}
                  handleViewComments={handleViewComments}
                  getJobs={getJobs}
                />
              </AnimateKeyframes>
            </Grid>
            : <Grid
              display='flex'
            >
              <Grid
                item
                sm={12}
              >
                <Grid sx={{ m: 3, pt: 8 }}>
                  {loading
                    ? <AnimateKeyframes
                      play
                      iterationCount={1}
                      keyframes={[
                        "opacity: 0",
                        "opacity: 1",
                      ]}
                    >
                      <Grid display='flex' >
                        <Grid
                          sx={{ mt: 17, mx: 3 }}
                          container
                          direction="row"
                          justifyContent="start"
                        >
                          {Array.from(new Array(12)).map((skeleton, idx) => {
                            return (
                              <Grid
                                key={idx}
                                xs={12}
                                sm={4}
                                xl={3}
                                item
                              >
                                <Skeleton key={skeleton} variant="rectangular" sx={{ mb: 8, mx: 3, height: 300, borderRadius: 5 }} />
                              </Grid>
                            )
                          })}
                        </Grid>
                      </Grid>
                    </AnimateKeyframes>
                    : <Grid >
                      <MasterList
                        loading={loading}
                        themeMode={themeMode}
                        searchJobs={searchJobs}
                        jobs={jobs}
                        updateJobApplication={updateJobApplication}
                        deleteJob={deleteJob}
                        updateJobStatus={updateJobStatus}
                        updateInterviewDate={updateInterviewDate}
                        handleViewComments={handleViewComments}
                        user={user}
                        userReference={userReference}
                        currentUser={currentUser}
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
                      <Fab
                        color='info'
                        sx={{
                          position: 'fixed',
                          bottom: 30,
                          right: 30,
                        }}
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://forms.gle/cy3TvnmfxrgkZY8K6'
                      >
                        <CommentTwoToneIcon />
                      </Fab>
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
        }
        {user?.email && <Header
          updatePreferrdTheme={updatePreferrdTheme}
          currentUser={currentUser}
          themeMode={themeMode}
          viewProfile={viewProfile}
          setViewProfile={setViewProfile}
          user={user}
          sortByDate={sortByDate}
          sortByName={sortByName}
          sort={sort}
          jobs={jobs}
          setSearchJobs={setSearchJobs}
          applicationCount={applicationCount}
          loading={loading}
          searchJobs={searchJobs}
        />}
        <Snackbar
          sx={{ width: '100%' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={feedback.open}
          onClose={handleClose}
          TransitionComponent={Slide}
          autoHideDuration={4000}
        >
          <Alert
            severity={feedback.type}
            onClose={handleClose}
            sx={{ width: '45%' }}
          >
            <AlertTitle>{feedback.title}</AlertTitle>
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
      <Modal
        open={open}
        onClose={() => handleModalClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box container sx={modalStyle} className='modal'>
            {viewComments
              ? <Comments
                comments={comments}
                setComments={setComments}
                user={user}
                jobToEdit={jobToEdit}
                userReference={userReference}
                handleShowMoreComments={handleShowMoreComments}
                setJobToEdit={setJobToEdit}
              />
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
                currentUser={currentUser}
                handleSetOpen={setOpen}
                handleClose={handleClose}
                feedback={feedback}
                setFeedback={setFeedback}
              />
            }
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default Main;