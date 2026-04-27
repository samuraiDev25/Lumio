'use client';

import { KeyboardEvent } from 'react';
import { useSearchUsersQuery } from '@/entities/user';
import {
  MIN_SEARCH_LENGTH,
  RECENT_REQUESTS_LIMIT,
  useRecentRequests,
  useSearchValue,
} from '../model';
import { TextField, Typography } from '@/shared/ui';
import { RecentRequestsSection } from './RecentRequestsSection/RecentRequestsSection';
import { SearchResults } from './SearchResults/SearchResults';
import s from './Search.module.scss';

export function Search() {
  const {
    searchValue,
    debouncedValue,
    setSearchValue,
    submitSearch,
    applyRecentRequest,
  } = useSearchValue();
  const { recentRequests, saveRecentRequest } = useRecentRequests(
    RECENT_REQUESTS_LIMIT,
  );

  const {
    data: users = [],
    isFetching,
    isError,
  } = useSearchUsersQuery(
    { username: debouncedValue, pageSize: 10 },
    { skip: debouncedValue.length < MIN_SEARCH_LENGTH },
  );

  const showRecentRequests = debouncedValue.length === 0;
  const showMinSearchLengthWarning =
    debouncedValue.length > 0 && debouncedValue.length < MIN_SEARCH_LENGTH;
  const showEmptyResult =
    debouncedValue.length >= MIN_SEARCH_LENGTH &&
    !isFetching &&
    !isError &&
    users.length === 0;

  const handleSearchSubmit = (value: string) => {
    const request = submitSearch(value);

    if (request.length === 0) {
      return;
    }

    saveRecentRequest(request);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    handleSearchSubmit(event.currentTarget.value);
  };

  return (
    <section className={s.searchPage}>
      <div className={s.header}>
        <Typography as="h1" variant="h1">
          Search
        </Typography>

        <TextField
          className={s.searchField}
          search
          value={searchValue}
          placeholder="Search"
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          onBlur={(event) => handleSearchSubmit(event.currentTarget.value)}
          onEnter={handleEnter}
        />

        {showMinSearchLengthWarning && (
          <Typography color="secondary" variant="small_text">
            Enter at least 3 characters.
          </Typography>
        )}
      </div>

      <div className={s.content}>
        {showRecentRequests ? (
          <RecentRequestsSection
            recentRequests={recentRequests}
            onSelectRequest={applyRecentRequest}
          />
        ) : (
          <SearchResults
            isFetching={isFetching}
            showEmptyResult={showEmptyResult}
            users={users}
          />
        )}
      </div>
    </section>
  );
}
