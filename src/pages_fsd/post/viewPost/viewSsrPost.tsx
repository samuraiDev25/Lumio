// import { useGetPostByIdQuery } from "@/entities/post/api/postApi";
// import { GetMyPostsResponse } from "@/entities/post/model/types/postApi.types"
// import PostsList from "@/entities/post/ui/PostsList/PostsList";

// export default async function ViewSsrPost () {
//         const response = await fetch('http://localhost:3000/api/v1/posts/my')
//         const data = await response.json() as GetMyPostsResponse;

//     return (
//         <PostsList posts={data.items}/>
//     )
// }

// export async function getServerSideProps({ params }: any) {
//   const { id: profileId, postId } = params;
  
//   try {
//     // Загружаем пост на сервере
//     const post = await useGetPostByIdQuery(postId);
    
//     return {
//       props: {
//         initialPost: post,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         initialPost: null,
//       },
//     };
//   }
// }