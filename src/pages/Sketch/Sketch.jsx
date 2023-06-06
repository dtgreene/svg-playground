import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Typography,
  Link,
  Grid,
  Button,
  Box,
  Alert,
  useTheme,
  Snackbar,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import copy from 'copy-to-clipboard';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';
import formatXml from 'xml-formatter';

import { setup } from '../../code/setup';
import { createSVGScript, removeSVGScript } from '../../utils';
import { SketchSaveContext, ModalContext } from '../../contexts';
import { ConfirmModal } from '../../components';
import { sketches } from '../../sketches';

// add global values to the window
setup(window);

export const Component = () => {
  const { index } = useParams();
  const codeEditor = useRef();
  const hasListeners = useRef(false);
  const svgContainer = useRef();
  const codeValue = useRef('');
  const [initialCode, setInitialCode] = useState('');
  const [savedSketch, setSavedSketch] = useState(null);
  const [savedTime, setSavedTime] = useState(null);
  const { deleteSavedSketch, getSavedSketch, saveSketch } =
    useContext(SketchSaveContext);
  const { open } = useContext(ModalContext);
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [snackMessage, setSnackMessage] = useState('');
  const [showSnack, setShowSnack] = useState(false);

  const { id, defaultCode } = useMemo(() => sketches[index] ?? {}, [index]);

  const cleanUp = useCallback(() => {
    removeSVGScript(document.head);

    if (svgContainer.current) {
      svgContainer.current.innerHTML = '';
    }
  }, []);

  const updateSVG = useCallback(() => {
    cleanUp();

    if (!codeValue.current || !svgContainer.current) return;

    try {
      const functionName = createSVGScript(codeValue.current, document.head);

      // clear any error
      setError(null);

      // run the script
      const svg = window[functionName]();
      svgContainer.current.innerHTML = '';
      svgContainer.current.appendChild(svg);

      svgContainer.current.style = `box-shadow: 0 0 16px ${theme.palette.primary.main};`;

      setTimeout(
        () => (svgContainer.current.style = `box-shadow 0.3s ease-in-out;`),
        200
      );
    } catch (error) {
      setError(error.message);
    }
  }, [theme, cleanUp]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 83 && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        // save the sketch
        const savedValue = saveSketch(id, codeValue.current);
        setSavedSketch(savedValue);
        setSavedTime(dayjs(savedValue.timestamp).format('MM/DD/YYYY hh:mm:ss'));

        setSnackMessage('Sketch saved!');
        setShowSnack(true);

        updateSVG();
      }
    };

    // Listen for control/command + s key combo while preventing
    // multiple listeners being added.
    if (codeEditor.current && !hasListeners.current) {
      hasListeners.current = true;
      codeEditor.current.editor.addEventListener(
        'keydown',
        handleKeyDown,
        false
      );
    }

    // try to load the sketch
    const savedValue = getSavedSketch(id);

    if (savedValue) {
      setSavedSketch(savedValue);
      setSavedTime(dayjs(savedValue.timestamp).format('MM/DD/YYYY hh:mm:ss'));

      // update the code value
      codeValue.current = savedValue.value;
    } else {
      codeValue.current = defaultCode;
    }

    setInitialCode(codeValue.current);
    // perform the initial update
    updateSVG();

    return () => {
      // remove event listener
      if (codeEditor.current && hasListeners.current) {
        hasListeners.current = false;
        codeEditor.current.editor.removeEventListener(
          'keydown',
          handleKeyDown,
          false
        );
      }
      cleanUp();
    };
  }, [getSavedSketch, saveSketch, updateSVG, cleanUp, id, defaultCode]);

  const handleSnackClose = () => {
    setSnackMessage('');
    setShowSnack(false);
  };

  const handleCopyClick = () => {
    if (svgContainer.current) {
      try {
        copy(
          formatXml(svgContainer.current.innerHTML, { lineSeparator: '\n' })
        );
      } catch (error) {
        console.error(`Could not format SVG: ${error}`);
        copy(svgContainer.current.innerHTML);
      }

      setSnackMessage('Sketch copied!');
      setShowSnack(true);
    }
  };

  const handleCodeChange = (value) => {
    // set the ref value instead of state
    codeValue.current = value;
  };

  const handleDownloadClick = () => {
    if (svgContainer.current) {
      const blob = new Blob([svgContainer.current.innerHTML], {
        type: 'data:image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);

      FileSaver.saveAs(url, `output_${Date.now()}.svg`);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = await open(ConfirmModal, {
      description:
        'Your changes to this sketch will be deleted and replaced by the default value.  Are you sure?',
    });

    if (confirmed) {
      deleteSavedSketch(id);

      setSavedSketch(null);
      setSavedTime(null);
      setInitialCode(defaultCode);
      codeValue.current = defaultCode;

      setSnackMessage('Saved changes deleted');
      setShowSnack(true);

      updateSVG();
    }
  };

  return (
    <>
      <Link
        component={RouterLink}
        to="/"
        variant="button"
        display="inline-flex"
        gap={0.5}
        alignItems="center"
      >
        <ArrowBackIcon />
        <span>Back</span>
      </Link>
      <Typography variant="h3" mb={4} textAlign="center">
        Sketch #{index}
      </Typography>
      {!id && <Box>Sketch not found</Box>}
      {id && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              ref={svgContainer}
              maxWidth={1200}
              borderRadius={4}
              mb={2}
              sx={{
                transition: 'box-shadow 0.2s ease-in-out',
                '& svg': {
                  width: '100%',
                  height: '100%',
                },
              }}
            />
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={handleCopyClick}>
                Copy SVG
              </Button>
              <Button
                variant="outlined"
                type="button"
                onClick={handleDownloadClick}
              >
                Download SVG
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <CodeMirror
                value={initialCode}
                onChange={handleCodeChange}
                extensions={[javascript()]}
                theme={tokyoNightStorm}
                ref={codeEditor}
              />
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Script generated the following error: <b>{error}</b>
              </Alert>
            )}
            {savedSketch && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Last saved at {savedTime}
              </Alert>
            )}
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={updateSVG}>
                Apply
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                disabled={!savedSketch}
              >
                Delete Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={showSnack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
    </>
  );
};
