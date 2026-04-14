export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type GetNotificationsResponse = {
  items: Notification[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  unreadCount: number;
};

export type UnreadCountResponse = {
  count: number;
};

export type GetHistoryParams = {
  pageNumber?: number;
  pageSize?: number;
};
