'use client';

import { useState } from 'react';
import { CreatePostDialog } from '@/entities/post/ui/CreatePostDialog';

export const Create = () => {
  const [open, setOpen] = useState(true);
  return <CreatePostDialog open={open} onOpenChange={setOpen} />;
};
