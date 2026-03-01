import { Modal } from "@/shared/ui";
import { PostPage } from "../../postPage/PostPage";
import { Post } from "@/entities/post/model/types/postApi.types";

export default async function ProfilePage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }, 
  searchParams: { postId?: string } 
}) {
  const { id } = params;
  const { postId } = searchParams;

  // SSR: Получаем данные поста, если есть postId в URL
  let postData = null;
  if (postId) {
    const res = await fetch(`https://api/v1/posts/post/${postId}`);
    postData = await res.json() as Post;
  }

  return (
    <>      
      {/* Если в URL есть postId, рендерим клиентскую модалку */}
      {postId && postData && (
        <Modal open={true}> <PostPage post={postData}/> </Modal>
      )}
    </>
  );
}