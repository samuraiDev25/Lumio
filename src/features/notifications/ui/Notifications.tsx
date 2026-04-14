'use client';

import { UIEvent, useState } from 'react';
import s from './Notifications.module.scss';
import * as Popover from '@radix-ui/react-popover';
import { NotificationItem } from './NotificationItem';
import { Typography } from '@/shared/ui';
import { OutlineBell } from '@/shared/ui/icons';
import {
  useGetNotificationsHistoryQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
} from '../api/notificationsApi';
import { useAppDispatch } from '@/shared/hooks';
import { handleNetworkError } from '@/shared/lib';
import { toast } from 'react-toastify';

export const Notifications = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const { data: unreadData } = useGetUnreadCountQuery();

  const {
    data: historyData,
    isLoading,
    isFetching,
    isError,
  } = useGetNotificationsHistoryQuery({
    pageNumber: page,
    pageSize: 10,
  });

  const [markAsRead] = useMarkAsReadMutation();

  const count = unreadData?.count ?? 0;
  const notifications = historyData?.items ?? [];
  const hasMore = historyData ? page < historyData.pagesCount : false;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      !isFetching &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (!open && count > 0) {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

      if (unreadIds.length > 0) {
        try {
          await markAsRead({ notificationIds: unreadIds }).unwrap();
        } catch (error) {
          handleNetworkError({
            error,
            dispatch,
            handle500Error: () => toast.error('Внутренняя ошибка сервера'),
            handleUnknownError: () =>
              toast.error('Произошла непредвиденная ошибка'),
          });
        }
      }
    }
  };

  return (
    <Popover.Root onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button className={s.trigger} type="button">
          <OutlineBell />
          {count > 0 && <span className={s.badge}>{count}</span>}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={s.content} align="end" sideOffset={8}>
          <div className={s.title}>
            <Typography variant="h3">Уведомления</Typography>
          </div>

          <div className={s.scrollArea} onScroll={handleScroll}>
            <div className={s.list}>
              {isLoading && (
                <Typography style={{ padding: '12px' }}>Loading...</Typography>
              )}

              {isError && (
                <Typography
                  style={{ color: 'var(--color-danger-500)', padding: '12px' }}
                >
                  Ошибка загрузки данных
                </Typography>
              )}

              {!isLoading && !isError && notifications.length === 0 && (
                <div className={s.title}>
                  <Typography variant="h3">
                    У вас пока нет уведомлений
                  </Typography>
                </div>
              )}

              {notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  title={item.title}
                  message={item.message}
                  isRead={item.isRead}
                  createdAt={item.createdAt}
                />
              ))}

              {isFetching && page > 1 && (
                <Typography style={{ padding: '8px', textAlign: 'center' }}>
                  Loading...
                </Typography>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
