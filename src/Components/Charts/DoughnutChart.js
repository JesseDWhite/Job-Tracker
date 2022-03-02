import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { THEME } from '../../Layout/Theme';
import { Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = (props) => {

  const { jobs, themeMode } = props;

  const jobsByStatus = (status) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => job.status === status);
    return filteredJobs.length;
  }

  const data = {
    labels: ['Active', 'Interviews Scheduled', 'Closed'],
    datasets: [
      {
        label: 'Totals',
        data: [jobsByStatus('Active'), jobsByStatus('Interview'), jobsByStatus('Closed')],
        backgroundColor: [
          'rgba(75, 192, 192, 0.75)',
          'rgba(53, 162, 235, 0.75)',
          'rgba(255, 99, 132, 0.75)',

        ],
        borderColor: [
          'rgba(75, 192, 192, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(255, 99, 132, 0.75)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Total Applications',
        color: THEME[themeMode].textColor
      },
      legend: {
        labels: {
          color: THEME[themeMode].textColor,
        }
      },
    },
  }

  return <Doughnut data={data} options={options} />
}

export default DoughnutChart;