import React from 'react';
import { Box } from '@mui/material';
import emptyStateLight from '../assets/img/empty-state_ccexpress.png';
import emptyStateDark from '../assets/img/empty-state-dark_ccexpress.png';
import { AnimateKeyframes } from 'react-simple-animate';

const EmptyState = (props) => {

  const { themeMode } = props;

  return (
    <Box>
      <AnimateKeyframes
        play
        iterationCount={1}
        keyframes={["opacity: 0", "opacity: 1"]}
      >
        <img
          src={themeMode === 'darkMode' ? emptyStateDark : emptyStateLight}
          style={{
            width: '35%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          alt="empty state" />
      </AnimateKeyframes>
    </Box>
  )
}

export default EmptyState;