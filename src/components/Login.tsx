import * as Dialog from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";
import { FiX } from "react-icons/fi";

export const Login = () => {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800">
            Log In
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-y-1/2 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-neutral-900 p-6">
            <Dialog.Title className="mb-4 font-semibold">Log In</Dialog.Title>

            <div className="flex flex-col justify-around space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-0">
              <button
                onClick={() => signIn("discord")}
                className="rounded-md border-2 border-zinc-800 p-6 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800 md:p-2"
              >
                Login with Discord
              </button>
              <button
                onClick={() => signIn("google")}
                className="rounded-md border-2 border-zinc-800 p-6 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800 md:p-2"
              >
                Login with Google
              </button>
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
    </>
  );
};
