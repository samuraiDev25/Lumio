'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from "@/widgets/header/ui";
import { Sidebar } from "@/widgets/sidebar/ui";
import { useGetPostByIdQuery } from "@/entities/post/api/postApi";
import { Modal } from "@/shared/ui";
import { useMeQuery } from "@/features/auth/api/authApi";
import { PostPage } from '../postPage/PostPage';
import { Loading } from '@/shared/ui/loading/Loading';
import { Post } from '@/entities/post/model/types/postApi.types';

type Props = {
    post: Post
}

export default function ViewPost ({post}: Props) {
    const router = useRouter();
    const {data: user, isLoading} = useMeQuery()
    const {data: postUser} = useGetPostByIdQuery('8daddaca-e803-4fee-923d-1092f5717cd0')

    const [isOpen, setIsOpen] = useState(false)

    if(user?.userId) {
        if(postUser?.id) {
            router.push(`/profile/${user.userId}/${postUser.id}`)
            setIsOpen(true)
        }
    }


    const handleClose = () => {
    // Определяем, откуда пришел пользователь
    const referer = document.referrer || '';
    
    if (referer.includes('/profile')) {
        router.push(`/profile/${user?.userId}`);
    } else {
        router.push('/');
    }
};


    return (
    <>
    {user ? <Header/> : <Loading/>}
    {user ? <Sidebar/> : <Loading/>}
    <Modal open={isOpen} onClose={handleClose} showCloseButton={true}><PostPage post={post}/></Modal>
    </> 
    )
}

