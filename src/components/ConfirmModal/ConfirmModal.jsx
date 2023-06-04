import React from 'react';

import { ModalStates } from '../../contexts';
import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material';

export const ConfirmModal = ({ modalState, close, description }) => {
  const isVisible = modalState === ModalStates.MOUNTED_AND_VISIBLE;

  const handleConfirmClick = () => {
    close(true);
  };

  const handleCancelClick = () => {
    close(false);
  };

  return (
    <Dialog open={isVisible} onClose={close}>
      <DialogTitle>Confirm</DialogTitle>
      <Box sx={{ px: 4, pb: 4 }}>
        <Typography>{description}</Typography>
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button variant="outlined" onClick={handleConfirmClick}>
            Confirm
          </Button>
          <Button variant="contained" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
