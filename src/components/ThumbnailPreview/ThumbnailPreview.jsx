import React, { useEffect, useRef } from 'react';

import html from './index.html?raw';
import { createSVGScript } from '../../utils';
import { setup } from '../../code';

const maxAttempts = 3;

export const ThumbnailPreview = ({ code }) => {
  const frame = useRef();
  const interval = useRef();
  const setupAttempts = useRef(0);

  useEffect(() => {
    if (frame.current) {
      const { contentWindow } = frame.current;

      if (interval.current) {
        clearInterval(interval.current);
      }

      // Setting up immediately will sometimes not work.  I think
      // this is due to the iframe being mounted and unmounted so
      // maybe only in dev this happens.
      interval.current = setInterval(() => {
        if (setupAttempts.current >= maxAttempts) {
          clearInterval(interval.current);
        } else {
          setupIframe(contentWindow, code);
          setupAttempts.current++;
        }
      }, 250);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [code]);

  return (
    <iframe
      ref={frame}
      srcDoc={html}
      width={400}
      height={400}
      style={{ border: 'none' }}
    ></iframe>
  );
};

function setupIframe(contentWindow, code) {
  const { document: frameDocument } = contentWindow;
  const currentScript = frameDocument.querySelector('#svg-script');

  if (!currentScript) {
    // add global values to the window
    setup(contentWindow);

    const functionName = createSVGScript(code, frameDocument.head);
    const svg = contentWindow[functionName]();

    frameDocument.body.appendChild(svg);
  }
}
