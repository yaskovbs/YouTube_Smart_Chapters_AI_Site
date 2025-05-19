/* global chrome */
import React from 'react';
import { Alert, AlertTitle, Box, IconButton, Button, Typography, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Error alert component to display errors to the user with special handling for specific errors
 * @param {Object} props - Component props
 * @param {Object|String} props.error - Error message or object
 * @param {Function} props.onDismiss - Function to call when dismissing the error
 * @param {string} props.videoId - Current video ID (optional)
 * @param {Function} props.onReset - Function to call to reset processing (optional)
 * @param {Function} props.onCheckStatus - Function to check processing status (optional)
 */
const ErrorAlert = ({ error, onDismiss, videoId, onReset, onCheckStatus }) => {
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

  // Check if this is the "already being processed" error
  const isProcessingError = errorMessage.includes('already being processed');

  // Handle force reset of processing state
  const handleForceReset = () => {
    if (videoId && onReset) {
      chrome.runtime.sendMessage(
        { type: 'FORCE_RESET_PROCESSING', videoId },
        (response) => {
          if (response && response.success) {
            onReset();
          }
        }
      );
    }
  };

  // Handle checking processing status
  const handleCheckStatus = () => {
    if (videoId && onCheckStatus) {
      chrome.runtime.sendMessage(
        { type: 'GET_PROCESSING_STATUS', videoId },
        (response) => {
          if (response && response.success) {
            onCheckStatus(response.status);
          }
        }
      );
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="error" 
        variant={isProcessingError ? "outlined" : "filled"}
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
        sx={{ 
          alignItems: 'flex-start',
          ...(isProcessingError && { 
            borderColor: '#d32f2f',
            color: '#d32f2f',
            backgroundColor: 'rgba(211, 47, 47, 0.05)'
          })
        }}
      >
        <AlertTitle>{isProcessingError ? "Processing Conflict" : "Error"}</AlertTitle>
        
        {isProcessingError ? (
          <>
            <Typography variant="body2" gutterBottom>
              {errorMessage}
            </Typography>
            
            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
              This can happen when:
            </Typography>
            
            <ul style={{ margin: '0 0 16px 16px', padding: 0 }}>
              <li>You've already requested to process this video</li>
              <li>A previous processing attempt didn't complete properly</li>
              <li>The video is being processed in another tab or window</li>
            </ul>
            
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {videoId && onCheckStatus && (
                <Button 
                  size="small" 
                  startIcon={<InfoIcon />} 
                  variant="outlined" 
                  color="info"
                  onClick={handleCheckStatus}
                >
                  Check Status
                </Button>
              )}
              
              {videoId && onReset && (
                <Button 
                  size="small" 
                  startIcon={<RestartAltIcon />} 
                  variant="contained" 
                  color="error"
                  onClick={handleForceReset}
                >
                  Reset & Try Again
                </Button>
              )}
            </Stack>
          </>
        ) : (
          errorMessage
        )}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
