import { SyntheticEvent, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface msgProps {
  open: boolean,
  text: string,
  type: 'error'
  | 'info'
  | 'success'
  | 'warning',
  close: () => void,
}

export default function Msg (props: msgProps) {

  const { open, text, type, close } = props;

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    close();
  };

  return (
    <Snackbar 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 
      open={open} 
      autoHideDuration={8000} 
      onClose={handleClose}
      sx={{}}
    >
      <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}
