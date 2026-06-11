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
  postFiles: PostFile[];
  userName?: string;
  avatarUrl?: string;
};

export type Reaction = 'like' | 'dislike' | 'none';

export type PostWithReaction = Post & {
  likeCount: number;
  dislikeCount: number;
  userReaction: Reaction;
  newestLikes?: PostLikeUser[];
};

export type PostLikeUser = {
  userId: number;
  username: string;
  avatarUrl: string | null;
  addedAt: string;
};

export type MainPageResponse = {
  posts: {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostWithReaction[];
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
  items: PostWithReaction[];
  role?: string;
};

export type Comment = {
  id: number;
  content: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  userId: number;
  username: string;
  avatarUrl: string | null;
  userReaction: Reaction;
  replies: Comment[];
};

export type CommentsResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Comment[];
};

export interface PostCommentsParams {
  postId: string;
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'likeCount' | 'dislikeCount';
}

export type UpdatePostReactionRequest = {
  postId: string;
  status: Reaction;
};
