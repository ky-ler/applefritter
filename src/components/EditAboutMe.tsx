import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { BiEdit } from "react-icons/bi";
import { FiX } from "react-icons/fi";
import TextareaAutosize from "react-textarea-autosize";
import { trpc } from "../utils/trpc";

const EditAboutMe = ({ userName }: { userName: string }) => {
  const { register, handleSubmit } = useForm();

  const router = useRouter();

  const updateAboutMe = trpc.user.updateAboutMe.useMutation();

  if (updateAboutMe.isSuccess) {
    router.reload();
  }

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="align-bottom text-2xl duration-300 active:-translate-y-1 active:transition-transform disabled:active:translate-y-0">
            <BiEdit />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-y-1/2 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-neutral-900 p-6">
            <Dialog.Title className="mb-4 font-semibold">
              Edit About Me
            </Dialog.Title>

            {/* <fieldset className="mb-4 flex gap-5"> */}
            <div className="flex flex-col items-center space-y-4">
              {/* <div className="flex flex-col items-center justify-center md:flex-row"> */}
              <label htmlFor="about" className="sr-only mb-2 md:mb-0 md:mr-4">
                Edit About Me
              </label>
              <TextareaAutosize
                {...register("about")}
                placeholder="About me..."
                minRows={3}
                minLength={0}
                maxLength={160}
                className="w-full rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 transition-all focus:border-current focus:outline-none focus:ring-transparent"
              />
              {/* </div> */}
            </div>

            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button
                  onClick={handleSubmit((data) => {
                    console.log(data.about);
                    updateAboutMe.mutate({
                      userName: userName,
                      about: data.about,
                    });
                  })}
                  className="mt-2 flex cursor-pointer items-center justify-center rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:active:bg-transparent"
                >
                  Save
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
export default EditAboutMe;
