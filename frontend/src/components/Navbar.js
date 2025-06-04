import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          📊 Stock Dashboard
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Stock Chart</Button>
          <Button color="inherit" component={Link} to="/correlation">Correlation Heatmap</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
