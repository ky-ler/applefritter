import * as Dialog from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { BiEdit } from "react-icons/bi";
import { FiTrash, FiX } from "react-icons/fi";
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
      utils.posts.getFollowingPosts.cancel();
      const optimisticUpdate = utils.posts.getAll.getData();
      const optimisticUpdateTwo = utils.posts.getFollowingPosts.getData();

      if (optimisticUpdate) {
        utils.posts.getAll.setData(undefined, optimisticUpdate);
      }
      if (optimisticUpdateTwo) {
        utils.posts.getFollowingPosts.setData(
          { userId: postUserId },
          optimisticUpdateTwo
        );
      }
    },
    onSettled: () => {
      utils.posts.getAll.invalidate();
      utils.posts.getFollowingPosts.invalidate();
    },
  });

  if (!session || session.user?.id !== postUserId) return null;

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="align-bottom text-2xl duration-300 active:-translate-y-1 active:transition-transform disabled:active:translate-y-0">
            <FiTrash />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-y-1/2 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-neutral-900 p-6">
            <Dialog.Title className="mb-4 font-semibold">
              Are you sure you want to delete?
            </Dialog.Title>

            {/* <fieldset className="mb-4 flex gap-5"> */}
            <div className="flex flex-col items-center space-y-4"></div>

            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button
                  onClick={() => {
                    deletePost.mutate({ postId: postId });
                  }}
                  className="mt-2 flex cursor-pointer items-center justify-center rounded-md border-2 border-red-800 p-2 transition-colors hover:border-red-600 focus:outline-none active:border-red-600 active:bg-neutral-800 disabled:cursor-not-allowed disabled:hover:border-red-800 disabled:active:bg-transparent"
                >
                  Delete
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                aria-label="Close"
              >
                <FiX />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* <span className="ml-1">{postReplies.length}</span> */}
    </>
  );
};
