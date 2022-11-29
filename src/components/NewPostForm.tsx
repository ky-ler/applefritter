import { useSession } from "next-auth/react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
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

  const handleSubmit = () => {
    if (session !== null) {
      newPost.mutate({
        authorId: session.user?.id as string,
        content,
      });
    }

    setContent("");
  };

  return (
    <div className="flex flex-col">
      <TextareaAutosize
        value={content}
        placeholder="New post..."
        minLength={2}
        maxLength={280}
        onChange={(event) => setContent(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 transition-all focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={content.length < 1}
        className="mt-2 cursor-pointer rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800"
      >
        Submit
      </button>
    </div>
  );
};
