import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Login } from "./Login";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    // <header className="max-w-1/3 flex min-h-screen w-1/3 flex-col items-end justify-center">
    <>
      <header className="border-neutral-800 md:block md:w-2/12 md:border-r-2">
        <nav className="fixed bottom-0 flex h-24 w-screen justify-center border-t-2 border-neutral-800 bg-neutral-900 py-8 md:sticky md:bottom-auto md:top-0 md:h-screen md:w-auto md:border-t-0">
          <div className="flex h-full items-center justify-between space-x-3 text-2xl md:flex-col  md:space-x-0 md:space-y-3 ">
            <ul className="flex space-x-3 md:flex-col md:space-x-0 md:space-y-3">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href={`/user/${session?.user?.username}`}>Profile</Link>
              </li>
            </ul>
            <ul className="flex md:flex-col md:space-x-0 md:space-y-3">
              {session ? (
                <li>
                  <button
                    onClick={() => signOut()}
                    className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Login />
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};
export default Navbar;
