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
  Stack,
  Box
} from '@mui/material';
import { THEME } from '../Constants/Theme';
import { DataGrid } from '@mui/x-data-grid';

const Profile = (props) => {

  const {
    user,
    logout,
    jobs,
    currentUser,
    themeMode
  } = props;

  const [average, setAverage] = useState(0);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
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
    <Box>
      <Stack spacing={4}>
        <Card
          elevation={3}
          sx={{
            maxWidth: 500,
            minHeight: 500,
            p: 3,
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
          </CardActions>
        </Card>
        {currentUser.role === 'Admin' || currentUser.role === 'Advisor'
          ? <Box sx={{
            height: 400,
            width: '100%'
          }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </Box>
          : null
        }
      </Stack>
    </Box>
  )
}

export default Profile;