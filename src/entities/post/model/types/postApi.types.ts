export type PostFile = {
  id: number;
  url: string;
  postId: number;
};

export type Post = {
  id: number;
  description: string;
  createdAt: string;
  userId: number;
  userName: string;
  avatarUrl?: string;
  postFiles: PostFile[];
};

export type MainPageResponse = {
  posts: {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Post[];
  };
  allRegisteredUsersCount: number;
};
export type GetMyPostsRequest = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type GetMyPostsResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Post[];
};
