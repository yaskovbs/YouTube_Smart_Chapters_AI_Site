import React from 'react';
import { Alert, AlertTitle, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Error alert component to display errors to the user
 * @param {Object} props - Component props
 * @param {Object|String} props.error - Error message or object
 * @param {Function} props.onDismiss - Function to call when dismissing the error
 */
const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;
  
  // Format error message
  let errorMessage = '';
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.message) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="error" 
        variant="filled"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onDismiss}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
