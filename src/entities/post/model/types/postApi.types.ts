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

export type CommentReaction = 'like' | 'dislike' | 'none';

export type Comment = {
  id: number;
  content: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  userId: number;
  username: string;
  avatarUrl: string | null;
  userReaction: CommentReaction;
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

export type PostLikeMutationResponse = {
  postId: string;
  likesCount: number;
  isLiked: boolean;
};
