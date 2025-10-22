import { currentUser } from '@clerk/nextjs/server'
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

const Header = async () => {
  const user = await currentUser()

  if (!user) return <div>Não logado!</div>

  return (
    <ClerkProvider
      appearance={{
        variables: {
        },
      }}
    >
      <header className="h-16 flex w-full bg-white justify-between px-5 rounded-xl">
        <div className=" py-2 px-4">
        </div>
        <div className="flex items-center justify-center gap-5 pr-4">
          <Link href="/">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              Página Inicial
            </button>
          </Link>
          <div className="scale-125 flex items-center justify-center">
            <UserButton />
          </div>
        </div>
      </header>
    </ClerkProvider>
  )
}
export default Header;