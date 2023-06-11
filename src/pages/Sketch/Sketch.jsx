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
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import copy from 'copy-to-clipboard';
import FileSaver from 'file-saver';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';
import formatXml from 'xml-formatter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { setup } from '../../code/setup';
import { createSVGScript, removeSVGScript } from '../../utils';
import { ModalContext, SnackContext } from '../../contexts';
import { ConfirmModal } from '../../components';
import { sketches } from '../../sketches';
import { useSketchStorage } from '../../hooks';

// add global values to the window
setup(window);

const extensions = [javascript()];

const GappedButton = styled(Button)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const SketchControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  margin: theme.spacing(1),
  opacity: 0,
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
}));

const SketchBox = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  transition: theme.transitions.create('box-shadow', {
    duration: theme.transitions.duration.short,
  }),
  '& svg': {
    width: '100%',
    height: '100%',
    border: '1px solid #222',
  },
}));

const SketchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  '&:hover [data-id="sketch-controls"]': {
    opacity: 1,
  },
}));

const SettingsButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  margin: theme.spacing(1),
  padding: theme.spacing(0.5),
  minWidth: 0,
}));

export const Sketch = () => {
  const { index } = useParams();
  const { id, defaultCode } = useMemo(() => sketches[index] ?? {}, [index]);

  const codeEditor = useRef();
  const hasListeners = useRef(false);
  const editorInterval = useRef(false);
  const pendingChanges = useRef(false);
  const sketchElement = useRef();
  const codeValue = useRef('');
  const { deleteSketch, saveSketch, storageValue } = useSketchStorage(id);
  const { open } = useContext(ModalContext);
  const { showMessage } = useContext(SnackContext);
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  const cleanUp = useCallback(() => {
    removeSVGScript(document.head);

    if (sketchElement.current) {
      sketchElement.current.innerHTML = '';
    }
  }, []);

  const updateSVG = useCallback(() => {
    cleanUp();

    if (!codeValue.current || !sketchElement.current) return;

    try {
      // create the SVG
      const functionName = createSVGScript(codeValue.current, document.head);

      // clear any error
      setError(null);

      // run the script
      const svg = window[functionName]();
      sketchElement.current.innerHTML = '';
      sketchElement.current.appendChild(svg);

      sketchElement.current.style = `box-shadow: 0 0 16px ${theme.palette.primary.main};`;

      setTimeout(
        () => (sketchElement.current.style = `box-shadow 0.3s ease-in-out;`),
        200
      );
    } catch (error) {
      setError(error.message);
    }
  }, [theme, cleanUp]);

  const saveCurrentSketch = useCallback(() => {
    // save the sketch
    saveSketch(id, codeValue.current);
    showMessage('Sketch saved!');

    pendingChanges.current = false;

    updateSVG();
  }, [saveSketch, updateSVG, id]);

  const updateEditor = useCallback(() => {
    if (codeEditor.current && codeEditor.current.view) {
      const { dispatch, state } = codeEditor.current.view;
      dispatch({
        changes: {
          from: 0,
          to: state.doc.length,
          insert: codeValue.current,
        },
      });
    }
  }, []);

  useEffect(() => {
    // Listen for control/command + s key combo while preventing
    // multiple listeners being added.
    if (!hasListeners.current && codeEditor.current) {
      const handleKeyDown = (event) => {
        if (event.keyCode === 83 && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          saveCurrentSketch();
        }
      };

      codeEditor.current.editor.addEventListener(
        'keydown',
        handleKeyDown,
        false
      );

      window.onbeforeunload = () => {
        if (pendingChanges.current) {
          return 'Wait! You have unsaved changes that will be lost!';
        }
      };

      hasListeners.current = true;

      return cleanUp;
    }
  }, [saveCurrentSketch, cleanUp]);

  useEffect(() => {
    // avoid performing the initial load multiple times
    if (!hasLoaded && !editorInterval.current) {
      // The editor takes a few cycles before the view and
      // state values are available.
      editorInterval.current = setInterval(() => {
        if (codeEditor.current && codeEditor.current.view) {
          // clear the interval
          clearInterval(editorInterval.current);

          if (storageValue) {
            // update the code value
            codeValue.current = storageValue.value;
          } else {
            codeValue.current = defaultCode;
          }

          // indicate this operation has happened
          setHasLoaded(true);

          updateEditor();
          updateSVG();
        }
      }, 100);
    }
  }, [updateSVG, storageValue, hasLoaded, id, defaultCode]);

  const handleCopyClick = () => {
    if (sketchElement.current) {
      try {
        copy(
          formatXml(sketchElement.current.innerHTML, { lineSeparator: '\n' })
        );
      } catch (error) {
        console.error(`Could not format SVG: ${error}`);
        copy(sketchElement.current.innerHTML);
      }

      showMessage('SVG copied to clipboard!');
    }
  };

  const handleCodeChange = (value) => {
    // set the ref value instead of state
    codeValue.current = value;

    if (storageValue) {
      pendingChanges.current = storageValue.value !== value;
    } else {
      pendingChanges.current = defaultCode !== value;
    }
  };

  const handleDownloadClick = () => {
    if (sketchElement.current) {
      const blob = new Blob([sketchElement.current.innerHTML], {
        type: 'data:image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);

      FileSaver.saveAs(url, `sketch${index}_${Date.now()}.svg`);
      showMessage('SVG downloaded!');
    }
  };

  const handleFormatClick = async () => {
    // close the settings dropdown
    setSettingsAnchor(null);

    try {
      const { format } = (await import('prettier/esm/standalone')).default;
      const parserBabel = (await import('prettier/esm/parser-babel')).default;

      const result = format(codeValue.current, {
        parser: 'babel',
        plugins: [parserBabel],
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      });

      codeValue.current = result;

      updateEditor();
    } catch (error) {
      console.error(`Could not format sketch: ${error}`);
    }
  };

  const handleResetClick = async () => {
    // close the settings dropdown
    setSettingsAnchor(null);

    const confirmed = await open(ConfirmModal, {
      description:
        'Your changes to this sketch will be deleted and replaced by the default value.  Are you sure?',
    });

    if (confirmed) {
      codeValue.current = defaultCode;
      pendingChanges.current = false;

      showMessage('Sketch reset!');

      updateEditor();
      updateSVG();
    }
  };

  const handleDeleteClick = async () => {
    // close the settings dropdown
    setSettingsAnchor(null);

    const confirmed = await open(ConfirmModal, {
      description:
        'Your saved changes to this sketch will be deleted and replaced by the default value.  Are you sure?',
    });

    if (confirmed) {
      deleteSketch(id);

      codeValue.current = defaultCode;
      pendingChanges.current = false;

      showMessage('Saved changes deleted!');

      updateEditor();
      updateSVG();
    }
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const settingsIsOpen = Boolean(settingsAnchor);

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
        <Grid
          container
          spacing={2}
          sx={{ visibility: hasLoaded ? 'visible' : 'hidden' }}
        >
          <Grid item xs={12} md={6}>
            <SketchContainer>
              <SketchBox ref={sketchElement} />
              <SketchControls data-id="sketch-controls">
                <IconButton onClick={handleCopyClick} color="secondary">
                  <ContentCopyIcon />
                </IconButton>
                <IconButton onClick={handleDownloadClick} color="secondary">
                  <DownloadIcon />
                </IconButton>
              </SketchControls>
            </SketchContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="primary.main"
              >
                {storageValue && (
                  <>
                    <CircleIcon />
                    <span>USING LOCAL COPY</span>
                  </>
                )}
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <GappedButton variant="outlined" onClick={saveCurrentSketch}>
                  <SaveIcon />
                  <span>Save</span>
                </GappedButton>
                <GappedButton variant="contained" onClick={updateSVG}>
                  <RefreshIcon />
                  <span>Apply</span>
                </GappedButton>
              </Box>
            </Box>
            <Box sx={{ mb: 2, position: 'relative' }}>
              <CodeMirror
                value=""
                onChange={handleCodeChange}
                extensions={extensions}
                theme={tokyoNightStorm}
                ref={codeEditor}
              />
              <SettingsButton
                onClick={handleSettingsClick}
                variant="outlined"
                color="secondary"
              >
                <SettingsIcon />
                <ArrowDropDownIcon />
              </SettingsButton>
              <Menu
                id="settings-menu"
                anchorEl={settingsAnchor}
                open={settingsIsOpen}
                onClose={handleSettingsClose}
              >
                <MenuItem onClick={handleFormatClick} sx={{ gap: 1 }}>
                  <AutoFixHighIcon />
                  <span>Format</span>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleResetClick} sx={{ gap: 1 }}>
                  <RestartAltIcon />
                  <span>Reset Sketch</span>
                </MenuItem>
                <MenuItem
                  onClick={handleDeleteClick}
                  sx={{ gap: 1 }}
                  disabled={!storageValue}
                >
                  <DeleteIcon />
                  <span>Delete Local Copy</span>
                </MenuItem>
              </Menu>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Script generated the following error: <b>{error}</b>
              </Alert>
            )}
            {storageValue && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Last saved at {storageValue.displayTime}
              </Alert>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
