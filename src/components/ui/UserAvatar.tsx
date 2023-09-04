import { User } from 'next-auth'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

type Props = {
    user: Pick<User, "image" | "name">;
}

const UserAvatar = ({user}: Props) => {
  return (
    <Avatar>
        <AvatarImage src={user.image!} alt={user.name!} />
        <AvatarFallback>{user.name}</AvatarFallback>
    </Avatar>

  )
}

export default UserAvatar