import { useSession } from "next-auth/react";
import { FiTrash2 } from "react-icons/fi";
import { trpc } from "../utils/trpc";

export const DeletePostBtn = ({
  postId,
  postUserId,
}: {
  postId: string;
  postUserId: string;
}) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const deletePost = trpc.posts.deletePost.useMutation({
    onMutate: () => {
      utils.posts.getAll.cancel();
      const optimisticUpdate = utils.posts.getAll.getData();

      if (optimisticUpdate) {
        utils.posts.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  if (!session || session.user?.id !== postUserId) return null;

  return (
    <button
      onClick={() => {
        deletePost.mutate({ postId: postId });
      }}
      className="align-middle text-2xl"
    >
      <FiTrash2 />
    </button>
  );
};
