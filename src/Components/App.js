import '../App.css';
import React, { useState, useEffect } from 'react';
import Home from './Home';
import { Grid } from '@mui/material';

function App() {
  return (
    <>
      <Grid
        container
      >
        <Home />
      </Grid>
    </>
  );
}

export default App;
