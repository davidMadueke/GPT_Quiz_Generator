"use client";

import React from 'react'
import { Button } from './button'
import { signIn } from 'next-auth/react'

type Props = {
    text: string
}

const SignInButton = ({text}: Props) => {
  return (
    <Button 
    variant="secondary" 
    className='hover:-translate-y-[1.5px] hover:ease-in-out'
    onClick={() => {
        signIn('google').catch(console.error)
        }
    }
    >
        {text}
    </Button>
  )
}

export default SignInButton