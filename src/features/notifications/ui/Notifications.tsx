'use client';

import s from './Notifications.module.scss';
import * as Popover from '@radix-ui/react-popover';
import { NotificationItem } from './NotificationItem';
import { Typography } from '@/shared/ui';
import { OutlineBell } from '@/shared/ui/icons';

export const Notifications = () => {
  const count = 9;

  const mockNotifications = Array(10).fill({
    title: 'Новое уведомление!',
    message: 'Следующий платеж у вас спишется через 1 день',
    isRead: false,
    createdAt: '1 час назад',
  });

  return (
    <Popover.Root>
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

          <div className={s.scrollArea}>
            <div className={s.list}>
              {mockNotifications.map((item, index) => (
                <NotificationItem
                  key={index}
                  title={item.title}
                  message={item.message}
                  isRead={index > 2}
                  createdAt={item.createdAt}
                />
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
