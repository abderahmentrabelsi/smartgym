import React from 'react';
import { Stack } from '@mui/material';
import { InfinitySpin } from 'react-loader-spinner';

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center w-100">
    <InfinitySpin color="grey" />
  </div>
);

export default Loader;
