import { createContext, useCallback } from 'react';
import { produce } from 'immer';

import { useLocalStorage } from '../hooks';

const noop = () => {};
const defaultContext = {
  deleteSavedSketch: noop,
  getSavedSketch: noop,
  saveSketch: noop,
};
export const SketchSaveContext = createContext(defaultContext);

export const SketchSaveProvider = ({ children }) => {
  const [savedSketches, setSavedSketches] = useLocalStorage('sketches', {});

  const deleteSavedSketch = useCallback(
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

  const getSavedSketch = useCallback(
    (key) => {
      return savedSketches[key] ?? null;
    },
    [savedSketches]
  );

  const saveSketch = useCallback(
    (key, value) => {
      const saveValue = {
        timestamp: Date.now(),
        value,
      };

      setSavedSketches(
        produce((draft) => {
          draft[key] = saveValue;
        })
      );

      return saveValue;
    },
    [setSavedSketches]
  );

  return (
    <SketchSaveContext.Provider
      value={{ deleteSavedSketch, getSavedSketch, saveSketch }}
    >
      {children}
    </SketchSaveContext.Provider>
  );
};
