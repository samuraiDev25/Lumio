export type Post = {
  id: number;
  url: string;
  postId: number;
};

export type CreatePostRequest = {
  id: number;
  description: string;
  createdAt: string;
  userId: string;
  postFiles: Post[];
};
