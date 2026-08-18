import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  reauthenticateWithPopup,
  deleteUser,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { THEME } from '../../Layout/Theme';

const DeleteAccount = (props) => {

  const {
    user,
    currentUser,
    userReference,
    jobsReference,
    organizationReference,
    feedback,
    setFeedback,
    themeMode
  } = props;

  const isBlocked = currentUser.role === 'Advisor' || currentUser.role === 'Admin';

  const [confirming, setConfirming] = useState(false);

  const [confirmText, setConfirmText] = useState('');

  const [deleting, setDeleting] = useState(false);

  const deleteUserData = async () => {
    const jobsSubCollection = collection(userReference, `${user.uid}/jobs`);
    const jobsSnapshot = await getDocs(jobsSubCollection);
    for (const jobDoc of jobsSnapshot.docs) {
      const commentsSubCollection = collection(userReference, `${user.uid}/jobs/${jobDoc.id}/comments`);
      const commentsSnapshot = await getDocs(commentsSubCollection);
      for (const commentDoc of commentsSnapshot.docs) {
        await deleteDoc(doc(commentsSubCollection, commentDoc.id));
      }
      await deleteDoc(doc(jobsSubCollection, jobDoc.id));
    }

    const legacyQuery = query(jobsReference, where('user', '==', user.uid));
    const legacySnapshot = await getDocs(legacyQuery);
    for (const legacyDoc of legacySnapshot.docs) {
      await deleteDoc(doc(jobsReference, legacyDoc.id));
    }

    if (currentUser.accessToken && currentUser.internalId) {
      const approvedUsersSubCollection = collection(organizationReference, `${currentUser.accessToken}/approvedUsers`);
      await deleteDoc(doc(approvedUsersSubCollection, currentUser.internalId));
    }

    await deleteDoc(doc(userReference, user.uid));
  }

  const handleDeleteAccount = async () => {
    setDeleting(true);

    try {
      await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider());
    } catch (error) {
      setDeleting(false);
      if (error.code === 'auth/popup-closed-by-user') {
        setFeedback({
          ...feedback,
          open: true,
          type: 'warning',
          title: 'Cancelled',
          message: 'Sign-in was cancelled. Your account was not deleted.'
        });
      } else if (error.code === 'auth/popup-blocked') {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.'
        });
      } else {
        setFeedback({
          ...feedback,
          open: true,
          type: 'error',
          title: 'Error',
          message: 'There was an issue verifying your identity. Please try again.'
        });
      }
      return;
    }

    try {
      await deleteUserData();
      await deleteUser(auth.currentUser);
      // A successful deletion signs the user out. Main.js's onAuthStateChanged listener takes it from here.
    } catch (error) {
      setDeleting(false);
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Deletion Incomplete',
        message: 'Some of your data may not have been fully removed. Please try again.'
      });
    }
  }

  if (isBlocked) {
    return (
      <Box sx={{ height: '100%', px: 4, pb: 4 }}>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Delete Account
        </Typography>
        <Alert severity='warning'>
          Advisors and Admins can't delete their own account while students are still assigned.
          Please reassign or remove your students from Manage Users before deleting your account.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', px: 4, pb: 4 }}>
      <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
        Delete Account
      </Typography>
      {!confirming
        ? <>
          <Typography sx={{ mb: 3 }}>
            This permanently deletes your profile, all of your job applications, their comments, and your organization membership. This cannot be undone.
          </Typography>
          <Button
            onClick={() => setConfirming(true)}
            variant={THEME[themeMode].buttonStyle}
            color='error'
            fullWidth
          >
            Delete My Account
          </Button>
        </>
        : <>
          <Typography sx={{ mb: 2 }}>
            Type <strong>DELETE</strong> to confirm. You'll be asked to sign in again to verify it's you.
          </Typography>
          <TextField
            label='Type DELETE to confirm'
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={deleting}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => ((setConfirming(false), setConfirmText('')))}
              variant='outlined'
              fullWidth
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant={THEME[themeMode].buttonStyle}
              color='error'
              fullWidth
              disabled={confirmText !== 'DELETE' || deleting}
            >
              Delete My Account
            </Button>
          </Box>
          {deleting ? <CircularProgress color='error' sx={{ display: 'block', mx: 'auto', mt: 2 }} disableShrink /> : null}
        </>
      }
    </Box>
  )
}

export default DeleteAccount;