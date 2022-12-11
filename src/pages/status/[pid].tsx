import Image from "next/image";
import { useRouter } from "next/router";
import { FollowBtn } from "../../components/FollowBtn";
import { PostComponent } from "../../components/PostComponent";
import Layout from "../../layouts/Layout";
import { trpc } from "../../utils/trpc";

const User = () => {
  const router = useRouter();
  const { pid } = router.query;

  const { data: posts, isLoading } = trpc.posts.getPostById.useQuery({
    postId: "" + pid,
  });

  console.log(posts);

  // const { data: userInfo } = trpc.user.getUser.useQuery({
  //   username: "" + pid,
  // });

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center pt-4">
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="flex w-full flex-col-reverse break-words">
        {posts?.replies?.map((post, index) => {
          return <PostComponent key={index} post={post} />;
        })}
        {posts?.post?.map((post, index) => {
          return <PostComponent key={index} post={post} />;
        })}
        {posts?.postContext?.map((post, index) => {
          return <PostComponent key={index} post={post} />;
        })}
      </div>
    </Layout>
  );
};

export default User;
