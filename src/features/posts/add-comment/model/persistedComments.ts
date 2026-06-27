import type { Comment } from '@/entities/post/model/types/postApi.types';

const COMMENTS_STORAGE_KEY = 'lumio:postComments';
export const COMMENTS_UPDATED_EVENT = 'lumio:postCommentsUpdated';

type CommentsByPost = Record<string, Comment[]>;

type AppendResult = {
  comments: Comment[];
  appended: boolean;
};

function normalizeComment(comment: Comment): Comment {
  return {
    ...comment,
    replies: comment.replies?.map(normalizeComment) ?? [],
  };
}

function removeRootDuplicatesFromReplies(comments: Comment[]): Comment[] {
  const nestedIds = new Set<number>();

  const collectNestedIds = (replies: Comment[]) => {
    replies.forEach((reply) => {
      nestedIds.add(reply.id);
      collectNestedIds(reply.replies);
    });
  };

  comments.forEach((comment) => collectNestedIds(comment.replies));

  return comments.filter((comment) => !nestedIds.has(comment.id));
}

function appendCommentToTree(
  comments: Comment[],
  comment: Comment,
  parentCommentId: number,
): AppendResult {
  let appended = false;

  const nextComments = comments.map((item) => {
    if (item.id === parentCommentId) {
      appended = true;
      const exists = item.replies.some((reply) => reply.id === comment.id);

      return {
        ...item,
        replies: exists ? item.replies : [comment, ...item.replies],
      };
    }

    const nextReplies = appendCommentToTree(
      item.replies,
      comment,
      parentCommentId,
    );

    if (!nextReplies.appended) {
      return item;
    }

    appended = true;

    return {
      ...item,
      replies: nextReplies.comments,
    };
  });

  return {
    comments: appended ? nextComments : comments,
    appended,
  };
}

function appendComment(
  comments: Comment[],
  comment: Comment,
  parentCommentId?: number,
  parentComment?: Comment,
): Comment[] {
  if (!parentCommentId) {
    const exists = comments.some((item) => item.id === comment.id);

    return exists ? comments : [comment, ...comments];
  }

  const appendResult = appendCommentToTree(comments, comment, parentCommentId);

  if (appendResult.appended) {
    return appendResult.comments;
  }

  if (!parentComment) {
    return comments;
  }

  const normalizedParent = normalizeComment(parentComment);
  const exists = normalizedParent.replies.some(
    (reply) => reply.id === comment.id,
  );

  return [
    {
      ...normalizedParent,
      replies: exists
        ? normalizedParent.replies
        : [comment, ...normalizedParent.replies],
    },
    ...comments,
  ];
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
  const comments = getCommentsByPost()[postId]?.map(normalizeComment) ?? [];

  return removeRootDuplicatesFromReplies(comments);
}

export function persistComment(
  postId: string,
  comment: Comment,
  parentCommentId?: number,
  parentComment?: Comment,
) {
  if (typeof window === 'undefined') return;

  const commentsByPost = getCommentsByPost();
  const currentComments = removeRootDuplicatesFromReplies(
    commentsByPost[postId]?.map(normalizeComment) ?? [],
  );
  const nextComments = appendComment(
    currentComments,
    normalizeComment(comment),
    parentCommentId,
    parentComment,
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
