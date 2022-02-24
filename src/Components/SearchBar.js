/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { THEME } from '../Layout/Theme';

const SearchBar = (props) => {

  const {
    jobs,
    setSearchJobs,
    themeMode
  } = props;

  const [searchString, setSearchString] = useState('');

  const handleSearch = (e) => {
    const newJobs = [...jobs];
    const filteredJobs = newJobs.filter(job =>
      job.company.toLowerCase().includes(e.toLowerCase()));
    setSearchJobs(filteredJobs);
  }

  const handleInputChange = (e) => {
    const search = e.target.value;
    setSearchString(search);
  }

  useEffect(() => {
    handleSearch(searchString);
  }, [searchString]);

  return (
    <TextField
      sx={{
        ml: 3,
        width: '25%',
      }}
      placeholder='SEARCH COMPANIES'
      variant='standard'
      color='secondary'
      id='searchBar'
      onChange={(e) => handleInputChange(e)}
      value={searchString}
    />
  );
}

export default SearchBar;