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
import { AnimateKeyframes } from 'react-simple-animate';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getDay, format, getDayOfYear, sub } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = (props) => {

  const {
    jobs,
  } = props;

  const getDailyAverageScore = (daysToSub) => {
    const newJobs = [...jobs];
    const dateToCompare = format(sub(new Date(), { days: daysToSub }), 'yyyy-MM-dd');
    let score = 0;
    let count = 0;
    newJobs.map(job => {
      if (job.dateApplied === dateToCompare) {
        count += 1
        score += parseInt(job.score);
      }
    })
    return parseInt(score / count);
  }

  const getNumberOfDailyApplications = (daysToSub) => {
    const newJobs = [...jobs];
    const dateToCompare = format(sub(new Date(), { days: daysToSub }), 'yyyy-MM-dd');
    let total = 0;
    newJobs.map(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '\/')), 'yyyy-MM-dd');
      if (dateToCompare === appDate) {
        total += 1;
      }
    })
    return total;
  }

  return (
    <>
      <Card
        elevation={3}
        sx={{
          maxHeight: 500,
          pl: 3,
          pr: 3,
          pt: 3,
          textAlign: 'center'
        }}
      >
        <Bar
          height={500}
          width={600}
          data={{
            labels: [
              format(sub(new Date(), { days: 6 }), 'PP'),
              format(sub(new Date(), { days: 5 }), 'PP'),
              format(sub(new Date(), { days: 4 }), 'PP'),
              format(sub(new Date(), { days: 3 }), 'PP'),
              format(sub(new Date(), { days: 2 }), 'PP'),
              format(sub(new Date(), { days: 1 }), 'PP'),
              format(sub(new Date(), { days: 0 }), 'PP')
            ],
            datasets: [
              {
                label: 'Number of Applications',
                data: [
                  getNumberOfDailyApplications(6),
                  getNumberOfDailyApplications(5),
                  getNumberOfDailyApplications(4),
                  getNumberOfDailyApplications(3),
                  getNumberOfDailyApplications(2),
                  getNumberOfDailyApplications(1),
                  getNumberOfDailyApplications(0),
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.75)'
              },
              {
                label: 'Average Score',
                data: [
                  getDailyAverageScore(6),
                  getDailyAverageScore(5),
                  getDailyAverageScore(4),
                  getDailyAverageScore(3),
                  getDailyAverageScore(2),
                  getDailyAverageScore(1),
                  getDailyAverageScore(0),
                ],
                backgroundColor: 'rgba(53, 162, 235, 0.75)'
              },
            ]
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '7-Day Total'
              }
            }
          }}
        />
      </Card>
    </>
  )
}

export default Analytics;