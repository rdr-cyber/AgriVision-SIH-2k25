
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { HerbSample } from '@/lib/types';

interface SampleContextType {
  samples: HerbSample[];
  addSample: (sample: HerbSample) => void;
  updateSample: (sampleId: string, updates: Partial<HerbSample>) => void;
}

export const SampleContext = createContext<SampleContextType>({
  samples: [],
  addSample: () => {},
  updateSample: () => {},
});

interface SampleProviderProps {
  children: ReactNode;
}

const SAMPLES_STORAGE_KEY = 'agrivision-samples';

export const SampleProvider: React.FC<SampleProviderProps> = ({ children }) => {
  const [samples, setSamples] = useState<HerbSample[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const storedSamples = window.localStorage.getItem(SAMPLES_STORAGE_KEY);
      // If nothing in storage, start with an empty array.
      return storedSamples ? JSON.parse(storedSamples) : [];
    } catch (error) {
      console.error('Error reading samples from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(SAMPLES_STORAGE_KEY, JSON.stringify(samples));
    } catch (error) {
      console.error('Error writing samples to localStorage', error);
    }
  }, [samples]);

  const addSample = (sample: HerbSample) => {
    setSamples((prevSamples) => [sample, ...prevSamples]);
  };

  const updateSample = (sampleId: string, updates: Partial<HerbSample>) => {
    setSamples((prevSamples) =>
      prevSamples.map((sample) =>
        sample.id === sampleId ? { ...sample, ...updates } : sample
      )
    );
  };

  return (
    <SampleContext.Provider value={{ samples, addSample, updateSample }}>
      {children}
    </SampleContext.Provider>
  );
};
