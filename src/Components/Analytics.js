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
  IconButton,
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
import { ArrowForwardIosTwoTone, ArrowBackIosTwoTone } from '@mui/icons-material';

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

  const [weekNumber, setWeekNumber] = useState(0);

  const prevWeek = () => {
    setWeekNumber(prevState => prevState += 6)
  }

  const nextWeek = () => {
    if (weekNumber !== 0) {
      setWeekNumber(prevState => prevState -= 6);
    }
  }

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

  const handleWeeklyNumbers = () => {
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
              format(sub(new Date(), { days: 6 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 5 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 4 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 3 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 2 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 1 + weekNumber }), 'PP'),
              format(sub(new Date(), { days: 0 + weekNumber }), 'PP'),
            ],
            datasets: [
              {
                label: 'Number of Applications',
                data: [
                  getNumberOfDailyApplications(6 + weekNumber),
                  getNumberOfDailyApplications(5 + weekNumber),
                  getNumberOfDailyApplications(4 + weekNumber),
                  getNumberOfDailyApplications(3 + weekNumber),
                  getNumberOfDailyApplications(2 + weekNumber),
                  getNumberOfDailyApplications(1 + weekNumber),
                  getNumberOfDailyApplications(0 + weekNumber),
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.75)'
              },
              {
                label: 'Average Score',
                data: [
                  getDailyAverageScore(6 + weekNumber),
                  getDailyAverageScore(5 + weekNumber),
                  getDailyAverageScore(4 + weekNumber),
                  getDailyAverageScore(3 + weekNumber),
                  getDailyAverageScore(2 + weekNumber),
                  getDailyAverageScore(1 + weekNumber),
                  getDailyAverageScore(0 + weekNumber),
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
      <Button
        sx={{
          float: 'left'
        }}
        startIcon={<ArrowBackIosTwoTone />}
        onClick={() => prevWeek()}
      >
        Previous Week
      </Button>
      <Button
        sx={{
          float: 'right'
        }}
        onClick={() => nextWeek()}
        disabled={weekNumber !== 0 ? false : true}
        endIcon={<ArrowForwardIosTwoTone />}
      >
        Next Week
      </Button>
    </>
  )
}

export default Analytics;