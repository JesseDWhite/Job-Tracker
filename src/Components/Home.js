import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import NewJob from './NewJob';
import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import MasterList from './MasterList';
import { format } from 'date-fns';
import Auth from './Auth';
import {
  signOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { auth } from '../firebase';
import Header from './Header';
import Doc from '../Constants/Test2.docx';
import Doc2 from '../Constants/Test.pdf';
import { WordExtractor } from 'word-extractor';
import axios from 'axios';
import mammoth from 'mammoth';
import { Buffer } from 'buffer';

const Home = () => {

  const jobsReference = collection(db, 'jobs');

  const [jobs, setJobs] = useState([]);

  const [searchJobs, setSearchJobs] = useState(jobs);

  const [cardView, setCardView] = useState(true);

  const [formValues, setFormValues] = useState();

  const [editing, setEditing] = useState(false);

  const [applicationCount, setApplicationCount] = useState(0);

  const [user, setUser] = useState({});

  const [sort, setSort] = useState(false);

  const [test, setTest] = useState('');

  const fileInput = useRef();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const getJobs = async () => {
    const data = await getDocs(jobsReference);
    const newSearchJobs = data.docs.map((doc) =>
    ({
      ...doc.data(), id: doc.id
    }));

    newSearchJobs.sort((a, b) => {
      const newA = a.dateApplied;
      const newB = b.dateApplied;
      if (newA < newB) {
        return 1;
      }
      if (newA > newB) {
        return -1;
      }
      return 0;
    })
    setSearchJobs(newSearchJobs);
    setJobs(newSearchJobs);
  }

  const getFilteredApplications = () => {
    const newJobs = [...jobs];
    const filteredView = newJobs.filter(job => job.user.includes(user?.uid));
    console.log(filteredView);
    return filteredView;
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  }

  const sortByDate = () => {
    const newJobs = [...searchJobs];
    const sortedByDate = newJobs.sort((a, b) => {
      const newA = a.dateApplied;
      const newB = b.dateApplied;
      if (newA < newB) {
        return 1;
      }
      if (newA > newB) {
        return -1;
      }
      return 0;
    })
    setSearchJobs(sortedByDate);
    setSort(!sort);
  }

  const sortByName = () => {
    const newJobs = [...searchJobs];
    const sortedByName = newJobs.sort((a, b) => {
      const newA = a.company.toLowerCase();
      const newB = b.company.toLowerCase();
      if (newA < newB) {
        return -1;
      }
      if (newA > newB) {
        return 1;
      }
      return 0;
    })
    setSearchJobs(sortedByName);
    setSort(!sort);
  }

  const getApplicationTotal = () => {
    const newJobs = [...jobs];
    setApplicationCount(0);
    const todaysDate = format(new Date(), 'yyyy-MM-dd');
    newJobs.map(job => {
      const appDate = format(new Date(job.dateApplied.replace(/-/g, '\/')), 'yyyy-MM-dd');
      if (appDate === todaysDate && job.user === user?.uid) {
        setApplicationCount(prevState => prevState += 1);
      }
    });
    console.log(user.uid)
  }

  const readFile = (file) => {
    if (file) {
      file = document.getElementById('coverLetter').files[0];
      // const URLObject = URL.createObjectURL(file);
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        const result = fileReader.result;
        console.log(result);
        console.log(Buffer.from(result, 'base64').toString('ascii'));
      }
      fileReader.onerror = (error) => {
        console.log('error', error.message)
      }
    }
  }

  const readDoc = async (file) => {
    file = document.getElementById('coverLetter').files[0];
    // fs.readFileSync(Doc, 'utf8', function (error, data) {
    //   error ? console.log(error.message) : console.log(data);
    // });
    await axios.get(file).then(res => {
      const converted = res.data;
      console.log('file successful', res);
      console.log('CONVERTED', converted);
      setTest(converted);
    }).catch(error => {
      setTest(error.message);
      console.log('file unsuccessful', error.message);
    });
  }

  const readDoc2 = (file) => {
    file = document.getElementById('coverLetter').files[0];
    const extractor = new WordExtractor();
    const extracted = extractor.extract(file);
    extracted.then(doc => {
      console.log(doc.getBody())
    }).catch(error => {
      console.log(error.message)
      console.log(extracted)
    })
  }

  const readDoc3 = (file) => {
    file = document.getElementById('coverLetter').files[0];
    const urlObj = URL.createObjectURL(file);
    mammoth.extractRawText({ path: urlObj })
      .then(result => {
        const text = result.value;
        const messages = result.messages;
        console.log('text', text);
      }).catch(error => {
        console.log(error.message)
      });
    console.log(urlObj)
  }

  const readTextFile = (file) => {
    file = document.getElementById('coverLetter').files[0];
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          const allText = rawFile.responseText;
          console.log(allText);
        }
      }
    }
    rawFile.send(null);
  }


  useEffect(() => {
    getJobs();
    // readDoc4();
    // console.log(URL.createObjectURL(Doc2));
  }, []);

  useEffect(() => {
  }, [cardView])

  useEffect(() => {
    getApplicationTotal();
  }, [getJobs])

  return (
    <>
      <Grid
        display='flex'
        sx={{
          mt: 10
        }}
      >
        {/* <input
          type='file'
          accept='.doc,.docx,application/msword,application/pdf'
          ref={fileInput}
          onChange={readTextFile}
          name='coverLetter'
          id='coverLetter'
        /> */}
        <Grid
          sm={8}
          sx={{
            m: 3,
          }}
        >
          <Grid>
            {user?.email ?
              <MasterList
                cardView={cardView}
                editing={editing}
                setEditing={setEditing}
                jobs={searchJobs}
                setJobs={setJobs}
                searchJobs={searchJobs}
                setSearchJobs={setSearchJobs}
                getFilteredApplications={getFilteredApplications}
              />
              : <h1>NOT SIGNED IN</h1>
            }
          </Grid>
        </Grid>
        <Grid
          sm={4}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              mr: 3,
              // maxWidth: '30vw',
              // position: 'fixed',
            }}
          >
            {!user?.email ?
              <Auth />
              : <NewJob
                jobsReference={jobsReference}
                getJobs={getJobs}
                editing={editing}
                setEditing={setEditing}
                formValues={formValues}
                setFormValues={setFormValues}
                jobs={jobs}
                setJobs={setJobs}
                searchJobs={searchJobs}
                setSearchJobs={setSearchJobs}
                user={user}
              />
            }
          </Paper>
        </Grid>
      </Grid>
      <Header
        user={user}
        logout={logout}
        sortByDate={sortByDate}
        sortByName={sortByName}
        cardView={cardView}
        setCardView={setCardView}
        sort={sort}
        setSort={setSort}
        jobs={jobs}
        setSearchJobs={setSearchJobs}
        applicationCount={applicationCount}
        setApplicationCount={setApplicationCount}
      />
    </>
  );
};

export default Home;