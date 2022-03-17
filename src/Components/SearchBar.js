/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const SearchBar = (props) => {

  const {
    jobs,
    setSearchJobs,
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
        width: '20%',
      }}
      size='small'
      label='Search Companies'
      variant='outlined'
      id='searchBar'
      onChange={(e) => handleInputChange(e)}
      value={searchString}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchRoundedIcon />
          </InputAdornment>
        )
      }}
    />
  );
}

export default SearchBar;