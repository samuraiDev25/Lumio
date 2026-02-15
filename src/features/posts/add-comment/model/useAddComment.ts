import { useState } from 'react';

export const useAddComment = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim() === '') return;
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment('');
  };

  const updateComment = (value: string) => {
    setNewComment(value);
  };

  return {
    comments,
    newComment,
    addComment,
    updateComment,
  };
};
