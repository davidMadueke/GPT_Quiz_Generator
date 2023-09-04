import { getAuthSession } from '@/lib/nextauth'
import Link from 'next/link';
import React from 'react'
import SignInButton from './SignInButton';
import UserAccountNav from './UserAccountNav';
import { ThemeToggle } from './ThemeToggle';

type Props = {}

const Navbar = async (props: Props) => {
    const session = await getAuthSession();
    return (
        <div className='fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2'>
            {/* logo */}
            <div className='flex items-center justify-between h-full gap-2 px-8 '>
            <Link href='/' className='flex items-center gap-2' >
            <p className='rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[4px] md:block dark:border-white'> 
            
            Quizmify Youtube
            
            </p>
            </Link>

            <div className='flex flex-row items-center'>
            <ThemeToggle className='mr-4'/>
            <div className="flex items-center">
                {session?.user ? (
                <UserAccountNav user= {session.user} />
                )
                : (<SignInButton text='Sign In' />)}
            </div>
            </div>
            </div>
        </div>
    )
}

export default Navbar