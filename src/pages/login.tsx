import * as Dialog from "@radix-ui/react-dialog";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading")
    return <div className="flex flex-col items-center pt-4">Loading...</div>;

  if (status === "authenticated") router.push("/home");

  return (
    <Dialog.Root open={true} defaultOpen={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-y-1/2 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-neutral-900 p-6">
          <Dialog.Title className="mb-4 font-semibold">
            Login to AppleFritter
          </Dialog.Title>

          <div className="flex flex-col justify-around space-y-4 md:items-center">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default Login;
