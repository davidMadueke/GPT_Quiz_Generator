"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {}

const QuizMeCard = (props: Props) => {
    const router = useRouter()
  return (
    <Card className='hover:cursor-pointer hover:-y-translate-[4px] hover:opacity-75'
    onClick={()=>{
        router.push('/quiz')
    }}>

        <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-2xl font-bold'>Quiz Me!</CardTitle>
            <GraduationCap size={28} strokeWidth={2.5} />

        </CardHeader>

        <CardContent>
            <p className='text-sm text-muted-foreground'>
                Take a quiz and test your knowledge!
            </p>
        </CardContent>
    </Card>
  )
}

export default QuizMeCard