'use client';

import Link from 'next/link';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { SearchUser, useSearchUsersQuery } from '@/entities/user';
import { TextField, Typography } from '@/shared/ui';
import { getUserProfileRoute } from '@/shared/lib/routes/routes';
import s from './Search.module.scss';

const RECENT_REQUESTS_LIMIT = 5;
const MIN_SEARCH_LENGTH = 3;

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

const UserItem = ({ user }: { user: SearchUser }) => (
  <li className={s['user-item']}>
    <Link
      className={s['user-link']}
      href={getUserProfileRoute(String(user.id))}
    >
      {user.avatarUrl ? (
        <img className={s.avatar} src={user.avatarUrl} alt={user.userName} />
      ) : (
        <span className={s['avatar-placeholder']}>
          {getInitial(user.userName)}
        </span>
      )}

      <span className={s['user-info']}>
        <Typography as="span" variant="bold_text_14">
          <u>{user.userName}</u>
        </Typography>
        <Typography as="span" variant="small_text" color="secondary">
          {user.userName}
        </Typography>
      </span>
    </Link>
  </li>
);

export function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [recentRequests, setRecentRequests] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(searchValue.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  const {
    data: users = [],
    isFetching,
    isError,
  } = useSearchUsersQuery(
    { username: debouncedValue, pageSize: 10 },
    { skip: debouncedValue.length < MIN_SEARCH_LENGTH },
  );

  const showRecentRequests = debouncedValue.length === 0;
  const showEmptyResult =
    debouncedValue.length >= MIN_SEARCH_LENGTH &&
    !isFetching &&
    !isError &&
    users.length === 0;

  const saveRecentRequest = (request: string) => {
    const nextRequests = [
      request,
      ...recentRequests.filter((item) => item !== request),
    ].slice(0, RECENT_REQUESTS_LIMIT);

    setRecentRequests(nextRequests);
  };

  const handleSearchSubmit = (value: string) => {
    const request = value.trim();

    if (!request) {
      return;
    }

    saveRecentRequest(request);
    setDebouncedValue(request);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    handleSearchSubmit(event.currentTarget.value);
  };

  const renderedUsers = useMemo(
    () => users.map((user) => <UserItem key={user.id} user={user} />),
    [users],
  );

  return (
    <section className={s['search-page']}>
      <div className={s.header}>
        <Typography as="h1" variant="h1">
          Search
        </Typography>

        <TextField
          className={s['search-field']}
          search
          value={searchValue}
          placeholder="Search"
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          onBlur={(event) => handleSearchSubmit(event.currentTarget.value)}
          onEnter={handleEnter}
        />
      </div>

      <div className={s.content}>
        {showRecentRequests ? (
          <>
            <Typography as="h2" variant="h2">
              Recent requests
            </Typography>

            <div className={s['section-block']}>
              {recentRequests.length > 0 ? (
                <ul className={s['recent-list']}>
                  {recentRequests.map((request) => (
                    <li key={request}>
                      <button
                        type="button"
                        className={s['recent-button']}
                        onClick={() => {
                          setSearchValue(request);
                          setDebouncedValue(request);
                        }}
                      >
                        {request}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={s['empty-state']}>
                  <Typography color="secondary" variant="regular_text_14">
                    Oops! This place looks empty!
                  </Typography>
                  <Typography color="secondary" variant="small_text">
                    No recent requests.
                  </Typography>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={s['section-block']}>
            {isFetching && (
              <Typography color="secondary" variant="regular_text_14">
                Searching...
              </Typography>
            )}

            {users.length > 0 && (
              <ul className={s['user-list']}>{renderedUsers}</ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
