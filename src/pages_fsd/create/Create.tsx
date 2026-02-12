'use client';

import { useState } from 'react';
import { CreatePostDialog } from '@/entities/post';

export const Create = () => {
  const [open, setOpen] = useState(true);
  return <CreatePostDialog open={open} onOpenChange={setOpen} />;
};
