"use client"
import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

type Props = {
    user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav = ({user}: Props ) => {
  return (
    <div className=''>
    <DropdownMenu> 
        <DropdownMenuTrigger>
        <UserAvatar user={user} />
        </DropdownMenuTrigger>

        <DropdownMenuContent /*className='bg-white'*/ align='end'>
            <div className='flex items-center justify-start gap-2  p-2 '>
            <div className="flex flex-col space-y-1 leading-none">
                {user.name && <p className="font-bold">{user.name}</p>}
                {user.email && <p className="w-[200px] truncate text-sm">{user.email}</p>}
            </div>
            </div>
        

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className=' p-2'>
           <Link href='/'> 
           Hello
           </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem  
            className='text-red-500 cursor-pointer p-2'   
            onClick={(e) => {
            e.preventDefault() 
            signOut().catch(console.error)
            }}>
            <div className='flex flex-row content-start items-center'>
            <LogOut className='w-4 h-4 mr-2 items-center '/>
            Sign Out
            </div>
        </DropdownMenuItem>

        </DropdownMenuContent>

    </DropdownMenu>
    </div>
  )
}

export default UserAccountNav