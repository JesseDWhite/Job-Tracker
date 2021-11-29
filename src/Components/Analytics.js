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
import {
  Button,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { AnimateKeyframes } from 'react-simple-animate';

const Analytics = () => {
  return (
    <Card
      elevation={3}
      sx={{
        minHeight: 500,
        pl: 3,
        pr: 3,
        pt: 3,
        textAlign: 'center'
      }}
    >
      <Typography
        sx={{
          mt: '18%',
        }}
        variant='h3'
        component='div'
      >
        Analytics Coming Soon
      </Typography>
    </Card>
  )
}

export default Analytics;