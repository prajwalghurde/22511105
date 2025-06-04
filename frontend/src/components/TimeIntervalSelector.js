import React from 'react';
import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

const TimeIntervalSelector = ({ minutes, setMinutes }) => {
  const handleChange = (event, newMinutes) => {
    if (newMinutes !== null) {
      setMinutes(newMinutes);
    }
  };

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        Select Time Interval (minutes):
      </Typography>
      <ToggleButtonGroup
        value={minutes}
        exclusive
        onChange={handleChange}
        aria-label="Time Interval"
      >
        <ToggleButton value={5}>5</ToggleButton>
        <ToggleButton value={10}>10</ToggleButton>
        <ToggleButton value={30}>30</ToggleButton>
        <ToggleButton value={50}>50</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default TimeIntervalSelector;
