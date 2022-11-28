import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export const NewPostForm = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const utils = trpc.useContext();

  const newPost = trpc.posts.createPost.useMutation({
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

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (session !== null) {
          newPost.mutate({
            authorId: session.user?.id as string,
            content,
          });
        }

        setContent("");
      }}
    >
      <input
        type="text"
        value={content}
        placeholder="New post..."
        minLength={2}
        maxLength={100}
        onChange={(event) => setContent(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        disabled={content.length < 1}
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};
