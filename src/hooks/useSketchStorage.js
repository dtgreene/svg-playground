import { useCallback } from 'react';
import { produce } from 'immer';
import dayjs from 'dayjs';

import { useLocalStorage } from '../hooks';

export const useSketchStorage = (key) => {
  const [savedSketches, setSavedSketches] = useLocalStorage('sketches', {});

  const deleteSketch = useCallback(
    (key) => {
      if (savedSketches[key]) {
        setSavedSketches(
          produce((draft) => {
            delete draft[key];
          })
        );
      }
    },
    [savedSketches]
  );

  const saveSketch = useCallback((key, value) => {
    const timestamp = Date.now();
    const saveValue = {
      timestamp,
      displayTime: dayjs(timestamp).format('MM/DD/YYYY hh:mm:ss'),
      value,
    };

    setSavedSketches(
      produce((draft) => {
        draft[key] = saveValue;
      })
    );

    return saveValue;
  }, []);

  const storageValue = savedSketches[key] ?? null;

  return {
    deleteSketch,
    saveSketch,
    storageValue,
  };
};
