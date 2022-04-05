import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { THEME } from '../../Layout/Theme';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = (props) => {

  const { jobs, themeMode } = props;

  const jobsByStatus = (status) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job => job.status === status);
    return filteredJobs.length;
  }

  const data = {
    labels: ['Active', 'Interviews Scheduled', 'Closed', 'Other'],
    datasets: [
      {
        label: 'Totals',
        data: [jobsByStatus('Active'), jobsByStatus('Interview'), jobsByStatus('Closed'), jobsByStatus('Other')],
        backgroundColor: [
          'rgba(75, 192, 192, 0.75)',
          'rgba(53, 162, 235, 0.75)',
          'rgba(255, 99, 132, 0.75)',
          'rgb(255, 152, 0,0.75)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(255, 99, 132, 0.75)',
          'rgb(255, 152, 0, 0.75)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: false,
        text: 'Total Applications',
        color: THEME[themeMode].textColor,
        font: { size: 16, family: 'Readex Pro, sans-serif, normal' }
      },
      legend: {
        labels: {
          color: THEME[themeMode].textColor,
          font: { size: 14 }
        }
      },
      doughnutlabel: {
        labels: [
          {
            text: 'The title',
            font: {
              size: '60'
            }
          }
        ]
      }
    }
  }

  return <Doughnut data={data} options={options} />
}

export default DoughnutChart;