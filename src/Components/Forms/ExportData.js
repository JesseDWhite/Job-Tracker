import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { THEME } from '../../Layout/Theme';

const ExportData = (props) => {

  const {
    user,
    currentUser,
    jobs,
    userReference,
    jobsReference,
    feedback,
    setFeedback,
    handleClose,
    themeMode
  } = props;

  const [exporting, setExporting] = useState(false);

  const downloadExport = (exportPayload) => {
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `job-tracker-export-${currentUser.id}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  const handleExport = async () => {
    setExporting(true);
    try {
      const jobsWithComments = await Promise.all(jobs.map(async (job) => {
        const commentsSnapshot = await getDocs(collection(userReference, `${user.uid}/jobs/${job.id}/comments`));
        const comments = commentsSnapshot.docs.map((commentDoc) => ({
          ...commentDoc.data(), id: commentDoc.id
        }));
        return { ...job, comments };
      }));

      const legacyQuery = query(jobsReference, where('user', '==', user.uid));
      const legacySnapshot = await getDocs(legacyQuery);
      const legacyJobs = legacySnapshot.docs.map((legacyDoc) => ({
        ...legacyDoc.data(), id: legacyDoc.id
      }));

      downloadExport({
        exportedAt: new Date().toISOString(),
        profile: { ...currentUser },
        jobs: jobsWithComments,
        legacyJobs
      });

      setFeedback({
        ...feedback,
        open: true,
        type: 'success',
        title: 'Exported',
        message: 'Your data has been downloaded to your device.'
      });
      setExporting(false);
      handleClose();
    } catch (error) {
      setFeedback({
        ...feedback,
        open: true,
        type: 'error',
        title: 'Error',
        message: 'There was an issue exporting your data. Please try again.'
      });
      setExporting(false);
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        px: 4,
        pb: 4
      }}
    >
      <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
        Export My Data
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Download a JSON file containing your profile, all of your job applications, and their comment history.
      </Typography>
      <Button
        onClick={handleExport}
        variant={THEME[themeMode].buttonStyle}
        color='info'
        fullWidth
        disabled={exporting}
      >
        Download My Data
      </Button>
      {exporting ? <CircularProgress color='info' sx={{ display: 'block', mx: 'auto', mt: 2 }} disableShrink /> : null}
    </Box>
  )
}

export default ExportData;