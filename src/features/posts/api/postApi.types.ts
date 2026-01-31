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
