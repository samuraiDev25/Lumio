import s from './NotificationItem.module.scss';
import { Typography } from '@/shared/ui';

type NotificationItemProps = {
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const NotificationItem = ({
  title,
  message,
  isRead,
  createdAt,
}: NotificationItemProps) => {
  return (
    <div className={`${s.item} ${!isRead ? s.unread : ''}`}>
      <div className={s.header}>
        <div className={s.titleWrapper}>
          <Typography variant="bold_text_14">{title}</Typography>
          {!isRead && (
            <Typography variant="small_text" className={s.newLabel}>
              Новое
            </Typography>
          )}
        </div>
      </div>

      <Typography variant="regular_text_14" className={s.message}>
        {message}
      </Typography>

      <Typography variant="small_text" className={s.date}>
        {createdAt}
      </Typography>
    </div>
  );
};
