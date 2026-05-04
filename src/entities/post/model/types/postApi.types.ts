export type PostFile = {
  id: number;
  url: string;
  postId: string;
};

export type Post = {
  id: string;
  description: string;
  createdAt: string;
  userId: number;
  userName: string;
  avatarUrl?: string;
  postFiles: PostFile[];
  likesCount?: number;
  isLiked?: boolean;
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

export type CommentResponse = {
  id: number;
  content: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  userId: number;
  username: string;
  avatarUrl: string;
  userReaction: string;
  replies: [];
};

export type PostLikeMutationResponse = {
  postId: string;
  likesCount: number;
  isLiked: boolean;
};
