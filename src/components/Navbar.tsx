import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <header className="border-neutral-800 md:block md:w-2/12 md:border-r-2">
        <nav className="fixed bottom-0 flex h-24 w-screen border-t-2 border-neutral-800 bg-neutral-900 py-8 md:sticky md:bottom-auto md:top-0 md:h-screen md:w-full md:justify-center md:border-t-0">
          <div className="flex h-auto w-full items-center text-2xl md:h-full md:w-auto md:flex-col  md:space-x-0 md:space-y-3 ">
            <ul className="flex h-full w-full items-center justify-around md:h-auto md:flex-col md:items-start md:justify-between md:space-x-0 md:space-y-3">
              {!session && (
                <li>
                  <Link href="/">All Posts</Link>
                </li>
              )}
              {session?.user?.username && (
                <>
                  <li>
                    <Link href="/home">Feed</Link>
                  </li>
                  <li>
                    <Link href="/">All</Link>
                  </li>
                  <li>
                    <Link href={`/user/${session?.user?.username}`}>
                      Profile
                    </Link>
                  </li>
                </>
              )}
              <>
                {session ? (
                  <li>
                    <button onClick={() => signOut()} className="md:hidden">
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link href="/login">
                      <button className="md:hidden">Log In</button>
                    </Link>
                  </li>
                )}
              </>
            </ul>
            <ul className="hidden justify-end md:flex md:h-full md:flex-col md:space-x-0 md:space-y-3">
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
                  <Link href="/login">
                    <button className="rounded-md border-2 border-zinc-800 p-2 transition-colors hover:border-zinc-600 focus:outline-none active:border-zinc-600 active:bg-neutral-800">
                      Log In
                    </button>
                  </Link>
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
