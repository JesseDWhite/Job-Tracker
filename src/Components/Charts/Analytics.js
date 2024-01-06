import React, { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';
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
import { format, sub, getDaysInMonth, getMonth, getYear, subMonths, addMonths } from 'date-fns';
import { ArrowForwardIosTwoTone, ArrowBackIosTwoTone } from '@mui/icons-material';
import { THEME } from '../../Layout/Theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = (props) => {

  const { jobs, themeMode } = props;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [monthLabel, setMonthLabel] = useState('');

  const [labels, setLabels] = useState([]);

  const [data, setData] = useState([]);

  const [disable, setDisable] = useState(true);

  const prevMonth = () => {
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
  }

  const nextMonth = () => {
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
  }

  const getLabels = (current) => {
    const today = new Date(current);
    const daysInMonth = getDaysInMonth(today);
    const month = getMonth(today);
    const year = getYear(today);
    let count = 0;
    let labelsArray = [];
    while (count !== daysInMonth) {
      count++;
      const dayInMonth = format(new Date(year, month, count), 'MM-dd-yy');
      labelsArray.push(dayInMonth);
    }
    setLabels(labelsArray)
  }

  const getDailyAverageScore = (daysToSub) => {
    const newJobs = [...jobs];
    const dateToCompare = format(sub(new Date(), { days: daysToSub }), 'yyyy-MM-dd');
    let score = 0;
    let count = 0;
    newJobs.forEach(job => {
      if (job.dateApplied === dateToCompare) {
        count += 1
        score += parseInt(job.score);
      }
    })
    return parseInt(score / count);
  }

  const getNumberOfDailyApplications = (current) => {
    const today = new Date(current);
    const daysInMonth = getDaysInMonth(today);
    const month = getMonth(today);
    const year = getYear(today);
    let count = 0;
    let apps = [];
    while (count !== daysInMonth) {
      count++;
      const dayInMonth = format(new Date(year, month, count), 'yyyy-MM-dd');
      const appsOnDay = jobs.filter(job => format(new Date(job.dateApplied.replace(/-/g, '/')), 'yyyy-MM-dd') === dayInMonth);
      const num = appsOnDay.length;
      apps.push(num);
    }
    setData(apps);
  }

  useEffect(() => {
    const today = format(new Date(), 'yy-MM');
    const current = format(currentMonth, 'yy-MM');
    const month = format(currentMonth, 'MMMM, yyy');
    setMonthLabel(month)
    getLabels(currentMonth);
    getNumberOfDailyApplications(currentMonth);
    if (today !== current) {
      setDisable(false);
    } else setDisable(true);
  }, [currentMonth]);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 5,
        position: 'relative',
        height: 600,
        p: 3,
        textAlign: 'center',
        transition: 'color .5s, background .5s',
        background: THEME[themeMode].card,
        border: THEME[themeMode].border
      }}
    >
      <Bar
        height={500}
        width={600}
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Number of Applications',
              data: data,
              backgroundColor: 'rgba(255, 99, 132, 0.75)'
            },
          ]
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `${monthLabel} Totals`,
              color: THEME[themeMode].textColor,
              font: { size: 16 }
            },
            legend: {
              labels: {
                color: THEME[themeMode].textColor,
                font: { size: 14 }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: THEME[themeMode].textColor,
                font: { size: 16 },
                stepSize: 1
              }
            },
            x: {
              ticks: {
                color: THEME[themeMode].textColor,
                font: { size: 16 }
              }
            }
          }
        }}
      />
      <Button
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          ml: 3,
          mt: 3
        }}
        startIcon={<ArrowBackIosTwoTone />}
        onClick={() => prevMonth()}
      >
        Previous Month
      </Button>
      <Button
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          mr: 3,
          mt: 3
        }}
        onClick={() => nextMonth()}
        disabled={disable}
        endIcon={<ArrowForwardIosTwoTone />}
      >
        Next Month
      </Button>
    </Card>
  )
}

export default Analytics;