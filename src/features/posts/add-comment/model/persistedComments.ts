import type { Comment } from '@/entities/post/model/types/postApi.types';

const COMMENTS_STORAGE_KEY = 'lumio:postComments';
export const COMMENTS_UPDATED_EVENT = 'lumio:postCommentsUpdated';

type CommentsByPost = Record<string, Comment[]>;

function normalizeComment(comment: Comment): Comment {
  return {
    ...comment,
    replies: comment.replies?.map(normalizeComment) ?? [],
  };
}

function appendComment(
  comments: Comment[],
  comment: Comment,
  parentCommentId?: number,
): Comment[] {
  if (!parentCommentId) {
    const exists = comments.some((item) => item.id === comment.id);

    return exists ? comments : [comment, ...comments];
  }

  return comments.map((item) => {
    if (item.id === parentCommentId) {
      const exists = item.replies.some((reply) => reply.id === comment.id);

      return {
        ...item,
        replies: exists ? item.replies : [comment, ...item.replies],
      };
    }

    return {
      ...item,
      replies: appendComment(item.replies, comment, parentCommentId),
    };
  });
}

function getCommentsByPost(): CommentsByPost {
  if (typeof window === 'undefined') return {};

  try {
    const value = window.localStorage.getItem(COMMENTS_STORAGE_KEY);

    return value ? (JSON.parse(value) as CommentsByPost) : {};
  } catch {
    return {};
  }
}

export function getPersistedComments(postId: string): Comment[] {
  return getCommentsByPost()[postId]?.map(normalizeComment) ?? [];
}

export function persistComment(
  postId: string,
  comment: Comment,
  parentCommentId?: number,
) {
  if (typeof window === 'undefined') return;

  const commentsByPost = getCommentsByPost();
  const currentComments = commentsByPost[postId]?.map(normalizeComment) ?? [];
  const nextComments = appendComment(
    currentComments,
    normalizeComment(comment),
    parentCommentId,
  );

  commentsByPost[postId] = nextComments;
  window.localStorage.setItem(
    COMMENTS_STORAGE_KEY,
    JSON.stringify(commentsByPost),
  );
  window.dispatchEvent(
    new CustomEvent(COMMENTS_UPDATED_EVENT, { detail: { postId } }),
  );
}
