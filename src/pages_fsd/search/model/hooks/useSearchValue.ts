'use client';

import { useEffect, useState } from 'react';
import { SEARCH_DEBOUNCE_DELAY } from '../constants';

export const useSearchValue = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  const submitSearch = (value: string) => {
    const request = value.trim();

    if (!request) {
      return '';
    }

    setDebouncedValue(request);

    return request;
  };

  const applyRecentRequest = (request: string) => {
    setSearchValue(request);
    setDebouncedValue(request);
  };

  return {
    searchValue,
    debouncedValue,
    setSearchValue,
    submitSearch,
    applyRecentRequest,
  };
};
