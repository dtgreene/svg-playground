import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Typography,
  Link,
  Grid,
  Button,
  Box,
  Alert,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import copy from 'copy-to-clipboard';
import FileSaver from 'file-saver';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';

import { setup } from '../../code/setup';
import { createSVGScript, removeSVGScript } from '../../utils';

// add global values to the window
setup(window);

export const Sketch = ({ name, defaultCode }) => {
  const codeValue = useRef(defaultCode);
  const codeEditor = useRef();
  const svgContainer = useRef();
  const theme = useTheme();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSaveCommand = (event) => {
      if (event.keyCode === 83 && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        updateSVG();
      }
    };

    if (codeEditor.current) {
      codeEditor.current.editor.addEventListener(
        'keydown',
        handleSaveCommand,
        false
      );
    }

    return () => {
      if (codeEditor.current) {
        codeEditor.current.editor.removeEventListener(
          'keydown',
          handleSaveCommand,
          false
        );
      }
    };
  }, []);

  const updateSVG = useCallback(() => {
    removeSVGScript(document.head);

    const functionName = createSVGScript(codeValue.current, document.head);

    // clear any error
    setError(null);

    try {
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
  }, [theme]);

  useEffect(() => {
    updateSVG();

    return () => {
      removeSVGScript(document.head);
    };
  }, [updateSVG]);

  const handleCopyClick = () => {
    copy(svgContainer.current.innerHTML);
  };

  const handleCodeChange = (value) => {
    // set the ref value instead of state
    codeValue.current = value;
  };

  const handleDownloadClick = () => {
    const blob = new Blob([svgContainer.current.innerHTML], {
      type: 'data:image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);

    FileSaver.saveAs(url, `${name}.svg`);
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
        {name}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            ref={svgContainer}
            maxWidth={800}
            borderRadius={4}
            sx={{
              transition: 'box-shadow 0.2s ease-in-out',
              '& svg': {
                width: '100%',
                height: '100%',
              },
            }}
          ></Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <CodeMirror
              value={defaultCode}
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
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={updateSVG}>
              Apply
            </Button>
            <Button variant="outlined" type="button" onClick={handleCopyClick}>
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
      </Grid>
    </>
  );
};
