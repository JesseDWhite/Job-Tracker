import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { THEME } from './Theme';

const Footer = (props) => {

  const { themeMode } = props;

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 10,
        transition: 'color .5s, background .5s',
        backgroundColor: THEME[themeMode].header,
        cursor: 'default',
      }}
    >
      <Typography
        sx={{
          textAlign: 'center'
        }}
        variant="body2"
        color="text.secondary">
        It's actually made with &#127866;
      </Typography>
    </Box>
  );
}

export default Footer;