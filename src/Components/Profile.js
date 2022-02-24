/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Grid,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Box,
} from '@mui/material';
import { THEME } from '../Layout/Theme';
import { DataGrid } from '@mui/x-data-grid';
import Analytics from './Charts/Analytics';
import UserUpload from './Forms/UserUpload';

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser,
    themeMode,
    students
  } = props;

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

  const [average, setAverage] = useState(0);

  const [open, setOpen] = useState(false);

  const columnsTest = [
    // { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Full Name', width: 300 },
    { field: 'role', headerName: 'Status', width: 200 },
    { field: 'cohort', headerName: 'Cohort', width: 200 },
    { field: 'email', headerName: 'Email', width: 400 },
  ];

  const getTotalApplicationAverage = () => {
    const newJobs = [...jobs];
    setAverage(0);
    const averageToDivide = newJobs.length;
    newJobs.map(job => {
      return (
        setAverage(prevState => prevState += parseInt(job.score))
      )
    })
    setAverage(prevState => parseInt(prevState / averageToDivide));
  }

  useEffect(() => {
    getTotalApplicationAverage();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle} className='modal'>
            <UserUpload />
          </Box>
        </Fade>
      </Modal>
      <Grid display='flex' sx={{ ml: 3, mr: 3 }}>
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="start"
          spacing={4}
        >
          <Grid sx={{ mt: 4 }} sm={6} xl={4} item>
            <Card
              elevation={3}
              sx={{
                maxWidth: 500,
                minHeight: '100%',
                p: 3,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor
              }}
              container
            >
              <CardMedia
                sx={{
                  borderRadius: '100%',
                  width: 200,
                  objectFit: 'contain',
                  mr: 'auto',
                  ml: 'auto',
                  textAlign: 'center'
                }}
                component='img'
                alt='user profile photo'
                image={user?.photoURL.replace('s96-c', 's400-c')}
              />
              <CardContent>
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
                <hr />
                <Typography
                  sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                  gutterBottom
                  component='div'
                >
                  Advisor: {currentUser.advisor}
                </Typography>
                <Typography
                  sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                  gutterBottom
                  component='div'
                >
                  Cohort: {currentUser.cohort}
                </Typography>
                <Typography
                  sx={{ textAlign: 'center', fontSize: '1.25rem' }}
                  gutterBottom
                  variant='h5'
                  component='div'
                >
                  {`Average Score: ${average > 0 ? average : 0}/100`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='contained'
                  color='error'
                  onClick={logout}
                >
                  Sign Out
                </Button>
                <Button
                  fullWidth
                  color='info'
                  variant='contained'
                  onClick={() => setOpen(true)}>
                  Add Users
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid sx={{ mt: 4 }} sm={12} xl={8} item>
            <Analytics jobs={jobs} themeMode={themeMode} />
          </Grid>
          <Grid sm={12} xl={8} item>
            {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
              ? <Paper
                elevation={3}
                sx={{
                  transition: 'color .5s, background .5s',
                  height: 500,
                  width: '100%',
                  background: THEME[themeMode].card,
                  mb: 4
                }}>
                <DataGrid
                  sx={{
                    transition: 'color .5s, background .5s',
                    color: THEME[themeMode].textColor,
                    border: 'none'
                  }}
                  rows={students}
                  columns={columnsTest}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                />
              </Paper>
              : null
            }
          </Grid>
          <Grid sm={6} xl={4} item>
            <Card
              elevation={3}
              sx={{
                maxWidth: 500,
                minHeight: 500,
                // p: 3,
                mb: 3,
                transition: 'color .5s, background .5s',
                background: THEME[themeMode].card,
                color: THEME[themeMode].textColor
              }}
              container
            >
              <CardContent>
                TOTAL APPLICATIONS
              </CardContent>
              <CardActions>
                HERE ARE SOME ACTIONS IF YOU WANT
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile;