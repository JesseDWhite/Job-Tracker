import React, { useEffect, useState } from 'react';
import {
  TextField,
} from '@mui/material';

const SearchBar = (props) => {

  const {
    jobs,
    setSearchJobs
  } = props;

  const [searchString, setSearchString] = useState();

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
    <>
      <TextField
        sx={{
          width: '90%',
          height: 50,
        }}
        placeholder='SEARCH COMPANIES'
        variant='standard'
        id='searchBar'
        onChange={(e) => handleInputChange(e)}
        value={searchString}
      />
    </>
  );
}

export default SearchBar;