'use client'

import { Button } from "@/shared/ui"
import s from './CommentForm.module.scss'
import { useAddCommentMutation } from "@/entities/post/api/postApi"
import { ChangeEvent, FormEvent, useState } from "react"

type Props = {
    postId: string
}

export const AddComment = ({ postId }: Props) => {
    const [text, setText] = useState('');
    const [addComment, { isLoading }] = useAddCommentMutation();

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    try {
        await addComment({postId, content: trimmedText}).unwrap();
        setText('');
    } catch (error) {
        console.error('Failed to post comment:', error);
    }
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
        setText(value);
    }
};

const isButtonDisabled = !text.trim() || isLoading;

    return (
        <form onSubmit={handleSubmit} className={s.inputWrapper}>
            <input
                style={{flex: 1, background: 'none', border: 'none'}}
                value={text}
                onChange={handleChange}
                placeholder={"Add a Comment..."}
                maxLength={300}
        />
            <Button 
                className={s.submitButton}
                type="submit"
                disabled={isButtonDisabled}
                variant={'outline'}
            >
                Publish
            </Button>
    </form>
    )
}