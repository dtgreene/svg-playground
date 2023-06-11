import { createContext, useCallback, useState } from 'react';
import { Snackbar } from '@mui/material';

const defaultContext = {
  showMessage: () => {},
};
export const SnackContext = createContext(defaultContext);

export const SnackProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = useCallback((message) => {
    setMessage(message);
    setIsOpen(true);
  }, []);

  const handleSnackClose = () => {
    setIsOpen(false);
  };

  return (
    <SnackContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={message}
      />
    </SnackContext.Provider>
  );
};
