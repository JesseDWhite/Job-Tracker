import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import NewJob from './NewJob';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  const jobsReference = collection(db, 'jobs');

  useEffect(() => {
    const getJobs = async () => {
      const data = await getDocs(jobsReference);
      setJobs(data.docs.map((doc) =>
      ({
        ...doc.data(), id: doc.id
      })));
    }
    getJobs();
  }, []);

  return (
    <>
      {console.log(jobs)}
      <h1>HOMEPAGE</h1>
      <div>
        <NewJob
          jobsReference={jobsReference}
          jobs={jobs}
        />
      </div>
      <div>
        {jobs.map(job => {
          return (
            <div>
              <p>{job.company}</p>
              <ul>
                <li>{job.jobTitle}</li>
                <li>{job.dateApplied}</li>
                <li>{job.jobDescription}</li>
                <li>{job.status}</li>
              </ul>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Home;